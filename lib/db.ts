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