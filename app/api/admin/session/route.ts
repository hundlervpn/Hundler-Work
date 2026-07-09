import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({ authed: isAdminRequest(req) });
}