import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPool } from "@/lib/db";
import { parseAndValidate } from "@/lib/telegram";
export const runtime="nodejs"; export const dynamic="force-dynamic";
export async function POST(req:NextRequest){
 const body=await req.json().catch(()=>({})); const token=process.env.TELEGRAM_BOT_TOKEN; const tg=token?parseAndValidate(String(body.initData||""),token):null;
 if(!tg)return NextResponse.json({error:"unauthorized"},{status:401}); await ensureSchema(); const pool=getPool();
 const orderId=String(body.orderId||""); const order=await pool.query(`SELECT owner_id,status,moderation_status FROM orders WHERE id=$1`,[orderId]);
 if(!order.rowCount||order.rows[0].owner_id===tg.id||order.rows[0].status!=="active"||order.rows[0].moderation_status!=="approved")return NextResponse.json({error:"unavailable"},{status:409});
 await pool.query(`INSERT INTO responses(order_id,freelancer_id) VALUES($1,$2) ON CONFLICT(order_id,freelancer_id) DO NOTHING`,[orderId,tg.id]);
 return NextResponse.json({ok:true});
}
