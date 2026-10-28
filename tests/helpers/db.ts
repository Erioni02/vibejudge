import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import postgres from "postgres";
import { setDbForTests, type Db } from "@/lib/server/db";

const migration = readFileSync(new URL("../../db/migrations/001_analytics_events.sql", import.meta.url), "utf8");

/**
 * A real Postgres with the production migration applied. By default an in-process PGlite; set
 * TEST_DATABASE_URL to run the same suite through the production driver (postgres.js) against a
 * real server. That database's analytics_events table is dropped and recreated.
 */
export async function createTestDb() {
  const url = process.env.TEST_DATABASE_URL;
  let db: Db;
  let exec: (text: string) => Promise<unknown>;
  let close: () => Promise<void>;

  if (url) {
    const sql = postgres(url, { max: 1, prepare: false, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require", onnotice: () => {} });
    db = { query: async <T,>(text: string, params: unknown[] = []) => (await sql.unsafe(text, params as never[])) as unknown as T[] };
    exec = (text) => sql.unsafe(text);
    close = () => sql.end();
    await exec("drop table if exists analytics_events");
  } else {
    const pg = new PGlite();
    db = { query: async <T,>(text: string, params: unknown[] = []) => (await pg.query<T>(text, params as never[])).rows };
    exec = (text) => pg.exec(text);
    close = () => pg.close();
  }

  await exec(migration);
  setDbForTests(db);
  return {
    db,
    exec,
    reset: () => exec("truncate analytics_events"),
    close: async () => {
      setDbForTests(null);
      await close();
    }
  };
}

type Seed = {
  name: string;
  at: string;
  visitor?: string | null;
  session?: string | null;
  source?: "client" | "server";
  entity?: string | null;
  path?: string | null;
  traffic?: string | null;
  referrer?: string | null;
  device?: string | null;
  meta?: Record<string, unknown>;
};

/** Inserts fixture events directly (test database only). */
export async function seed(db: Db, events: Seed[]) {
  for (const event of events) {
    await db.query(
      `insert into analytics_events (event_id, name, source, occurred_at, visitor_id, session_id, entity_id, path, traffic_source, referrer_host, device, metadata)
       values ($1::uuid, $2, $3, $4::timestamptz, $5, $6, $7, $8, $9, $10, $11, $12::text::jsonb)`,
      [
        randomUUID(),
        event.name,
        event.source ?? "client",
        event.at,
        event.visitor === undefined ? "v1" : event.visitor,
        event.session === undefined ? "s1" : event.session,
        event.entity ?? null,
        event.path ?? null,
        event.traffic ?? null,
        event.referrer ?? null,
        event.device ?? null,
        JSON.stringify(event.meta ?? {})
      ]
    );
  }
}

export async function allEvents(db: Db) {
  return db.query<Record<string, unknown>>(`select * from analytics_events order by id`);
}
