export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Users request a withdrawal here. Funds are immediately held (deducted from the
// balance) and a 'pending' row is created. An admin later approves it, which
// triggers the actual OxaPay payout. Rejection refunds the held amount.
export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: "server-misconfigured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const initData: string | undefined = body?.initData;
  const amount = Number(body?.amount);
  const address = String(body?.address || "").trim();
  const network = body?.network ? String(body.network).trim() : null;

  const tg = initData ? parseAndValidate(initData, botToken) : null;
  if (!tg) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "invalid-amount" }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json({ error: "address-required" }, { status: 400 });
  }

  await ensureSchema();
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const u = await client.query(
      `SELECT balance FROM users WHERE telegram_id = $1 FOR UPDATE;`,
      [tg.id]
    );
    if (!u.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "no-user" }, { status: 404 });
    }
    const balance = Number(u.rows[0].balance);
    if (balance < amount) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "insufficient-funds", balance },
        { status: 400 }
      );
    }

    await client.query(
      `UPDATE users SET balance = balance - $1, updated_at = now()
       WHERE telegram_id = $2;`,
      [amount, tg.id]
    );
    const ins = await client.query(
      `INSERT INTO withdrawals (telegram_id, amount, currency, address, network, status)
       VALUES ($1, $2, 'USDT', $3, $4, 'pending')
       RETURNING id;`,
      [tg.id, amount, address, network]
    );
    await client.query("COMMIT");
    return NextResponse.json({ ok: true, withdrawalId: ins.rows[0].id });
  } catch (e: any) {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { error: "server-error", detail: String(e?.message || e) },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
