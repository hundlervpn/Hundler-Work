import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { ensureSchema, getPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await ensureSchema();
  const pool = getPool();
  const status = req.nextUrl.searchParams.get("status");
  const params: any[] = [];
  let where = "";
  if (status) { params.push(status); where = "WHERE f.moderation_status = $1"; }
  const r = await pool.query(
    `SELECT f.telegram_id, f.headline, f.about, f.skills, f.hourly_rate, f.currency,
            f.portfolio_url, f.moderation_status, f.admin_note, f.updated_at,
            u.username, u.first_name, u.last_name
     FROM freelancer_profiles f LEFT JOIN users u ON u.telegram_id = f.telegram_id
     ${where}
     ORDER BY f.updated_at DESC LIMIT 200;`,
    params
  );
  return NextResponse.json({ items: r.rows });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const telegramId = body?.telegram_id ?? body?.telegramId;
  const action = String(body?.action || "");
  const note = body?.note != null ? String(body.note) : null;
  if (!telegramId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  await ensureSchema();
  const pool = getPool();
  const ms = action === "approve" ? "approved" : "rejected";
  const r = await pool.query(
    `UPDATE freelancer_profiles SET moderation_status = $1, admin_note = $2
     WHERE telegram_id = $3 RETURNING telegram_id;`,
    [ms, note, telegramId]
  );
  if (!r.rowCount) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}