import crypto from "crypto";

export type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

// Validates Telegram WebApp initData per the official algorithm:
// secret = HMAC_SHA256(bot_token, key="WebAppData"); hash = HMAC_SHA256(data_check_string, secret).
export function parseAndValidate(
  initData: string,
  botToken: string
): TgUser | null {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const pairs: string[] = [];
  params.forEach((v, k) => {
    pairs.push(`${k}=${v}`);
  });
  const dataCheckString = pairs.sort().join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();
  const computed = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computed !== hash) return null;

  // Reject data older than 24h.
  const authDate = Number(params.get("auth_date") || 0);
  if (authDate && Date.now() / 1000 - authDate > 86400) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw) as TgUser;
  } catch {
    return null;
  }
}