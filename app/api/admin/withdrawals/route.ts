import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { ensureSchema, getPool } from "@/lib/db";
import { createPayout, OXAPAY_PAYOUT_CONFIGURED } from "@/lib/oxapay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baseUrl(req: NextRequest): string {
  const env = process.env.PUBLIC_BASE_URL;
  if (env) return env.replace(/\/+$/, "");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return host ? `${proto}://${host}` : "";
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await ensureSchema();
  const pool = getPool();
  const status = req.nextUrl.searchParams.get("status");
  const params: any[] = [];
  let where = "";
  if (status) { params.push(status); where = "WHERE w.status = $1"; }
  const r = await pool.query(
    `SELECT w.id, w.telegram_id, w.track_id, w.amount, w.currency, w.address,
            w.network, w.status, w.admin_note, w.created_at,
            u.username, u.first_name, u.last_name, u.balance
     FROM withdrawals w LEFT JOIN users u ON u.telegram_id = w.telegram_id
     ${where}
     ORDER BY w.created_at DESC LIMIT 200;`,
    params
  );
  return NextResponse.json({ items: r.rows, payoutEnabled: OXAPAY_PAYOUT_CONFIGURED });
}

// Approve (-> OxaPay payout) or reject (-> refund the held amount).
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = String(body?.id || "");
  const action = String(body?.action || "");
  const note = body?.note != null ? String(body.note) : null;
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  await ensureSchema();
  const pool = getPool();

  if (action === "reject") {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const w = await client.query(
        `SELECT id, telegram_id, amount, status FROM withdrawals WHERE id = $1 FOR UPDATE;`,
        [id]
      );
      if (!w.rowCount) { await client.query("ROLLBACK"); return NextResponse.json({ error: "not-found" }, { status: 404 }); }
      if (w.rows[0].status !== "pending") {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "not-pending" }, { status: 409 });
      }
      await client.query(
        `UPDATE users SET balance = balance + $1, updated_at = now() WHERE telegram_id = $2;`,
        [w.rows[0].amount, w.rows[0].telegram_id]
      );
      await client.query(
        `UPDATE withdrawals SET status = 'rejected', admin_note = $2, updated_at = now() WHERE id = $1;`,
        [id, note]
      );
      await client.query("COMMIT");
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "server-error", detail: String(e?.message || e) }, { status: 500 });
    } finally {
      client.release();
    }
  }

  // action === "approve" -> initiate OxaPay payout
  if (!OXAPAY_PAYOUT_CONFIGURED) {
    return NextResponse.json({ error: "payout-disabled" }, { status: 503 });
  }
  const wr = await pool.query(
    `SELECT id, amount, currency, address, network, status FROM withdrawals WHERE id = $1;`,
    [id]
  );
  if (!wr.rowCount) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const w = wr.rows[0];
  if (w.status !== "pending") return NextResponse.json({ error: "not-pending" }, { status: 409 });

  const base = baseUrl(req);
  try {
    const payout = await createPayout({
      address: w.address,
      currency: w.currency || "USDT",
      amount: Number(w.amount),
      network: w.network || undefined,
      description: `Hundler Work withdrawal ${w.id}`,
      callbackUrl: process.env.OXAPAY_CALLBACK_URL || (base ? `${base}/api/oxapay/webhook` : undefined),
    });
    await pool.query(
      `UPDATE withdrawals SET status = 'approved', track_id = $2, admin_note = $3, updated_at = now() WHERE id = $1;`,
      [id, payout.trackId, note]
    );
    return NextResponse.json({ ok: true, trackId: payout.trackId, payoutStatus: payout.status });
  } catch (e: any) {
    return NextResponse.json({ error: "payout-failed", detail: String(e?.message || e) }, { status: 502 });
  }
}