import "server-only";
import type { Db } from "@/lib/server/db";
import { ROAST_OFF_PATH } from "@/lib/server/analytics/context";

/**
 * Dashboard aggregations. Every query is bounded by a time range and grouped in Postgres, so the
 * dashboard never loads raw events. Metric definitions are documented in docs/analytics.md.
 */

export type Granularity = "hour" | "day" | "week" | "month";

export type RangeInput = {
  /** Inclusive local dates (YYYY-MM-DD) in `tz`. `from: null` = all time. */
  from: string | null;
  to: string;
  tz: string;
  granularity?: Granularity;
};

export type ResolvedRange = {
  from: string;
  to: string;
  tz: string;
  granularity: Granularity;
  start: string;
  end: string;
  prevStart: string | null;
  prevEnd: string | null;
};

/** Trusted events count only when written by the server. */
const TRUSTED = [
  "cv_upload_completed",
  "cv_roast_started",
  "cv_roast_completed",
  "cv_roast_failed",
  "cv_generation_started",
  "cv_generation_completed",
  "cv_generation_failed"
];

function list(names: string[]) {
  return names
    .map((name) => {
      if (!/^[a-z_]+$/.test(name)) throw new Error(`Invalid event name ${name}`);
      return `'${name}'`;
    })
    .join(", ");
}

/** Row-level guard used by every query: trusted names must come from the server. */
const TRUST = `(name not in (${list(TRUSTED)}) or source = 'server')`;

const n = (value: unknown) => Number(value ?? 0);
const iso = (value: unknown) => (value instanceof Date ? value : new Date(String(value))).toISOString();

function autoGranularity(days: number): Granularity {
  if (days <= 2) return "hour";
  if (days <= 92) return "day";
  if (days <= 400) return "week";
  return "month";
}

export async function resolveRange(db: Db, input: RangeInput): Promise<ResolvedRange | null> {
  let from = input.from;
  if (!from) {
    const [first] = await db.query<{ day: string | null }>(
      `select to_char(min(occurred_at) at time zone $1, 'YYYY-MM-DD') as day from analytics_events`,
      [input.tz]
    );
    from = first?.day ?? input.to;
  }
  if (from > input.to) from = input.to;

  const [row] = await db.query<{ start: Date; end: Date; prev_start: Date; days: number }>(
    `select ($1::date)::timestamp at time zone $3 as start,
            (($2::date) + 1)::timestamp at time zone $3 as "end",
            (($1::date) - (($2::date) - ($1::date) + 1))::timestamp at time zone $3 as prev_start,
            (($2::date) - ($1::date) + 1)::int as days`,
    [from, input.to, input.tz]
  );
  if (!row) return null;

  const allTime = input.from === null;
  return {
    from,
    to: input.to,
    tz: input.tz,
    granularity: input.granularity ?? autoGranularity(n(row.days)),
    start: iso(row.start),
    end: iso(row.end),
    prevStart: allTime ? null : iso(row.prev_start),
    prevEnd: allTime ? null : iso(row.start)
  };
}

const KPI_DEFS = {
  pageViews: { name: "page_view", agg: "count(*)" },
  uniqueVisitors: { name: "page_view", agg: "count(distinct visitor_id)" },
  sessions: { name: "page_view", agg: "count(distinct session_id)" },
  roastsCompleted: { name: "cv_roast_completed", agg: "count(*)" },
  sharesCreated: { name: "roast_off_share_created", agg: "count(distinct entity_id)" },
  sharesCopied: { name: "roast_off_share_copied", agg: "count(*)" },
  shareOpens: { name: "roast_off_share_opened", agg: "count(*)" },
  cvsGenerated: { name: "cv_generation_completed", agg: "count(*)" },
  imagesDownloaded: { name: "roast_image_download_completed", agg: "count(*)" }
} as const;

export type KpiKey = keyof typeof KPI_DEFS;
export type Kpi = { value: number; previous: number | null; series: number[] };

