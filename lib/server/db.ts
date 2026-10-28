import "server-only";
import postgres from "postgres";

/** The only thing analytics needs from a database: run a parameterised query, get rows back. */
export type Db = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
};

let instance: Db | null | undefined;

/** Connections per server instance, and the most queries ever in flight at once. */
const MAX_CONNECTIONS = 3;
const QUERY_TIMEOUT_MS = 20_000;

/**
 * Lets at most `limit` tasks run at once. When a task finishes, its slot passes straight to the
 * next waiter, so the limit can't be overshot.
 */
export function createLimiter(limit: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return async function run<T>(task: () => Promise<T>): Promise<T> {
    if (active >= limit) await new Promise<void>((resolve) => waiting.push(resolve));
    else active += 1;
    try {
      return await task();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active -= 1;
    }
  };
}

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
    // Serverless-friendly: a few connections, no prepared statements (works behind pgbouncer/Supavisor).
    max: MAX_CONNECTIONS,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require"
  });

  // Never more queries in flight than connections: postgres.js would otherwise pipeline several
  // queries on one connection, which Supabase's transaction pooler (Supavisor) can stall on forever.
  const limit = createLimiter(MAX_CONNECTIONS);

  instance = {
    query<T>(text: string, params: unknown[] = []) {
      return limit(async () => {
        const query = sql.unsafe(text, params as never[]);
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
          return (await Promise.race([
            query,
            new Promise<never>((_, reject) => {
              timer = setTimeout(() => {
                query.cancel();
                reject(new Error(`Query timed out after ${QUERY_TIMEOUT_MS}ms`));
              }, QUERY_TIMEOUT_MS);
            })
          ])) as unknown as T[];
        } finally {
          clearTimeout(timer);
        }
      });
    }
  };
  return instance;
}

/** Tests swap in an in-process Postgres (PGlite). */
export function setDbForTests(db: Db | null) {
  instance = db;
}
