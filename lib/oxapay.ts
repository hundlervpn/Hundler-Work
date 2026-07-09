import crypto from "crypto";

const OXAPAY_BASE = "https://api.oxapay.com/v1";

const MERCHANT_KEY = process.env.OXAPAY_MERCHANT_API_KEY || "";
const PAYOUT_KEY = process.env.OXAPAY_PAYOUT_API_KEY || "";

export type CreateInvoiceParams = {
  amount: number;
  currency?: string; // например "USDT". Если не указать — сумма трактуется как USD.
  orderId: string;
  description?: string;
  callbackUrl?: string;
  returnUrl?: string;
  email?: string;
  lifetime?: number; // минуты (15..2880)
};

export type CreateInvoiceResult = {
  trackId: string;
  paymentUrl: string;
  expiredAt?: number;
  date?: number;
};

/**
 * Создание инвойса на пополнение.
 * POST https://api.oxapay.com/v1/payment/invoice
 */
export async function createInvoice(
  params: CreateInvoiceParams
): Promise<CreateInvoiceResult> {
  if (!MERCHANT_KEY) {
    throw new Error("OXAPAY_MERCHANT_API_KEY is not configured");
  }

  const body: Record<string, unknown> = {
    amount: params.amount,
    order_id: params.orderId,
    lifetime: params.lifetime ?? 60,
  };
  if (params.currency) body.currency = params.currency;
  if (params.description) body.description = params.description;
  if (params.callbackUrl) body.callback_url = params.callbackUrl;
  if (params.returnUrl) body.return_url = params.returnUrl;
  if (params.email) body.email = params.email;

  const res = await fetch(`${OXAPAY_BASE}/payment/invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      merchant_api_key: MERCHANT_KEY,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json || json.error) {
    const msg =
      json?.error?.message || json?.message || `OxaPay error (${res.status})`;
    throw new Error(`OxaPay createInvoice failed: ${msg}`);
  }

  const data = json.data;
  if (!data?.payment_url || !data?.track_id) {
    throw new Error("OxaPay createInvoice: unexpected response");
  }

  return {
    trackId: String(data.track_id),
    paymentUrl: String(data.payment_url),
    expiredAt: data.expired_at,
    date: data.date,
  };
}

export type CreatePayoutParams = {
  address: string;
  currency: string; // например "USDT"
  amount: number;
  network?: string;
  callbackUrl?: string;
  description?: string;
  memo?: string;
};

export type CreatePayoutResult = {
  trackId: string;
  status: string;
};

/**
 * Создание выплаты (payout).
 * POST https://api.oxapay.com/v1/payout
 */
export async function createPayout(
  params: CreatePayoutParams
): Promise<CreatePayoutResult> {
  if (!PAYOUT_KEY) {
    throw new Error("OXAPAY_PAYOUT_API_KEY is not configured");
  }

  const body: Record<string, unknown> = {
    address: params.address,
    currency: params.currency,
    amount: params.amount,
  };
  if (params.network) body.network = params.network;
  if (params.callbackUrl) body.callback_url = params.callbackUrl;
  if (params.description) body.description = params.description;
  if (params.memo) body.memo = params.memo;

  const res = await fetch(`${OXAPAY_BASE}/payout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      payout_api_key: PAYOUT_KEY,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json || json.error) {
    const msg =
      json?.error?.message || json?.message || `OxaPay error (${res.status})`;
    throw new Error(`OxaPay createPayout failed: ${msg}`);
  }

  const data = json.data;
  if (!data?.track_id) {
    throw new Error("OxaPay createPayout: unexpected response");
  }

  return {
    trackId: String(data.track_id),
    status: String(data.status ?? ""),
  };
}

/**
 * Проверка HMAC-подписи вебхука.
 * OxaPay подписывает сырое тело запроса HMAC-SHA512:
 *   - для invoice/платежей ключом MERCHANT_API_KEY
 *   - для payout — ключом PAYOUT_API_KEY
 * Подпись приходит в заголовке HMAC.
 */
export function verifyWebhookSignature(
  rawBody: string,
  hmacHeader: string | null,
  type: "invoice" | "payout" | string
): boolean {
  if (!hmacHeader) return false;

  const key =
    type === "payout" ? PAYOUT_KEY : MERCHANT_KEY; // всё, что не payout — merchant
  if (!key) return false;

  const calculated = crypto
    .createHmac("sha512", key)
    .update(rawBody)
    .digest("hex");

  // сравнение с защитой от timing-атак
  const a = Buffer.from(calculated);
  const b = Buffer.from(hmacHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const OXAPAY_CONFIGURED = Boolean(MERCHANT_KEY);
export const OXAPAY_PAYOUT_CONFIGURED = Boolean(PAYOUT_KEY);
