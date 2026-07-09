import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { ensureSchema, getPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await ensureSchema();
  const pool = getPool();
  const r = await pool.query(
    `SELECT d.id, d.telegram_id, d.track_id, d.amount, d.currency, d.status,
            d.payment_url, d.created_at, u.username, u.first_name, u.last_name
     FROM deposits d LEFT JOIN users u ON u.telegram_id = d.telegram_id
     ORDER BY d.created_at DESC LIMIT 200;`
  );
  return NextResponse.json({ items: r.rows });
}