/** Count aggregates with FILTER: "where name = X and inside the window". */
function windowed(agg: string, name: string, from: string, to: string) {
  const filter = `name = '${name}' and occurred_at >= ${from} and occurred_at < ${to}`;
  if (agg === "count(*)") return `count(*) filter (where ${filter})`;
  return agg.replace(/\)$/, `) filter (where ${filter})`);
}

async function kpis(db: Db, range: ResolvedRange) {
  const names = [...new Set(Object.values(KPI_DEFS).map((def) => def.name))];
  const columns = Object.entries(KPI_DEFS).flatMap(([key, def]) => [
    `${windowed(def.agg, def.name, "$1::timestamptz", "$2::timestamptz")}::int as "${key}"`,
    `${windowed(def.agg, def.name, "$3::timestamptz", "$4::timestamptz")}::int as "${key}_prev"`
  ]);
  const [row] = await db.query<Record<string, number>>(
    `select ${columns.join(",\n")}
       from analytics_events
      where occurred_at >= coalesce($3::timestamptz, $1::timestamptz) and occurred_at < $2::timestamptz
        and name in (${list(names)}) and ${TRUST}`,
    [range.start, range.end, range.prevStart ?? range.start, range.prevEnd ?? range.start]
  );
  return Object.fromEntries(
    Object.keys(KPI_DEFS).map((key) => [key, { value: n(row?.[key]), previous: range.prevStart ? n(row?.[`${key}_prev`]) : null }])
  ) as Record<KpiKey, { value: number; previous: number | null }>;
}

const BUCKET_FORMAT = `'YYYY-MM-DD"T"HH24:MI'`;

async function buckets(db: Db, range: ResolvedRange) {
  const rows = await db.query<{ key: string }>(
    `select to_char(b, ${BUCKET_FORMAT}) as key
       from generate_series(
              date_trunc($3, $1::timestamptz at time zone $4),
              ($2::timestamptz at time zone $4) - interval '1 second',
              ('1 ' || $3)::interval) as b`,
    [range.start, range.end, range.granularity, range.tz]
  );
  return rows.map((row) => row.key);
}

type SeriesRow = { key: string; name: string; n: number; visitors: number; sessions: number };

const SERIES_EVENTS = [
  "page_view",
  "cv_roast_started",
  "cv_roast_completed",
  "cv_roast_failed",
  "cv_generation_started",
  "cv_generation_completed",
  "cv_generation_failed",
  "roast_off_share_created",
  "roast_off_share_copied",
  "roast_off_share_opened",
  "roast_off_interaction",
  "roast_image_download_started",
  "roast_image_download_completed",
  "roast_image_download_failed"
];

async function seriesRows(db: Db, range: ResolvedRange) {
  return db.query<SeriesRow>(
    `select to_char(date_trunc($3, occurred_at at time zone $4), ${BUCKET_FORMAT}) as key, name,
            count(*)::int as n,
            count(distinct visitor_id)::int as visitors,
            count(distinct session_id)::int as sessions,
            count(distinct entity_id)::int as entities
       from analytics_events
      where occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
        and name in (${list(SERIES_EVENTS)}) and ${TRUST}
      group by 1, 2`,
    [range.start, range.end, range.granularity, range.tz]
  );
}

function pick(rows: SeriesRow[], keys: string[], name: string, field: "n" | "visitors" | "sessions" | "entities" = "n") {
  const map = new Map(rows.filter((row) => row.name === name).map((row) => [row.key, n((row as Record<string, unknown>)[field])]));
  return keys.map((key) => map.get(key) ?? 0);
}

type Breakdown = { label: string; sessions: number; visitors: number; converted: number };

