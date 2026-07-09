import { Pool } from "pg";

// A single shared connection pool for the whole server process.
// DATABASE_URL is provided by docker-compose (points at the `db` service).
let pool: Pool | undefined;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }
  return pool;
}

// Idempotent schema setup. db/schema.sql only runs on the FIRST init of an empty
// data volume, so for already-created volumes we apply the same DDL here (safe to
// run repeatedly). Runs once per server process.
let schemaReady: Promise<void> | undefined;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const p = getPool();
      await p.query(`
        CREATE TABLE IF NOT EXISTS users (
          telegram_id   BIGINT PRIMARY KEY,
          first_name    TEXT,
          last_name     TEXT,
          username      TEXT,
          photo_url     TEXT,
          freelancer_id UUID NOT NULL DEFAULT gen_random_uuid(),
          client_id     UUID NOT NULL DEFAULT gen_random_uuid(),
          balance       NUMERIC(18,2) NOT NULL DEFAULT 0,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      // In case the users table pre-existed without the balance column.
      await p.query(
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS balance NUMERIC(18,2) NOT NULL DEFAULT 0;`
      );
      await p.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS users_freelancer_id_idx ON users (freelancer_id);`
      );
      await p.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS users_client_id_idx ON users (client_id);`
      );
      await p.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id    BIGINT NOT NULL REFERENCES users (telegram_id) ON DELETE CASCADE,
          title       TEXT NOT NULL,
          description TEXT,
          price       NUMERIC(18,2) NOT NULL DEFAULT 0,
          currency    TEXT NOT NULL DEFAULT 'USDT',
          status      TEXT NOT NULL DEFAULT 'active',
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await p.query(
        `CREATE INDEX IF NOT EXISTS orders_owner_idx ON orders (owner_id);`
      );
      await p.query(`
        CREATE TABLE IF NOT EXISTS responses (
          id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id      UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
          freelancer_id BIGINT NOT NULL REFERENCES users (telegram_id) ON DELETE CASCADE,
          status        TEXT NOT NULL DEFAULT 'pending',
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await p.query(
        `CREATE INDEX IF NOT EXISTS responses_freelancer_idx ON responses (freelancer_id);`
      );
      await p.query(`
        CREATE TABLE IF NOT EXISTS freelancer_profiles (
          telegram_id   BIGINT PRIMARY KEY REFERENCES users (telegram_id) ON DELETE CASCADE,
          headline      TEXT,
          about         TEXT,
          skills        TEXT,
          hourly_rate   NUMERIC(18,2),
          currency      TEXT NOT NULL DEFAULT 'USDT',
          portfolio_url TEXT,
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);

      // ---- OxaPay deposits (пополнения баланса) ----
      await p.query(`
        CREATE TABLE IF NOT EXISTS deposits (
          id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          telegram_id  BIGINT NOT NULL REFERENCES users (telegram_id) ON DELETE CASCADE,
          track_id     TEXT UNIQUE,
          amount       NUMERIC(18,2) NOT NULL,
          currency     TEXT NOT NULL DEFAULT 'USDT',
          status       TEXT NOT NULL DEFAULT 'pending',
          payment_url  TEXT,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await p.query(`CREATE INDEX IF NOT EXISTS deposits_tg_idx ON deposits (telegram_id);`);
      await p.query(`CREATE INDEX IF NOT EXISTS deposits_track_idx ON deposits (track_id);`);

      // ---- Withdrawals (выводы средств через OxaPay payout) ----
      await p.query(`
        CREATE TABLE IF NOT EXISTS withdrawals (
          id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          telegram_id  BIGINT NOT NULL REFERENCES users (telegram_id) ON DELETE CASCADE,
          track_id     TEXT,
          amount       NUMERIC(18,2) NOT NULL,
          currency     TEXT NOT NULL DEFAULT 'USDT',
          address      TEXT NOT NULL,
          network      TEXT,
          status       TEXT NOT NULL DEFAULT 'pending',
          admin_note   TEXT,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await p.query(`CREATE INDEX IF NOT EXISTS withdrawals_tg_idx ON withdrawals (telegram_id);`);
      await p.query(`CREATE INDEX IF NOT EXISTS withdrawals_status_idx ON withdrawals (status);`);

      // ---- Поля модерации для заказов и резюме ----
      await p.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending';`);
      await p.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_note TEXT;`);
      await p.query(`CREATE INDEX IF NOT EXISTS orders_moderation_idx ON orders (moderation_status);`);
      await p.query(`ALTER TABLE freelancer_profiles ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending';`);
      await p.query(`ALTER TABLE freelancer_profiles ADD COLUMN IF NOT EXISTS admin_note TEXT;`);
      await p.query(`CREATE INDEX IF NOT EXISTS fp_moderation_idx ON freelancer_profiles (moderation_status);`);
    })().catch((e) => {
      // Reset so a later request can retry if the DB was momentarily unavailable.
      schemaReady = undefined;
      throw e;
    });
  }
  return schemaReady;
}