import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPool } from "@/lib/db";
import { parseAndValidate } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeName(value: string) {
 return value.replace(/[\r\n"\\/]/g, "_").slice(0, 180) || "attachment";
}

export async function GET(req: NextRequest) {
 const token = process.env.TELEGRAM_BOT_TOKEN;
 const tg = token ? parseAndValidate(req.nextUrl.searchParams.get("initData") || "", token) : null;
 if (!tg) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
 const messageId = req.nextUrl.searchParams.get("messageId") || "";
 await ensureSchema();
 const result = await getPool().query(
  `SELECT m.attachment_name,m.attachment_type,m.attachment_data_url
   FROM chat_messages m JOIN conversations c ON c.id=m.conversation_id
   WHERE m.id=$1 AND (c.client_id=$2 OR c.freelancer_id=$2)`,
  [messageId, tg.id]
 );
 if (!result.rowCount || !result.rows[0].attachment_data_url) return NextResponse.json({ error: "not-found" }, { status: 404 });
 const row = result.rows[0];
 const match = String(row.attachment_data_url).match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
 if (!match) return NextResponse.json({ error: "invalid-attachment" }, { status: 500 });
 const mime = row.attachment_type || match[1] || "application/octet-stream";
 const bytes = match[2] ? Buffer.from(match[3], "base64") : Buffer.from(decodeURIComponent(match[3]), "utf8");
 const disposition = String(mime).startsWith("image/") ? "inline" : "attachment";
 return new NextResponse(new Uint8Array(bytes), {
  headers: {
   "Content-Type": mime,
   "Content-Length": String(bytes.length),
   "Content-Disposition": `${disposition}; filename="${safeName(row.attachment_name || "attachment")}"`,
   "Cache-Control": "private, max-age=31536000, immutable",
  },
 });
}