/** Sessions grouped by a first-touch column, with how many of those sessions completed a roast. */
async function sessionBreakdown(db: Db, range: ResolvedRange, column: "traffic_source" | "referrer_host" | "utm_campaign" | "path", event = "session_started", limit = 10) {
  const rows = await db.query<Breakdown>(
    `with s as (
       select distinct on (session_id) session_id, visitor_id, ${column} as label
         from analytics_events
        where name = '${event}' and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
          and session_id is not null ${column === "path" ? "" : `and ${column} is not null`}
        order by session_id, occurred_at
     )
     select coalesce(label, '(unknown)') as label,
            count(*)::int as sessions,
            count(distinct visitor_id)::int as visitors,
            count(*) filter (where exists (
              select 1 from analytics_events e
               where e.session_id = s.session_id and e.name = 'cv_roast_completed' and e.source = 'server'
            ))::int as converted
       from s group by 1 order by sessions desc, label limit ${limit}`,
    [range.start, range.end]
  );
  return rows.map((row) => ({ label: row.label, sessions: n(row.sessions), visitors: n(row.visitors), converted: n(row.converted) }));
}

async function pageBreakdown(db: Db, range: ResolvedRange) {
  const rows = await db.query<{ label: string; views: number; visitors: number }>(
    `select coalesce(path, '(unknown)') as label, count(*)::int as views, count(distinct visitor_id)::int as visitors
       from analytics_events
      where name = 'page_view' and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
      group by 1 order by views desc, label limit 12`,
    [range.start, range.end]
  );
  return rows.map((row) => ({ label: row.label, views: n(row.views), visitors: n(row.visitors) }));
}

async function visitorBreakdown(db: Db, range: ResolvedRange, column: "device" | "browser" | "country") {
  const rows = await db.query<{ label: string; visitors: number }>(
    `select coalesce(${column}, 'Unknown') as label, count(distinct visitor_id)::int as visitors
       from analytics_events
      where name = 'page_view' and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
      group by 1 order by visitors desc, label limit 10`,
    [range.start, range.end]
  );
  return rows.map((row) => ({ label: row.label, visitors: n(row.visitors) }));
}

/** New = the visitor's first-ever event falls inside the range. Returning = seen before the range. */
async function newVsReturning(db: Db, range: ResolvedRange) {
  const [row] = await db.query<{ fresh: number; returning: number }>(
    `with active as (
       select distinct visitor_id from analytics_events
        where name = 'page_view' and visitor_id is not null
          and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
     )
     select count(*) filter (where first_seen >= $1::timestamptz)::int as fresh,
            count(*) filter (where first_seen < $1::timestamptz)::int as returning
       from (select a.visitor_id,
                    (select min(e.occurred_at) from analytics_events e where e.visitor_id = a.visitor_id) as first_seen
               from active a) v`,
    [range.start, range.end]
  );
  return { new: n(row?.fresh), returning: n(row?.returning) };
}

const FEATURES = [
  { key: "roast", label: "CV roast", started: "cv_roast_started", completed: "cv_roast_completed", failed: "cv_roast_failed", abandoned: "cv_roast_abandoned" },
  { key: "generation", label: "AI CV generation", started: "cv_generation_started", completed: "cv_generation_completed", failed: "cv_generation_failed", abandoned: "cv_generation_abandoned" },
  { key: "download", label: "Roast image download", started: "roast_image_download_started", completed: "roast_image_download_completed", failed: "roast_image_download_failed", abandoned: null },
  { key: "cv_download", label: "CV file download (PDF/PNG)", started: null, completed: "cv_download_completed", failed: "cv_download_failed", abandoned: null }
] as const;

