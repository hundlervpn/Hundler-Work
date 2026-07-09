import crypto from "crypto";
// Admin credentials & session are configured entirely through env vars so that
// no secrets ever live in the repository. See .env.example.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
// Secret used to sign the session cookie. Falls back to the password so the
// panel still works if only credentials are set, but a dedicated secret is
// strongly recommended.
const ADMIN_SECRET =
  process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD || "hundler-admin";

export const ADMIN_COOKIE = "hw_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export const ADMIN_CONFIGURED = Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);

function sign(payload: string): string {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// Validate a username/password pair against the configured admin account.
export function checkCredentials(username: string, password: string): boolean {
  if (!ADMIN_CONFIGURED) return false;
  return (
    safeEqual(username || "", ADMIN_USERNAME) &&
    safeEqual(password || "", ADMIN_PASSWORD)
  );
}

// Build a signed session token: "<expiresAt>.<hmac>".
export function issueToken(): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = String(exp);
  return payload + "." + sign(payload);
}

// Verify a session token produced by issueToken().
export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = sign(payload);
  if (!safeEqual(mac, expected)) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

// Convenience guard for API routes: returns true when the request carries a
// valid admin session cookie.
export function isAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return verifyToken(token);
}
