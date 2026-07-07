-- Hundler Work database schema.
-- This file is mounted into the postgres container's /docker-entrypoint-initdb.d
-- and is applied automatically the first time the database volume is initialized.

CREATE TABLE IF NOT EXISTS users (
  telegram_id   BIGINT PRIMARY KEY,
  first_name    TEXT,
  last_name     TEXT,
  username      TEXT,
  photo_url     TEXT,
  -- Every user gets two independent identities within the marketplace:
  freelancer_id UUID NOT NULL DEFAULT gen_random_uuid(), -- "исполнитель"
  client_id     UUID NOT NULL DEFAULT gen_random_uuid(), -- "заказчик"
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_freelancer_id_idx ON users (freelancer_id);
CREATE UNIQUE INDEX IF NOT EXISTS users_client_id_idx ON users (client_id);