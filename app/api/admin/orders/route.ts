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
  if (status) { params.push(status); where = "WHERE o.moderation_status = $1"; }
  const r = await pool.query(
    `SELECT o.id, o.title, o.description, o.price, o.currency, o.status,
            o.moderation_status, o.admin_note, o.created_at,
            o.owner_id, u.username, u.first_name, u.last_name
     FROM orders o LEFT JOIN users u ON u.telegram_id = o.owner_id
     ${where}
     ORDER BY o.created_at DESC LIMIT 200;`,
    params
  );
  return NextResponse.json({ items: r.rows });
}

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
  const ms = action === "approve" ? "approved" : "rejected";
  const r = await pool.query(
    `UPDATE orders SET moderation_status = $1, admin_note = $2
     WHERE id = $3 RETURNING id;`,
    [ms, note, id]
  );
  if (!r.rowCount) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}