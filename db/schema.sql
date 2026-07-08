-- Hundler Work database schema.
-- This file is mounted into the postgres container's /docker-entrypoint-initdb.d
-- and is applied automatically the FIRST time the database volume is initialized.
-- NOTE: for already-initialized volumes this file is NOT re-run — the app also
-- applies these statements idempotently at startup (see lib/db.ts ensureSchema).

CREATE TABLE IF NOT EXISTS users (
  telegram_id   BIGINT PRIMARY KEY,
  first_name    TEXT,
  last_name     TEXT,
  username      TEXT,
  photo_url     TEXT,
  -- Every user gets two independent identities within the marketplace:
  freelancer_id UUID NOT NULL DEFAULT gen_random_uuid(), -- "исполнитель"
  client_id     UUID NOT NULL DEFAULT gen_random_uuid(), -- "заказчик"
  balance       NUMERIC(18,2) NOT NULL DEFAULT 0,        -- starts at 0 for everyone
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_freelancer_id_idx ON users (freelancer_id);
CREATE UNIQUE INDEX IF NOT EXISTS users_client_id_idx ON users (client_id);

-- Orders posted by users (as заказчик).
CREATE TABLE IF NOT EXISTS orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    BIGINT NOT NULL REFERENCES users (telegram_id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(18,2) NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'USDT',
  status      TEXT NOT NULL DEFAULT 'active', -- active | in_progress | done
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_owner_idx ON orders (owner_id);

-- Responses (applications) sent by users (as исполнитель) to orders.
CREATE TABLE IF NOT EXISTS responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  freelancer_id BIGINT NOT NULL REFERENCES users (telegram_id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | accepted | rejected
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS responses_freelancer_idx ON responses (freelancer_id);