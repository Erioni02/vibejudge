import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  ADMIN_COOKIE,
  checkCredentials,
  createSessionToken,
  hashPassword,
  verifyPassword,
  verifySessionToken
} from "@/lib/server/admin-auth";
import { GET as getAnalytics } from "@/app/api/admin/analytics/route";
import { GET as getActivity } from "@/app/api/admin/analytics/activity/route";
import { DELETE as logout, POST as login } from "@/app/api/admin/session/route";
import { ADMIN_PASS, ADMIN_USER, BROWSER_UA, clearAdmin, configureAdmin } from "./helpers/env";
import { createTestDb } from "./helpers/db";

const range = "from=2026-10-01&to=2026-10-07&tz=UTC";

function adminGet(url: string, cookie?: string) {
  return new Request(`https://vibejudge.app${url}`, {
    headers: { "user-agent": BROWSER_UA, ...(cookie ? { cookie: `${ADMIN_COOKIE}=${cookie}` } : {}) }
  });
}

function loginRequest(body: unknown, origin = "https://vibejudge.app", ip = "203.0.113.1") {
  return new Request("https://vibejudge.app/api/admin/session", {
    method: "POST",
    headers: { "content-type": "application/json", origin, host: "vibejudge.app", "x-forwarded-for": ip },
    body: JSON.stringify(body)
  });
}

let testDb: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  testDb = await createTestDb();
});
afterAll(async () => {
  await testDb.close();
  clearAdmin();
});
beforeEach(async () => {
  await configureAdmin();
});

describe("password hashing", () => {
  it("verifies the right password and rejects the wrong one", async () => {
    const hash = await hashPassword("s3cret", { N: 1024, r: 8, p: 1 });
    expect(hash).toMatch(/^scrypt:1024:8:1:/);
    expect(await verifyPassword("s3cret", hash)).toBe(true);
    expect(await verifyPassword("S3cret", hash)).toBe(false);
    expect(await verifyPassword("s3cret", "scrypt:garbage")).toBe(false);
  });

  it("only accepts the configured administrator", async () => {
    expect(await checkCredentials(ADMIN_USER, ADMIN_PASS)).toBe(true);
    expect(await checkCredentials("someone-else", ADMIN_PASS)).toBe(false);
    expect(await checkCredentials(ADMIN_USER, "wrong")).toBe(false);
  });

  it("is disabled entirely when not configured", async () => {
    clearAdmin();
    expect(await checkCredentials(ADMIN_USER, ADMIN_PASS)).toBe(false);
    expect(verifySessionToken("anything.at-all")).toBe(false);
  });
});

describe("session tokens", () => {
  it("accepts a fresh token and rejects tampering, expiry, and rotated credentials", async () => {
    const now = Date.now();
    const token = createSessionToken(now);
    expect(verifySessionToken(token, now)).toBe(true);

    const [payload, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ u: ADMIN_USER, k: "x", exp: 9_999_999_999 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${signature}`, now)).toBe(false);
    expect(verifySessionToken(`${payload}.${signature.slice(0, -2)}xx`, now)).toBe(false);
    expect(verifySessionToken(token, now + 13 * 60 * 60 * 1000)).toBe(false);

    process.env.ADMIN_SESSION_SECRET = "a-completely-different-secret-value-0123456789";
    expect(verifySessionToken(token, now)).toBe(false);
  });

  it("invalidates sessions when the password changes", async () => {
    const token = createSessionToken();
    process.env.ADMIN_PASSWORD_HASH = await hashPassword("new password", { N: 1024, r: 8, p: 1 });
    expect(verifySessionToken(token)).toBe(false);
  });
});

describe("admin API authorization", () => {
  it("rejects analytics requests without a session", async () => {
    expect((await getAnalytics(adminGet(`/api/admin/analytics?${range}`))).status).toBe(401);
    expect((await getActivity(adminGet("/api/admin/analytics/activity"))).status).toBe(401);
  });

  it("rejects forged or garbage cookies", async () => {
    expect((await getAnalytics(adminGet(`/api/admin/analytics?${range}`, "not-a-token"))).status).toBe(401);
    const fake = `${Buffer.from(JSON.stringify({ u: ADMIN_USER, exp: 9_999_999_999 })).toString("base64url")}.abc`;
    expect((await getActivity(adminGet("/api/admin/analytics/activity", fake))).status).toBe(401);
  });

  it("serves data to the signed-in administrator", async () => {
    const token = createSessionToken();
    const response = await getAnalytics(adminGet(`/api/admin/analytics?${range}`, token));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    const activity = await getActivity(adminGet("/api/admin/analytics/activity", token));
    expect(activity.status).toBe(200);
  });

  it("validates dashboard query parameters", async () => {
    const token = createSessionToken();
    const bad = await getAnalytics(adminGet("/api/admin/analytics?from=2026-10-07&to=2026-10-01&tz=UTC", token));
    expect(bad.status).toBe(400);
    const tz = await getAnalytics(adminGet("/api/admin/analytics?from=2026-10-01&to=2026-10-07&tz=Not/AZone", token));
    expect(tz.status).toBe(400);
  });
});

describe("login endpoint", () => {
  it("sets an HttpOnly, SameSite=Strict cookie on success", async () => {
    const response = await login(loginRequest({ username: ADMIN_USER, password: ADMIN_PASS }, undefined, "198.51.100.10"));
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain(`${ADMIN_COOKIE}=`);
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=strict");
  });

  it("rejects wrong credentials without saying which part was wrong", async () => {
    const response = await login(loginRequest({ username: ADMIN_USER, password: "nope" }, undefined, "198.51.100.11"));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "invalid_credentials" });
  });

  it("rejects cross-site login attempts", async () => {
    const response = await login(loginRequest({ username: ADMIN_USER, password: ADMIN_PASS }, "https://evil.example", "198.51.100.12"));
    expect(response.status).toBe(403);
  });

  it("rate limits repeated attempts from one IP", async () => {
    const statuses = [];
    for (let attempt = 0; attempt < 7; attempt += 1) {
      statuses.push((await login(loginRequest({ username: ADMIN_USER, password: "guess" }, undefined, "198.51.100.99"))).status);
    }
    expect(statuses.slice(0, 5).every((status) => status === 401)).toBe(true);
    expect(statuses.at(-1)).toBe(429);
  });

  it("returns 404 when admin access is not configured", async () => {
    clearAdmin();
    const response = await login(loginRequest({ username: ADMIN_USER, password: ADMIN_PASS }, undefined, "198.51.100.13"));
    expect(response.status).toBe(404);
  });

  it("clears the cookie on logout", async () => {
    const response = await logout(
      new Request("https://vibejudge.app/api/admin/session", { method: "DELETE", headers: { origin: "https://vibejudge.app", host: "vibejudge.app" } })
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toMatch(/Max-Age=0/i);
  });
});
