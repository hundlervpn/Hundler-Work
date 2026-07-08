import { NextRequest, NextResponse } from "next/server";
import { getPool, ensureSchema } from "@/lib/db";
import { parseAndValidate } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Freelancer questionnaire (may not exist yet).
  const { rows: profRows } = await pool.query(
    `SELECT headline, about, skills, hourly_rate, currency, portfolio_url
       FROM freelancer_profiles WHERE telegram_id = $1`,
    [tg.id]
  );
  const prof = profRows[0];

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
      profile: prof
        ? {
            headline: prof.headline ?? "",
            about: prof.about ?? "",
            skills: prof.skills ?? "",
            hourlyRate: prof.hourly_rate != null ? Number(prof.hourly_rate) : null,
            currency: prof.currency ?? "USDT",
            portfolioUrl: prof.portfolio_url ?? "",
          }
        : null,
    },
  });
}