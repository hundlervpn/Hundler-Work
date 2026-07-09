import { NextRequest, NextResponse } from "next/server";
import { getPool, ensureSchema } from "@/lib/db";
import { createInvoice, OXAPAY_CONFIGURED } from "@/lib/oxapay";
import { parseAndValidate } from "@/lib/telegram";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Resolve the public base URL used for OxaPay callback/return links.
// Prefer an explicit env var; otherwise derive it from the incoming request.
function baseUrl(req: NextRequest): string {
  const env = process.env.PUBLIC_BASE_URL;
  if (env) return env.replace(/\/+$/, "");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return host ? `${proto}://${host}` : "";
}

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("[deposit] server-misconfigured: TELEGRAM_BOT_TOKEN is not set");
    return NextResponse.json({ error: "server-misconfigured" }, { status: 500 });
  }
  if (!OXAPAY_CONFIGURED) {
    return NextResponse.json({ error: "payments-disabled" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const initData: string | undefined = body?.initData;
  const amount = Number(body?.amount);

  const tg = initData ? parseAndValidate(initData, botToken) : null;
  if (!tg) {
    console.error("[deposit] unauthorized: initData present=", Boolean(initData), "len=", initData ? initData.length : 0);
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "invalid-amount" }, { status: 400 });
  }
  if (amount < 1) {
    return NextResponse.json({ error: "amount-too-small", min: 1 }, { status: 400 });
  }

  await ensureSchema();
  const pool = getPool();

  // Make sure the user row exists (auth normally creates it, but be safe).
  await pool.query(
    `INSERT INTO users (telegram_id) VALUES ($1)
     ON CONFLICT (telegram_id) DO NOTHING;`,
    [tg.id]
  );

  // Pre-create the deposit row so we have an id to use as the OxaPay order id.
  const pre = await pool.query(
    `INSERT INTO deposits (telegram_id, amount, currency, status)
     VALUES ($1, $2, 'USDT', 'pending')
     RETURNING id;`,
    [tg.id, amount]
  );
  const depositId: string = pre.rows[0].id;

  const base = baseUrl(req);
  try {
    const invoice = await createInvoice({
      amount,
      currency: "USDT",
      orderId: depositId,
      description: `Hundler Work balance top-up for ${tg.id}`,
      callbackUrl: process.env.OXAPAY_CALLBACK_URL || (base ? `${base}/api/oxapay/webhook` : undefined),
      returnUrl: base || undefined,
      lifetime: 60,
    });

    await pool.query(
      `UPDATE deposits SET track_id = $1, payment_url = $2, updated_at = now()
       WHERE id = $3;`,
      [invoice.trackId, invoice.paymentUrl, depositId]
    );

    console.log("[deposit] invoice created:", depositId, invoice.trackId);
    return NextResponse.json({
      ok: true,
      depositId,
      trackId: invoice.trackId,
      paymentUrl: invoice.paymentUrl,
    });
  } catch (e: any) {
    console.error("[deposit] oxapay-failed:", e?.message || e);
    await pool.query(
      `UPDATE deposits SET status = 'failed', updated_at = now() WHERE id = $1;`,
      [depositId]
    );
    return NextResponse.json(
      { error: "oxapay-failed", detail: String(e?.message || e) },
      { status: 502 }
    );
  }
}