import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPool } from "@/lib/db";
import { parseAndValidate } from "@/lib/telegram";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function auth(initData: string) {
 const token = process.env.TELEGRAM_BOT_TOKEN;
 return token ? parseAndValidate(initData, token) : null;
}
function mapOrder(row: any) {
 return { id: row.id, title: row.title, subtitle: row.short_description || "", description: row.description || "", price: Number(row.price), currency: row.currency, tags: row.category ? [row.category] : [], category: row.category || "Другое", days: Number(row.deadline_days || 1), views: Number(row.views || 0), responses: Number(row.responses_count || 0), accent: "red", icon: "code", imageUrl: row.image_data_url || "", ownerName: [row.first_name, row.last_name].filter(Boolean).join(" ") || row.username || "Заказчик", ownerPhoto: row.photo_url || "", status: row.status, moderationStatus: row.moderation_status, assignedFreelancerId: row.assigned_freelancer_id ? Number(row.assigned_freelancer_id) : null, applicants: row.applicants || [] };
}
export async function GET(req: NextRequest) {
 await ensureSchema();
 const pool = getPool();
 const scope = req.nextUrl.searchParams.get("scope") || "feed";
 const initData = req.nextUrl.searchParams.get("initData") || "";
 if (scope === "mine") {
  const tg = auth(initData); if (!tg) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { rows } = await pool.query(`SELECT o.*, u.first_name, u.last_name, u.username, u.photo_url, COUNT(r.id)::int responses_count,
   COALESCE(json_agg(json_build_object('responseId',r.id,'telegramId',r.freelancer_id,'name',COALESCE(NULLIF(TRIM(CONCAT(f.first_name,' ',f.last_name)),''),f.username,'Исполнитель'),'photoUrl',f.photo_url,'status',r.status)) FILTER (WHERE r.id IS NOT NULL), '[]') applicants
   FROM orders o JOIN users u ON u.telegram_id=o.owner_id LEFT JOIN responses r ON r.order_id=o.id LEFT JOIN users f ON f.telegram_id=r.freelancer_id
   WHERE o.owner_id=$1 GROUP BY o.id,u.telegram_id ORDER BY o.created_at DESC`, [tg.id]);
  return NextResponse.json({ items: rows.map(mapOrder) });
 }
 const { rows } = await pool.query(`SELECT o.*, u.first_name,u.last_name,u.username,u.photo_url,COUNT(r.id)::int responses_count FROM orders o JOIN users u ON u.telegram_id=o.owner_id LEFT JOIN responses r ON r.order_id=o.id WHERE o.moderation_status='approved' AND o.status='active' GROUP BY o.id,u.telegram_id ORDER BY o.created_at DESC LIMIT 100`);
 return NextResponse.json({ items: rows.map(mapOrder) });
}
export async function POST(req: NextRequest) {
 const body = await req.json().catch(() => ({}));
 const tg = auth(String(body.initData || "")); if (!tg) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
 await ensureSchema(); const pool = getPool(); const action = String(body.action || "create"); const client = await pool.connect();
 try {
  await client.query("BEGIN");
  if (action === "create") {
   const title=String(body.title||"").trim().slice(0,120), description=String(body.description||"").trim().slice(0,3000), shortDescription=String(body.shortDescription||"").trim().slice(0,160), category=String(body.category||"Другое").slice(0,80), image=String(body.imageUrl||"");
   const price=Number(body.price), days=Math.max(1,Math.min(365,Number(body.days)||1));
   if (!title || !description || !Number.isFinite(price) || price<=0 || image.length>1400000) { await client.query("ROLLBACK"); return NextResponse.json({ error:"bad-request" },{status:400}); }
   const debit=await client.query(`UPDATE users SET balance=balance-$1,updated_at=now() WHERE telegram_id=$2 AND balance >= $1 RETURNING balance`,[price,tg.id]);
   if (!debit.rowCount) { await client.query("ROLLBACK"); return NextResponse.json({error:"insufficient-funds"},{status:409}); }
   const inserted=await client.query(`INSERT INTO orders(owner_id,title,short_description,description,category,deadline_days,image_data_url,price,funds_reserved,status,moderation_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,true,'active','pending') RETURNING id`,[tg.id,title,shortDescription,description,category,days,image||null,price]);
   await client.query("COMMIT"); return NextResponse.json({ok:true,id:inserted.rows[0].id,balance:Number(debit.rows[0].balance)});
  }
  const id=String(body.id||""); const locked=await client.query(`SELECT * FROM orders WHERE id=$1 AND owner_id=$2 FOR UPDATE`,[id,tg.id]);
  if (!locked.rowCount) { await client.query("ROLLBACK"); return NextResponse.json({error:"not-found"},{status:404}); }
  const order=locked.rows[0];
  if (action === "cancel" && ["active"].includes(order.status)) {
   if (order.funds_reserved) await client.query(`UPDATE users SET balance=balance+$1,updated_at=now() WHERE telegram_id=$2`,[order.price,tg.id]);
   await client.query(`UPDATE orders SET status='cancelled',funds_reserved=false WHERE id=$1`,[id]);
  } else if (action === "accept") {
   const freelancerId=Number(body.freelancerId); if (!freelancerId || order.status!=="active" || order.moderation_status!=="approved") throw new Error("bad-state");
   await client.query(`UPDATE responses SET status=CASE WHEN freelancer_id=$1 THEN 'accepted' ELSE 'rejected' END WHERE order_id=$2`,[freelancerId,id]);
   await client.query(`UPDATE orders SET status='in_progress',assigned_freelancer_id=$1 WHERE id=$2`,[freelancerId,id]);
  } else if (action === "complete") {
   if (order.status!=="in_progress" || !order.assigned_freelancer_id || !order.funds_reserved) throw new Error("bad-state");
   await client.query(`UPDATE users SET balance=balance+$1,updated_at=now() WHERE telegram_id=$2`,[order.price,order.assigned_freelancer_id]);
   await client.query(`UPDATE orders SET status='done',funds_reserved=false,completed_at=now() WHERE id=$1`,[id]);
  } else throw new Error("bad-state");
  await client.query("COMMIT"); return NextResponse.json({ok:true});
 } catch (error) { await client.query("ROLLBACK"); return NextResponse.json({error:error instanceof Error?error.message:"failed"},{status:409}); } finally { client.release(); }
}
