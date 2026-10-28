import "server-only";
import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

/**
 * Single-administrator auth for the private analytics dashboard.
 *
 * - Credentials live only in server env vars: ADMIN_USERNAME, ADMIN_PASSWORD_HASH (scrypt), ADMIN_SESSION_SECRET.
 * - A successful login sets an HttpOnly, SameSite=Strict, HMAC-signed session cookie (12h).
 * - Changing the password hash or the secret invalidates every existing session.
 * - If anything is missing, admin access is simply off (routes 404) — never open by default.
 */
export const ADMIN_COOKIE = "vj_admin";
export const ADMIN_SESSION_SECONDS = 12 * 60 * 60;

type AdminConfig = { username: string; passwordHash: string; secret: string };

export function adminConfig(): AdminConfig | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!username || !passwordHash?.startsWith("scrypt:") || !secret || secret.length < 32) return null;
  return { username, passwordHash, secret };
}

function scrypt(password: string, salt: Buffer, keylen: number, options: { N: number; r: number; p: number }) {
  return new Promise<Buffer>((resolve, reject) =>
    scryptCallback(password, salt, keylen, { ...options, maxmem: 256 * 1024 * 1024 }, (error, key) =>
      error ? reject(error) : resolve(key)
    )
  );
}

/** Format: scrypt:N:r:p:<salt base64>:<hash base64> (no "$", which .env files would try to expand). Same format as scripts/hash-admin-password.mjs. */
export async function hashPassword(password: string, { N = 2 ** 15, r = 8, p = 1 } = {}) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString("base64")}:${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  if (![N, r, p].every((value) => Number.isInteger(value) && value > 0)) return false;
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");
  if (!salt.length || !expected.length) return false;
  try {
    const actual = await scrypt(password, salt, expected.length, { N, r, p });
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function sameText(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

/** Checks a login attempt. Always runs the scrypt check so timing doesn't reveal a valid username. */
export async function checkCredentials(username: string, password: string) {
  const config = adminConfig();
  if (!config) return false;
  const userOk = sameText(username, config.username);
  const passwordOk = await verifyPassword(password, config.passwordHash);
  return userOk && passwordOk;
}

function b64url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function keyFingerprint(config: AdminConfig) {
  return createHash("sha256").update(config.passwordHash).digest("base64url").slice(0, 12);
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(nowMs = Date.now()) {
  const config = adminConfig();
  if (!config) throw new Error("Admin auth is not configured.");
  const payload = b64url(
    JSON.stringify({ u: config.username, k: keyFingerprint(config), exp: Math.floor(nowMs / 1000) + ADMIN_SESSION_SECONDS })
  );
  return `${payload}.${sign(payload, config.secret)}`;
}

export function verifySessionToken(token: string | undefined | null, nowMs = Date.now()) {
  const config = adminConfig();
  if (!config || !token || token.length > 512) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return false;

  const expected = Buffer.from(sign(payload, config.secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u?: string; k?: string; exp?: number };
    return (
      typeof data.exp === "number" &&
      data.exp * 1000 > nowMs &&
      data.u === config.username &&
      data.k === keyFingerprint(config)
    );
  } catch {
    return false;
  }
}

export function readCookie(header: string | null, name: string) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/** For route handlers: is this request from the signed-in administrator? */
export function isAdminRequest(request: Request) {
  return verifySessionToken(readCookie(request.headers.get("cookie"), ADMIN_COOKIE));
}

export function sessionCookie(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS
  };
}

/** Rejects cross-site POSTs to admin endpoints (defence in depth on top of SameSite=Strict). */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
