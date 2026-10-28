import { describe, expect, it } from "vitest";
import { classifyDbError } from "@/lib/server/db-errors";

describe("database error classification", () => {
  it("maps driver errors to actionable codes", () => {
    expect(classifyDbError(new Error("getaddrinfo ENOTFOUND db.abc.supabase.co"))).toBe("db_unreachable");
    expect(classifyDbError(Object.assign(new Error("write CONNECT_TIMEOUT db.abc.supabase.co:5432"), { code: "CONNECT_TIMEOUT" }))).toBe("db_timeout");
    expect(classifyDbError(new Error('password authentication failed for user "postgres"'))).toBe("db_auth_failed");
    expect(classifyDbError(new Error("Tenant or user not found"))).toBe("db_auth_failed");
    expect(classifyDbError(new Error('relation "analytics_events" does not exist'))).toBe("schema_missing");
    expect(classifyDbError(new URIError("URI malformed"))).toBe("db_url_invalid");
    expect(classifyDbError(new Error("canceling statement due to statement timeout"))).toBe("db_timeout");
    expect(classifyDbError(new Error("something else"))).toBe("query_failed");
  });
});