async function features(db: Db, range: ResolvedRange) {
  const names = FEATURES.flatMap((feature) => [feature.started, feature.completed, feature.failed, feature.abandoned]).filter(
    (name): name is NonNullable<typeof name> => Boolean(name)
  );
  const counts = await db.query<{ name: string; total: number; visitors: number }>(
    `select name, count(*)::int as total, count(distinct visitor_id)::int as visitors
       from analytics_events
      where occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz and name in (${list(names)}) and ${TRUST}
      group by name`,
    [range.start, range.end]
  );
  const byName = new Map(counts.map((row) => [row.name, row]));
  const get = (name: string | null, field: "total" | "visitors" = "total") => (name ? n(byName.get(name)?.[field]) : 0);

  const rows = FEATURES.map((feature) => {
    const completed = get(feature.completed);
    const failed = get(feature.failed);
    return {
      key: feature.key,
      label: feature.label,
      started: feature.started ? get(feature.started) : null,
      completed,
      failed,
      abandoned: feature.abandoned ? get(feature.abandoned) : null,
      uniqueVisitors: get(feature.completed, "visitors"),
      successRate: completed + failed > 0 ? completed / (completed + failed) : null
    };
  });

  const reasons = await db.query<{ name: string; reason: string; mode: string | null; total: number }>(
    `select name, coalesce(metadata->>'reason', 'unknown') as reason, metadata->>'mode' as mode, count(*)::int as total
       from analytics_events
      where occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
        and name in ('cv_roast_failed', 'cv_generation_failed') and source = 'server'
      group by 1, 2, 3 order by total desc limit 20`,
    [range.start, range.end]
  );

  const modes = await db.query<{ mode: string; total: number }>(
    `select coalesce(metadata->>'mode', 'unknown') as mode, count(*)::int as total
       from analytics_events
      where occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz and name = 'cv_generation_completed' and source = 'server'
      group by 1 order by total desc`,
    [range.start, range.end]
  );

  const clientErrors = await db.query<{ feature: string; reason: string; total: number }>(
    `select metadata->>'feature' as feature, metadata->>'reason' as reason, count(*)::int as total
       from analytics_events
      where occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz and name = 'client_error'
      group by 1, 2 order by total desc limit 10`,
    [range.start, range.end]
  );

  return {
    rows,
    failureReasons: reasons.map((row) => ({
      feature: row.name === "cv_roast_failed" ? "roast" : "generation",
      reason: row.reason,
      mode: row.mode,
      total: n(row.total)
    })),
    generationModes: modes.map((row) => ({ mode: row.mode, total: n(row.total) })),
    clientErrors: clientErrors.map((row) => ({ feature: row.feature, reason: row.reason, total: n(row.total) }))
  };
}

/**
 * Diagnostic funnel: each stage = distinct anonymous visitors who did that action in the range.
 * Stages are not forced to be sequential, so a later stage can exceed an earlier one.
 */
