/**
 * Maps a database error to a stable, non-sensitive code the admin dashboard can explain.
 * Raw messages stay in the server logs only.
 */
export type DbErrorCode =
  | "schema_missing"
  | "db_unreachable"
  | "db_auth_failed"
  | "db_timeout"
  | "db_url_invalid"
  | "query_failed";

export function classifyDbError(cause: unknown): DbErrorCode {
  const message = cause instanceof Error ? `${cause.name} ${cause.message} ${(cause as { code?: string }).code ?? ""}` : String(cause);
  if (/analytics_events.*does not exist|relation .* does not exist/i.test(message)) return "schema_missing";
  if (/password authentication failed|SASL|Tenant or user not found|no pg_hba|role .* does not exist/i.test(message)) return "db_auth_failed";
  if (/ENOTFOUND|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|ECONNREFUSED|ECONNRESET|getaddrinfo/i.test(message)) return "db_unreachable";
  if (/CONNECT_TIMEOUT|ETIMEDOUT|statement timeout|canceling statement|timed? ?out/i.test(message)) return "db_timeout";
  if (/Invalid URL|URIError|URI malformed|ERR_INVALID_URL/i.test(message)) return "db_url_invalid";
  return "query_failed";
}
