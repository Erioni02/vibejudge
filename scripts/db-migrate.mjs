// Applies db/migrations/*.sql in order. Every migration is idempotent, so re-running is safe.
// Usage: DATABASE_URL=postgres://... npm run db:migrate   (or put DATABASE_URL in .env.local)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local or pass it in the environment.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require" });
const dir = join(process.cwd(), "db", "migrations");

try {
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) {
    process.stdout.write(`Applying ${file} … `);
    await sql.unsafe(readFileSync(join(dir, file), "utf8"));
    console.log("ok");
  }
  console.log("Analytics schema is up to date.");
} catch (error) {
  console.error("\nMigration failed:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