async function funnel(db: Db, range: ResolvedRange) {
  const [row] = await db.query<Record<string, number>>(
    `with e as (
       select name, visitor_id, entity_id, source, occurred_at from analytics_events
        where occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz and visitor_id is not null
     ),
     creators as (select distinct visitor_id, entity_id from e where name = 'roast_off_share_created' and entity_id is not null)
     select
       count(distinct visitor_id) filter (where name = 'page_view')::int as visitors,
       count(distinct visitor_id) filter (where name = 'cv_roast_started' and source = 'server')::int as roast_started,
       count(distinct visitor_id) filter (where name = 'cv_roast_completed' and source = 'server')::int as roast_completed,
       count(distinct visitor_id) filter (where name = 'roast_off_share_created')::int as share_created,
       (select count(distinct c.visitor_id) from creators c
         where exists (select 1 from e o where o.name = 'roast_off_share_opened' and o.entity_id = c.entity_id and o.visitor_id <> c.visitor_id))::int as share_opened_by_other,
       count(distinct visitor_id) filter (where name = 'cv_generation_completed' and source = 'server')::int as generation_completed,
       count(distinct visitor_id) filter (where name = 'roast_image_download_completed')::int as download_completed
     from e`,
    [range.start, range.end]
  );

  const [conversion] = await db.query<{ roasters: number; started: number; completed: number }>(
    `with r as (
       select visitor_id, min(occurred_at) as at from analytics_events
        where name = 'cv_roast_completed' and source = 'server' and visitor_id is not null
          and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
        group by visitor_id
     )
     select count(*)::int as roasters,
            count(*) filter (where exists (select 1 from analytics_events g where g.visitor_id = r.visitor_id
              and g.name = 'cv_generation_started' and g.source = 'server' and g.occurred_at >= r.at and g.occurred_at < $2::timestamptz))::int as started,
            count(*) filter (where exists (select 1 from analytics_events g where g.visitor_id = r.visitor_id
              and g.name = 'cv_generation_completed' and g.source = 'server' and g.occurred_at >= r.at and g.occurred_at < $2::timestamptz))::int as completed
       from r`,
    [range.start, range.end]
  );

  return {
    stages: [
      { key: "visitors", label: "Website visitors", visitors: n(row?.visitors) },
      { key: "roast_started", label: "Started a CV roast", visitors: n(row?.roast_started) },
      { key: "roast_completed", label: "Completed a CV roast", visitors: n(row?.roast_completed) },
      { key: "share_created", label: "Created a Roast Off link", visitors: n(row?.share_created) },
      { key: "share_opened_by_other", label: "Link opened by someone else", visitors: n(row?.share_opened_by_other) },
      { key: "generation_completed", label: "Generated a CV with AI", visitors: n(row?.generation_completed) },
      { key: "download_completed", label: "Downloaded the roast image", visitors: n(row?.download_completed) }
    ],
    roastToGeneration: { roasters: n(conversion?.roasters), started: n(conversion?.started), completed: n(conversion?.completed) }
  };
}

