import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getPool, ensureSchema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

// Validates Telegram WebApp initData per the official algorithm:
// secret = HMAC_SHA256(bot_token, key="WebAppData"); hash = HMAC_SHA256(data_check_string, secret).
function parseAndValidate(initData: string, botToken: string): TgUser | null {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const pairs: string[] = [];
  params.forEach((v, k) => {
    pairs.push(`${k}=${v}`);
  });
  const dataCheckString = pairs.sort().join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();
  const computed = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computed !== hash) return null;

  // Reject data older than 24h.
  const authDate = Number(params.get("auth_date") || 0);
  if (authDate && Date.now() / 1000 - authDate > 86400) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw) as TgUser;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 500 }
    );
  }

  let initData = "";
  try {
    const body = await req.json();
    initData = typeof body?.initData === "string" ? body.initData : "";
  } catch {
    // ignore malformed body
  }

  const tg = parseAndValidate(initData, botToken);
  if (!tg) {
    return NextResponse.json({ error: "invalid initData" }, { status: 401 });
  }

  await ensureSchema();

  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO users (telegram_id, first_name, last_name, username, photo_url)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (telegram_id) DO UPDATE
       SET first_name = EXCLUDED.first_name,
           last_name  = EXCLUDED.last_name,
           username   = EXCLUDED.username,
           photo_url  = EXCLUDED.photo_url,
           updated_at = now()
     RETURNING telegram_id, first_name, last_name, username, photo_url, freelancer_id, client_id, balance`,
    [
      tg.id,
      tg.first_name ?? null,
      tg.last_name ?? null,
      tg.username ?? null,
      tg.photo_url ?? null,
    ]
  );

  const u = rows[0];
  return NextResponse.json({
    user: {
      telegramId: Number(u.telegram_id),
      firstName: u.first_name ?? "",
      lastName: u.last_name ?? "",
      username: u.username ?? "",
      photoUrl: u.photo_url ?? "",
      freelancerId: u.freelancer_id,
      clientId: u.client_id,
      balance: Number(u.balance ?? 0),
    },
  });
}