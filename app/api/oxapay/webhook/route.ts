export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// OxaPay posts webhooks here for both invoices (deposits) and payouts.
// The raw request body is HMAC-signed; we must read it as text to verify.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const hmac = req.headers.get("HMAC") || req.headers.get("hmac");

  let body: any = null;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const type: string = String(body?.type || "payment");
  const kind = type === "payout" ? "payout" : "invoice";

  if (!verifyWebhookSignature(raw, hmac, kind)) {
    return NextResponse.json({ error: "bad-signature" }, { status: 401 });
  }

  await ensureSchema();
  const pool = getPool();

  const trackId = String(body?.track_id ?? body?.trackId ?? "");
  const status = String(body?.status ?? "").toLowerCase();
  if (!trackId) {
    return NextResponse.json({ error: "no-track-id" }, { status: 400 });
  }

  if (kind === "payout") {
    // Payout lifecycle for withdrawals.
    const paid = ["complete", "completed", "confirmed", "sent"].includes(status);
    const failed = ["failed", "rejected", "canceled", "cancelled"].includes(status);
    if (paid) {
      await pool.query(
        `UPDATE withdrawals SET status = 'paid', updated_at = now()
         WHERE track_id = $1 AND status <> 'paid';`,
        [trackId]
      );
    } else if (failed) {
      // Refund the held amount back to the user's balance (once).
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const w = await client.query(
          `SELECT id, telegram_id, amount, status FROM withdrawals
           WHERE track_id = $1 FOR UPDATE;`,
          [trackId]
        );
        if (w.rowCount && !["failed", "rejected", "refunded"].includes(w.rows[0].status)) {
          await client.query(
            `UPDATE users SET balance = balance + $1, updated_at = now()
             WHERE telegram_id = $2;`,
            [w.rows[0].amount, w.rows[0].telegram_id]
          );
          await client.query(
            `UPDATE withdrawals SET status = 'failed', updated_at = now() WHERE id = $1;`,
            [w.rows[0].id]
          );
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    }
    return NextResponse.json({ ok: true });
  }

  // Invoice / deposit lifecycle.
  const paid = ["paid", "confirmed", "completed", "complete"].includes(status);
  const dead = ["expired", "failed"].includes(status);

  if (paid) {
    // Credit the balance exactly once (idempotent via status guard + row lock).
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const d = await client.query(
        `SELECT id, telegram_id, amount, status FROM deposits
         WHERE track_id = $1 FOR UPDATE;`,
        [trackId]
      );
      if (d.rowCount && d.rows[0].status !== "paid") {
        await client.query(
          `UPDATE deposits SET status = 'paid', updated_at = now() WHERE id = $1;`,
          [d.rows[0].id]
        );
        await client.query(
          `UPDATE users SET balance = balance + $1, updated_at = now()
           WHERE telegram_id = $2;`,
          [d.rows[0].amount, d.rows[0].telegram_id]
        );
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } else if (dead) {
    await pool.query(
      `UPDATE deposits SET status = $2, updated_at = now()
       WHERE track_id = $1 AND status = 'pending';`,
      [trackId, status]
    );
  }

  return NextResponse.json({ ok: true });
}
