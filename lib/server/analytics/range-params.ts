import type { Granularity, RangeInput } from "@/lib/server/analytics/queries";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const GRANULARITIES = new Set<Granularity>(["hour", "day", "week", "month"]);

export function isValidTimeZone(tz: string) {
  if (!tz || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function isRealDate(value: string) {
  if (!DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Validates ?from=YYYY-MM-DD&to=YYYY-MM-DD&tz=Area/City&granularity=day (from=all for all time). */
export function parseRangeParams(params: URLSearchParams): { ok: true; value: RangeInput } | { ok: false; error: string } {
  const tz = params.get("tz") || "UTC";
  if (!isValidTimeZone(tz)) return { ok: false, error: "invalid_tz" };

  const to = params.get("to") ?? "";
  if (!isRealDate(to)) return { ok: false, error: "invalid_to" };

  const fromRaw = params.get("from") ?? "";
  const from = fromRaw === "all" ? null : fromRaw;
  if (from !== null) {
    if (!isRealDate(from)) return { ok: false, error: "invalid_from" };
    if (from > to) return { ok: false, error: "from_after_to" };
    const days = (Date.parse(to) - Date.parse(from)) / 86_400_000;
    if (days > 3 * 366) return { ok: false, error: "range_too_long" };
  }

  const granularityRaw = params.get("granularity");
  let granularity: Granularity | undefined;
  if (granularityRaw && granularityRaw !== "auto") {
    if (!GRANULARITIES.has(granularityRaw as Granularity)) return { ok: false, error: "invalid_granularity" };
    granularity = granularityRaw as Granularity;
  }

  // Hourly buckets over long ranges would be huge; cap it.
  if (granularity === "hour" && from !== null && (Date.parse(to) - Date.parse(from)) / 86_400_000 > 7) {
    return { ok: false, error: "hourly_range_too_long" };
  }
  if (granularity === "hour" && from === null) return { ok: false, error: "hourly_range_too_long" };

  return { ok: true, value: { from, to, tz, granularity } };
}
