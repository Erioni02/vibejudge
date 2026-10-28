import { hashPassword } from "@/lib/server/admin-auth";

export const ADMIN_USER = "founder";
export const ADMIN_PASS = "correct horse battery staple";
export const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

let cachedHash: string | null = null;

/** Configures a test administrator (cheap scrypt params to keep tests fast). */
export async function configureAdmin() {
  cachedHash ??= await hashPassword(ADMIN_PASS, { N: 1024, r: 8, p: 1 });
  process.env.ADMIN_USERNAME = ADMIN_USER;
  process.env.ADMIN_PASSWORD_HASH = cachedHash;
  process.env.ADMIN_SESSION_SECRET = "test-secret-that-is-definitely-longer-than-32-chars";
}

export function clearAdmin() {
  delete process.env.ADMIN_USERNAME;
  delete process.env.ADMIN_PASSWORD_HASH;
  delete process.env.ADMIN_SESSION_SECRET;
}
