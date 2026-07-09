import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPool } from "@/lib/db";
import { parseAndValidate } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const ADMIN_ID = 2029065770;

function auth(value: string) {
 const token = process.env.TELEGRAM_BOT_TOKEN;
 return token ? parseAndValidate(value, token) : null;
}

async function ensureChatFeatures(userId: number) {
 const pool = getPool();
 await pool.query(`ALTER TABLE conversations ALTER COLUMN order_id DROP NOT NULL`);
 await pool.query(`ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_support BOOLEAN NOT NULL DEFAULT false`);
 await pool.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL`);
 await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS conversations_support_user_idx ON conversations (client_id) WHERE is_support = true`);
 await pool.query(`CREATE TABLE IF NOT EXISTS chat_message_reactions (
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, telegram_id)
 )`);
 await pool.query(
  `INSERT INTO users (telegram_id, first_name, username)
   VALUES ($1, 'Поддержка Hundler Work', 'hundlerwork_support')
   ON CONFLICT (telegram_id) DO NOTHING`,
  [ADMIN_ID]
 );
 await pool.query(
  `INSERT INTO conversations (client_id, freelancer_id, is_support)
   SELECT $1, $2, true
   WHERE NOT EXISTS (SELECT 1 FROM conversations WHERE client_id = $1 AND is_support = true)`,
  [userId, ADMIN_ID]
 );
}

export async function GET(req: NextRequest) {
 const tg = auth(req.nextUrl.searchParams.get("initData") || "");
 if (!tg) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
 await ensureSchema();
 await ensureChatFeatures(Number(tg.id));
 const pool = getPool();
 const id = req.nextUrl.searchParams.get("id");
 if (id) {
  const access = await pool.query(`SELECT 1 FROM conversations WHERE id=$1 AND (client_id=$2 OR freelancer_id=$2)`, [id, tg.id]);
  if (!access.rowCount) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const result = await pool.query(
   `SELECT m.id,m.sender_id,m.text,m.attachment_name,m.attachment_type,m.attachment_data_url,m.created_at,m.reply_to_id,
    reply.text AS reply_text, reply.attachment_name AS reply_attachment_name,
    COALESCE((SELECT json_object_agg(grouped.emoji, grouped.total) FROM (
     SELECT emoji, COUNT(*)::int total FROM chat_message_reactions WHERE message_id=m.id GROUP BY emoji
    ) grouped), '{}'::json) reactions,
    (SELECT emoji FROM chat_message_reactions WHERE message_id=m.id AND telegram_id=$2 LIMIT 1) my_reaction
    FROM chat_messages m LEFT JOIN chat_messages reply ON reply.id=m.reply_to_id
    WHERE m.conversation_id=$1 ORDER BY m.created_at`,
   [id, tg.id]
  );
  return NextResponse.json({ items: result.rows.map(row => ({
   id: row.id, text: row.text || "", mine: Number(row.sender_id) === Number(tg.id),
   time: new Date(row.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
   attachmentName: row.attachment_name || "", attachmentType: row.attachment_type || "", attachmentDataUrl: row.attachment_data_url || "",
   replyToId: row.reply_to_id || "", replyText: row.reply_text || row.reply_attachment_name || "",
   reactions: row.reactions || {}, myReaction: row.my_reaction || ""
  })) });
 }
 const result = await pool.query(
  `SELECT c.id,c.is_support,COALESCE(o.title,'Поддержка Hundler Work') title,
   CASE WHEN c.is_support THEN 'Администратор'
    WHEN c.client_id=$1 THEN COALESCE(NULLIF(TRIM(CONCAT(f.first_name,' ',f.last_name)),''),f.username,'Исполнитель')
    ELSE COALESCE(NULLIF(TRIM(CONCAT(cl.first_name,' ',cl.last_name)),''),cl.username,'Заказчик') END name,
   CASE WHEN c.is_support THEN NULL WHEN c.client_id=$1 THEN f.photo_url ELSE cl.photo_url END photo_url,
   (SELECT COALESCE(NULLIF(m.text,''),m.attachment_name,'') FROM chat_messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) last
   FROM conversations c LEFT JOIN orders o ON o.id=c.order_id
   JOIN users cl ON cl.telegram_id=c.client_id JOIN users f ON f.telegram_id=c.freelancer_id
   WHERE c.client_id=$1 OR c.freelancer_id=$1 ORDER BY c.is_support DESC,c.created_at DESC`,
  [tg.id]
 );
 return NextResponse.json({ items: result.rows.map(row => ({
  id: row.id, name: row.name, role: row.title,
  last: row.last || (row.is_support ? "Напишите нам, если нужна помощь" : "Диалог создан"),
  time: "", unread: 0, accent: row.is_support ? "violet" : "red", photoUrl: row.photo_url || "", isSupport: Boolean(row.is_support)
 })) });
}

export async function POST(req: NextRequest) {
 const body = await req.json().catch(() => ({}));
 const tg = auth(String(body.initData || ""));
 if (!tg) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
 await ensureSchema();
 await ensureChatFeatures(Number(tg.id));
 const pool = getPool();
 const conversationId = String(body.id || "");
 const access = await pool.query(`SELECT 1 FROM conversations WHERE id=$1 AND (client_id=$2 OR freelancer_id=$2)`, [conversationId, tg.id]);
 if (!access.rowCount) return NextResponse.json({ error: "forbidden" }, { status: 403 });
 if (body.action === "react") {
  const messageId = String(body.messageId || "");
  const emoji = String(body.emoji || "").slice(0, 12);
  const message = await pool.query(`SELECT 1 FROM chat_messages WHERE id=$1 AND conversation_id=$2`, [messageId, conversationId]);
  if (!message.rowCount) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (!emoji) await pool.query(`DELETE FROM chat_message_reactions WHERE message_id=$1 AND telegram_id=$2`, [messageId, tg.id]);
  else await pool.query(`INSERT INTO chat_message_reactions(message_id,telegram_id,emoji) VALUES($1,$2,$3) ON CONFLICT(message_id,telegram_id) DO UPDATE SET emoji=EXCLUDED.emoji`, [messageId, tg.id, emoji]);
  return NextResponse.json({ ok: true });
 }
 const text = String(body.text || "").slice(0, 4000);
 const name = String(body.attachmentName || "").slice(0, 180);
 const type = String(body.attachmentType || "").slice(0, 100);
 const data = String(body.attachmentDataUrl || "");
 const replyToId = body.replyToId ? String(body.replyToId) : null;
 if (!text && !data) return NextResponse.json({ error: "empty" }, { status: 400 });
 if (data.length > 1400000) return NextResponse.json({ error: "file-too-large" }, { status: 400 });
 if (replyToId) {
  const reply = await pool.query(`SELECT 1 FROM chat_messages WHERE id=$1 AND conversation_id=$2`, [replyToId, conversationId]);
  if (!reply.rowCount) return NextResponse.json({ error: "bad-reply" }, { status: 400 });
 }
 await pool.query(
  `INSERT INTO chat_messages(conversation_id,sender_id,text,attachment_name,attachment_type,attachment_data_url,reply_to_id) VALUES($1,$2,$3,$4,$5,$6,$7)`,
  [conversationId, tg.id, text || null, name || null, type || null, data || null, replyToId]
 );
 return NextResponse.json({ ok: true });
}