async function roastOff(db: Db, range: ResolvedRange) {
  const [totals] = await db.query<Record<string, number>>(
    `with creators as (
       select distinct entity_id, visitor_id from analytics_events
        where name = 'roast_off_share_created' and entity_id is not null
     )
     select
       count(distinct entity_id) filter (where name = 'roast_off_share_created')::int as created,
       count(*) filter (where name = 'roast_off_share_copied')::int as copies,
       count(*) filter (where name = 'roast_off_share_copied' and metadata->>'method' = 'native')::int as native_shares,
       count(*) filter (where name = 'roast_off_share_opened')::int as opens,
       count(distinct visitor_id) filter (where name = 'roast_off_share_opened')::int as unique_openers,
       count(distinct entity_id) filter (where name = 'roast_off_share_opened')::int as links_opened,
       count(*) filter (where name = 'roast_off_share_opened' and not exists (
         select 1 from creators c where c.entity_id = a.entity_id and c.visitor_id = a.visitor_id))::int as opens_by_others,
       count(*) filter (where name = 'roast_off_interaction')::int as interactions,
       count(distinct visitor_id) filter (where name = 'roast_off_interaction')::int as interacting_visitors
     from analytics_events a
     where occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
       and name in ('roast_off_share_created', 'roast_off_share_copied', 'roast_off_share_opened', 'roast_off_interaction')`,
    [range.start, range.end]
  );

  const topLinks = await db.query<{ id: string; opens: number; visitors: number; roasted: number; first_opened: Date; last_opened: Date }>(
    `with o as (
       select entity_id, visitor_id, occurred_at from analytics_events
        where name = 'roast_off_share_opened' and entity_id is not null
          and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
     )
     select entity_id as id, count(*)::int as opens, count(distinct visitor_id)::int as visitors,
            (select count(distinct r.visitor_id) from analytics_events r
              where r.name = 'cv_roast_completed' and r.source = 'server'
                and r.visitor_id in (select visitor_id from o o2 where o2.entity_id = o.entity_id)
                and r.occurred_at >= $1::timestamptz and r.occurred_at < $2::timestamptz)::int as roasted,
            min(occurred_at) as first_opened, max(occurred_at) as last_opened
       from o group by entity_id order by opens desc, visitors desc limit 10`,
    [range.start, range.end]
  );

  // Who came in through shared links: openers who later roasted or generated a CV.
  const [downstream] = await db.query<{ openers: number; roasted: number; generated: number }>(
    `with o as (
       select visitor_id, min(occurred_at) as at from analytics_events
        where name = 'roast_off_share_opened' and visitor_id is not null
          and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
        group by visitor_id
     )
     select count(*)::int as openers,
            count(*) filter (where exists (select 1 from analytics_events e where e.visitor_id = o.visitor_id
              and e.name = 'cv_roast_completed' and e.source = 'server' and e.occurred_at >= o.at))::int as roasted,
            count(*) filter (where exists (select 1 from analytics_events e where e.visitor_id = o.visitor_id
              and e.name = 'cv_generation_completed' and e.source = 'server' and e.occurred_at >= o.at))::int as generated
       from o`,
    [range.start, range.end]
  );

  const referral = await db.query<{ label: string; sessions: number }>(
    `select coalesce(referrer_host, traffic_source, 'direct') as label, count(distinct session_id)::int as sessions
       from analytics_events
      where name = 'landing_page_view' and path = $3
        and occurred_at >= $1::timestamptz and occurred_at < $2::timestamptz
      group by 1 order by sessions desc limit 10`,
    [range.start, range.end, ROAST_OFF_PATH]
  );

  return {
    created: n(totals?.created),
    copies: n(totals?.copies),
    nativeShares: n(totals?.native_shares),
    opens: n(totals?.opens),
    uniqueOpeners: n(totals?.unique_openers),
    linksOpened: n(totals?.links_opened),
    opensByOthers: n(totals?.opens_by_others),
    interactions: n(totals?.interactions),
    interactingVisitors: n(totals?.interacting_visitors),
    topLinks: topLinks.map((row) => ({
      id: row.id,
      opens: n(row.opens),
      visitors: n(row.visitors),
      roasted: n(row.roasted),
      firstOpened: iso(row.first_opened),
      lastOpened: iso(row.last_opened)
    })),
    downstream: { openers: n(downstream?.openers), roasted: n(downstream?.roasted), generated: n(downstream?.generated) },
    referral: referral.map((row) => ({ label: row.label, sessions: n(row.sessions) }))
  };
}

async function health(db: Db) {
  const [row] = await db.query<{ total: number; first_at: Date | null; last_at: Date | null }>(
    `select count(*)::int as total, min(occurred_at) as first_at, max(received_at) as last_at from analytics_events`
  );
  return {
    totalEvents: n(row?.total),
    firstEventAt: row?.first_at ? iso(row.first_at) : null,
    lastEventAt: row?.last_at ? iso(row.last_at) : null
  };
}

