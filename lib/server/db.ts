import "server-only";
import postgres from "postgres";

/** The only thing analytics needs from a database: run a parameterised query, get rows back. */
export type Db = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
};

let instance: Db | null | undefined;

/**
 * Postgres via DATABASE_URL (Neon, Supabase, Vercel Postgres, RDS — anything Postgres).
 * Returns null when it isn't configured, so the public site keeps working without a database.
 */
export function getDb(): Db | null {
  if (instance !== undefined) return instance;

  const url = process.env.DATABASE_URL;
  if (!url) {
    instance = null;
    return instance;
  }

  const sql = postgres(url, {
    // Serverless: one connection per instance, no prepared statements (works behind pgbouncer/Supavisor).
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 5,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require"
  });

  instance = {
    async query<T>(text: string, params: unknown[] = []) {
      return (await sql.unsafe(text, params as never[])) as unknown as T[];
    }
  };
  return instance;
}

/** Tests swap in an in-process Postgres (PGlite). */
export function setDbForTests(db: Db | null) {
  instance = db;
}
