export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!ADMIN_CONFIGURED) {
    return NextResponse.json({ error: "admin-disabled" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const username = String(body?.username || "");
  const password = String(body?.password || "");

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "invalid-credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, issueToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