export async function dashboardData(db: Db, input: RangeInput) {
  const range = await resolveRange(db, input);
  if (!range) throw new Error("Could not resolve the date range.");

  const [keys, rows, kpiTotals, sources, referrers, campaigns, landingPages, pages, devices, browsers, countries, visitorsSplit, featureData, funnelData, roastOffData, healthData] =
    await Promise.all([
      buckets(db, range),
      seriesRows(db, range),
      kpis(db, range),
      sessionBreakdown(db, range, "traffic_source"),
      sessionBreakdown(db, range, "referrer_host"),
      sessionBreakdown(db, range, "utm_campaign"),
      sessionBreakdown(db, range, "path", "landing_page_view"),
      pageBreakdown(db, range),
      visitorBreakdown(db, range, "device"),
      visitorBreakdown(db, range, "browser"),
      visitorBreakdown(db, range, "country"),
      newVsReturning(db, range),
      features(db, range),
      funnel(db, range),
      roastOff(db, range),
      health(db)
    ]);

  const series = {
    pageViews: pick(rows, keys, "page_view"),
    visitors: pick(rows, keys, "page_view", "visitors"),
    sessions: pick(rows, keys, "page_view", "sessions"),
    roastsStarted: pick(rows, keys, "cv_roast_started"),
    roastsCompleted: pick(rows, keys, "cv_roast_completed"),
    roastsFailed: pick(rows, keys, "cv_roast_failed"),
    generationsStarted: pick(rows, keys, "cv_generation_started"),
    generationsCompleted: pick(rows, keys, "cv_generation_completed"),
    generationsFailed: pick(rows, keys, "cv_generation_failed"),
    sharesCreated: pick(rows, keys, "roast_off_share_created", "entities"),
    sharesCopied: pick(rows, keys, "roast_off_share_copied"),
    shareOpens: pick(rows, keys, "roast_off_share_opened"),
    shareInteractions: pick(rows, keys, "roast_off_interaction"),
    downloadsStarted: pick(rows, keys, "roast_image_download_started"),
    downloadsCompleted: pick(rows, keys, "roast_image_download_completed"),
    downloadsFailed: pick(rows, keys, "roast_image_download_failed")
  };

  const kpiSeries: Record<KpiKey, number[]> = {
    pageViews: series.pageViews,
    uniqueVisitors: series.visitors,
    sessions: series.sessions,
    roastsCompleted: series.roastsCompleted,
    sharesCreated: series.sharesCreated,
    sharesCopied: series.sharesCopied,
    shareOpens: series.shareOpens,
    cvsGenerated: series.generationsCompleted,
    imagesDownloaded: series.downloadsCompleted
  };

  const kpiData = Object.fromEntries(
    (Object.keys(kpiTotals) as KpiKey[]).map((key) => [key, { ...kpiTotals[key], series: kpiSeries[key] }])
  ) as Record<KpiKey, Kpi>;

  return {
    range,
    generatedAt: new Date().toISOString(),
    health: healthData,
    buckets: keys,
    series,
    kpis: kpiData,
    traffic: { sources, referrers, campaigns, landingPages, pages, devices, browsers, countries, newVsReturning: visitorsSplit },
    features: featureData,
    funnel: funnelData,
    roastOff: roastOffData
  };
}

export type DashboardData = Awaited<ReturnType<typeof dashboardData>>;

const ACTIVITY_EVENTS = [
  "landing_page_view",
  "cv_roast_completed",
  "cv_roast_failed",
  "cv_generation_completed",
  "cv_generation_failed",
  "roast_off_share_created",
  "roast_off_share_copied",
  "roast_off_share_opened",
  "roast_off_interaction",
  "roast_image_download_completed",
  "roast_image_download_failed",
  "cv_download_completed",
  "client_error"
];

/** Latest notable events. Visitors appear only as a short one-way hash of their random id. */
export async function recentActivity(db: Db, limit = 40) {
  const rows = await db.query<{
    id: string;
    name: string;
    occurred_at: Date;
    visitor: string | null;
    entity_id: string | null;
    path: string | null;
    traffic_source: string | null;
    referrer_host: string | null;
    device: string | null;
    country: string | null;
    metadata: Record<string, unknown> | string | null;
  }>(
    `select event_id::text as id, name, occurred_at, left(md5(visitor_id), 6) as visitor, entity_id, path,
            traffic_source, referrer_host, device, country, metadata
       from analytics_events
      where name in (${list(ACTIVITY_EVENTS)}) and ${TRUST} and occurred_at > now() - interval '30 days'
      order by occurred_at desc limit $1`,
    [Math.min(Math.max(limit, 1), 100)]
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    at: iso(row.occurred_at),
    visitor: row.visitor,
    entityId: row.entity_id,
    path: row.path,
    trafficSource: row.traffic_source,
    referrerHost: row.referrer_host,
    device: row.device,
    country: row.country,
    metadata: (typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata ?? {}) as Record<string, string | boolean>
  }));
}

export type ActivityItem = Awaited<ReturnType<typeof recentActivity>>[number];
