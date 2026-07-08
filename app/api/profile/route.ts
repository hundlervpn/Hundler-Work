import { NextRequest, NextResponse } from "next/server";
import { getPool, ensureSchema } from "@/lib/db";
import { parseAndValidate } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Saves the freelancer questionnaire ("Заполнить анкету") for the authenticated user.
export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 500 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  const initData = typeof body?.initData === "string" ? body.initData : "";
  const tg = parseAndValidate(initData, botToken);
  if (!tg) {
    return NextResponse.json({ error: "invalid initData" }, { status: 401 });
  }

  const p = body?.profile ?? {};
  const headline = typeof p.headline === "string" ? p.headline.slice(0, 200) : null;
  const about = typeof p.about === "string" ? p.about.slice(0, 2000) : null;
  const skills = typeof p.skills === "string" ? p.skills.slice(0, 500) : null;
  const portfolioUrl =
    typeof p.portfolioUrl === "string" ? p.portfolioUrl.slice(0, 500) : null;
  const currency =
    typeof p.currency === "string" && p.currency ? p.currency.slice(0, 10) : "USDT";
  let hourlyRate: number | null = null;
  if (p.hourlyRate != null && p.hourlyRate !== "") {
    const n = Number(p.hourlyRate);
    hourlyRate = Number.isFinite(n) && n >= 0 ? n : null;
  }

  await ensureSchema();

  const pool = getPool();
  // The user must already exist (created on /api/auth). Ensure a row anyway.
  await pool.query(
    `INSERT INTO users (telegram_id, first_name, last_name, username, photo_url)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (telegram_id) DO NOTHING`,
    [
      tg.id,
      tg.first_name ?? null,
      tg.last_name ?? null,
      tg.username ?? null,
      tg.photo_url ?? null,
    ]
  );

  const { rows } = await pool.query(
    `INSERT INTO freelancer_profiles
       (telegram_id, headline, about, skills, hourly_rate, currency, portfolio_url, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now())
     ON CONFLICT (telegram_id) DO UPDATE
       SET headline = EXCLUDED.headline,
           about = EXCLUDED.about,
           skills = EXCLUDED.skills,
           hourly_rate = EXCLUDED.hourly_rate,
           currency = EXCLUDED.currency,
           portfolio_url = EXCLUDED.portfolio_url,
           updated_at = now()
     RETURNING headline, about, skills, hourly_rate, currency, portfolio_url`,
    [tg.id, headline, about, skills, hourlyRate, currency, portfolioUrl]
  );

  const saved = rows[0];
  return NextResponse.json({
    profile: {
      headline: saved.headline ?? "",
      about: saved.about ?? "",
      skills: saved.skills ?? "",
      hourlyRate: saved.hourly_rate != null ? Number(saved.hourly_rate) : null,
      currency: saved.currency ?? "USDT",
      portfolioUrl: saved.portfolio_url ?? "",
    },
  });
}