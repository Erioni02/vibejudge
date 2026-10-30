"use client";

import { ArrowDownRight, ArrowUpRight, Download, LogOut, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DashboardData, KpiKey } from "@/lib/server/analytics/queries";
import { LogoMark } from "@/components/site/logo";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { BarList, Legend, LineChart, Sparkline, formatBucket, formatNumber, type Granularity } from "@/components/admin/charts";

type Preset = "today" | "7d" | "30d" | "90d" | "all" | "custom";

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "all", label: "All time" },
  { key: "custom", label: "Custom" }
];

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "traffic", label: "Traffic" },
  { id: "features", label: "Features" },
  { id: "funnel", label: "Funnel" },
  { id: "roast-off", label: "Roast Off" },
  { id: "emails", label: "Emails" },
  { id: "activity", label: "Activity" }
];

/** YYYY-MM-DD for "now minus N days" in the given time zone. */
function localDate(tz: string, daysAgo = 0) {
  const date = new Date(Date.now() - daysAgo * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

const pct = (value: number | null, digits = 0) => (value === null ? "—" : `${(value * 100).toFixed(digits)}%`);
const ratio = (part: number, whole: number) => (whole > 0 ? part / whole : null);

type LoadState = { status: "loading" } | { status: "error"; error: string } | { status: "ready"; data: DashboardData; loadedAt: Date };

const ERROR_COPY: Record<string, { title: string; body: string }> = {
  database_not_configured: {
    title: "No database connected",
    body: "Set DATABASE_URL in the server environment (any Postgres: Neon, Supabase, Vercel Postgres), run `npm run db:migrate`, then redeploy."
  },
  schema_missing: {
    title: "Analytics table missing",
    body: "The database is reachable but the schema isn't installed. Run `npm run db:migrate` with DATABASE_URL set."
  },
  db_unreachable: {
    title: "Can't reach the database",
    body: "The server couldn't connect to the host in DATABASE_URL. On Supabase, use the Transaction pooler string (…pooler.supabase.com:6543) — the direct db.<project>.supabase.co host is IPv6-only and unreachable from Vercel. Redeploy after changing it."
  },
  db_timeout: {
    title: "Database connection timed out",
    body: "The database didn't answer in time. Check that DATABASE_URL points at the pooler (port 6543), that the Supabase project isn't paused, then redeploy."
  },
  db_auth_failed: {
    title: "Database rejected the login",
    body: "The username or password in DATABASE_URL is wrong. For the Supabase pooler the user is postgres.<project-ref>, and special characters in the password must be URL-encoded ($ → %24, * → %2A). Redeploy after changing it."
  },
  db_url_invalid: {
    title: "DATABASE_URL is malformed",
    body: "The connection string couldn't be parsed. Paste it again without quotes or spaces, with special password characters URL-encoded, then redeploy."
  }
};

export function AnalyticsDashboard() {
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
  const [preset, setPreset] = useState<Preset>("30d");
  const [custom, setCustom] = useState(() => ({ from: localDate(tz, 29), to: localDate(tz) }));
  const [granularity, setGranularity] = useState<"auto" | Granularity>("auto");
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const range = useMemo(() => {
    const to = localDate(tz);
    switch (preset) {
      case "today":
        return { from: to, to };
      case "7d":
        return { from: localDate(tz, 6), to };
      case "30d":
        return { from: localDate(tz, 29), to };
      case "90d":
        return { from: localDate(tz, 89), to };
      case "all":
        return { from: "all", to };
      default:
        return custom;
    }
  }, [preset, custom, tz]);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = new URLSearchParams({ from: range.from, to: range.to, tz, granularity });
      const response = await fetch(`/api/admin/analytics?${params}`, { cache: "no-store" });
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload) {
        setState({ status: "error", error: payload?.error ?? "query_failed" });
        return;
      }
      setState({ status: "ready", data: payload as DashboardData, loadedAt: new Date() });
    } catch {
      setState({ status: "error", error: "network" });
    } finally {
      setRefreshing(false);
    }
  }, [range, tz, granularity]);

  useEffect(() => {
    void load();
  }, [load]);

  // Periodic refresh of the aggregates (the activity feed polls separately, more often).
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [load]);

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    window.location.reload();
  }

  const data = state.status === "ready" ? state.data : null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--adm-line)] bg-[var(--adm-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <LogoMark size={24} />
            <span className="font-display text-[15px] font-semibold tracking-tight">VibeJudge</span>
            <span className="rounded-md border border-[var(--adm-line)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--adm-muted)]">Analytics</span>
          </div>
          <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto text-[13px] lg:order-none lg:ml-4 lg:w-auto" aria-label="Sections">
            {SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="shrink-0 rounded-md px-2 py-1 text-[var(--adm-muted)] hover:bg-[var(--adm-elevated)] hover:text-[var(--adm-text)]">
                {section.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--adm-line)] px-2.5 py-1.5 text-xs text-[var(--adm-muted)] hover:text-[var(--adm-text)]"
              aria-label="Refresh data"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} aria-hidden />
              <span className="hidden sm:inline">
                {state.status === "ready" ? `Updated ${state.loadedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Refresh"}
              </span>
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--adm-line)] px-2.5 py-1.5 text-xs text-[var(--adm-muted)] hover:text-[var(--adm-text)]"
            >
              <LogOut size={13} aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-4 pb-24 pt-6 sm:px-6">
        {/* Range controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Growth & usage</h1>
            <p className="mt-0.5 text-sm text-[var(--adm-muted)]">
              {data ? (
                <>
                  {data.range.from} → {data.range.to} · {tz}
                  {data.range.prevStart ? " · compared with the previous period of equal length" : ""}
                </>
              ) : (
                `Time zone: ${tz}`
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap rounded-lg border border-[var(--adm-line)] bg-[var(--adm-surface)] p-0.5" role="group" aria-label="Date range">
              {PRESETS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPreset(item.key)}
                  aria-pressed={preset === item.key}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    preset === item.key ? "bg-[var(--adm-elevated)] text-[var(--adm-text)]" : "text-[var(--adm-muted)] hover:text-[var(--adm-text)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {preset === "custom" ? (
              <div className="flex items-center gap-1.5 text-xs">
                <input
                  type="date"
                  value={custom.from}
                  max={custom.to}
                  onChange={(event) => event.target.value && setCustom((current) => ({ ...current, from: event.target.value }))}
                  className="rounded-md border border-[var(--adm-line)] bg-[var(--adm-surface)] px-2 py-1.5 text-[var(--adm-text)]"
                  aria-label="From date"
                />
                <span className="text-[var(--adm-faint)]">to</span>
                <input
                  type="date"
                  value={custom.to}
                  min={custom.from}
                  max={localDate(tz)}
                  onChange={(event) => event.target.value && setCustom((current) => ({ ...current, to: event.target.value }))}
                  className="rounded-md border border-[var(--adm-line)] bg-[var(--adm-surface)] px-2 py-1.5 text-[var(--adm-text)]"
                  aria-label="To date"
                />
              </div>
            ) : null}
            <select
              value={granularity}
              onChange={(event) => setGranularity(event.target.value as "auto" | Granularity)}
              className="rounded-lg border border-[var(--adm-line)] bg-[var(--adm-surface)] px-2 py-1.5 text-xs text-[var(--adm-text)]"
              aria-label="Chart interval"
            >
              <option value="auto">Auto interval</option>
              <option value="hour">Hourly</option>
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>

        {state.status === "loading" ? <LoadingState /> : null}
        {state.status === "error" ? <ErrorState error={state.error} onRetry={() => void load()} /> : null}
        {data ? <DashboardBody data={data} /> : null}

        <section id="activity" className="scroll-mt-24">
          <ActivityFeed />
        </section>
      </main>
    </div>
  );
}

function DashboardBody({ data }: { data: DashboardData }) {
  const granularity = data.range.granularity as Granularity;
  return (
    <>
      {data.health.totalEvents === 0 ? <EmptyBanner /> : null}
      <Overview data={data} />
      <Traffic data={data} granularity={granularity} />
      <Features data={data} granularity={granularity} />
      <Funnel data={data} />
      <RoastOff data={data} granularity={granularity} />
      <EmailSignups data={data} granularity={granularity} />
      <p className="mt-10 text-xs leading-5 text-[var(--adm-faint)]">
        {formatNumber(data.health.totalEvents)} raw events stored
        {data.health.firstEventAt ? ` since ${new Date(data.health.firstEventAt).toLocaleDateString()}` : ""}
        {data.health.lastEventAt ? ` · last received ${new Date(data.health.lastEventAt).toLocaleString()}` : ""}. Aggregates refresh every 5 minutes
        while this tab is open, or with the Refresh button. Bots, crawlers, Do-Not-Track browsers, and your own admin browser are excluded.
      </p>
    </>
  );
}

/* ——— Building blocks ——— */

function Card({ title, description, children, className = "", action }: { title?: string; description?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-[var(--adm-line)] bg-[var(--adm-surface)] p-4 sm:p-5 ${className}`}>
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--adm-text)]">{title}</h3>
            {description ? <p className="mt-0.5 text-xs leading-5 text-[var(--adm-faint)]">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function SectionHeading({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div id={id} className="mb-4 mt-12 scroll-mt-24">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--adm-muted)]">{description}</p> : null}
    </div>
  );
}

/** Change vs the previous period. Percentages only when the baseline is big enough to mean something. */
function Delta({ value, previous }: { value: number; previous: number | null }) {
  if (previous === null) return <span className="text-xs text-[var(--adm-faint)]">no comparison</span>;
  if (previous === 0 && value === 0) return <span className="text-xs text-[var(--adm-faint)]">no activity either period</span>;
  if (previous < 10) {
    const diff = value - previous;
    return (
      <span className="text-xs text-[var(--adm-faint)]" title="Previous period too small for a meaningful percentage">
        {diff === 0 ? "same as" : diff > 0 ? `+${formatNumber(diff)} vs` : `${formatNumber(diff)} vs`} {formatNumber(previous)} before
      </span>
    );
  }
  const change = (value - previous) / previous;
  const up = change >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium ${
        up ? "bg-[var(--adm-good-soft)] text-[var(--adm-good)]" : "bg-[var(--adm-bad-soft)] text-[var(--adm-bad)]"
      }`}
      title={`${formatNumber(previous)} in the previous period`}
    >
      {up ? <ArrowUpRight size={12} aria-hidden /> : <ArrowDownRight size={12} aria-hidden />}
      {Math.abs(change * 100).toFixed(Math.abs(change) < 0.1 ? 1 : 0)}%
    </span>
  );
}

const KPI_CARDS: { key: KpiKey; label: string; description: string }[] = [
  { key: "pageViews", label: "Total visits", description: "Page views: every page load by a real (non-bot) browser." },
  { key: "uniqueVisitors", label: "Unique visitors", description: "Distinct anonymous browser ids with at least one page view." },
  { key: "sessions", label: "Sessions", description: "Visits separated by 30+ minutes of inactivity." },
  { key: "roastsCompleted", label: "CVs roasted", description: "Roasts the server finished successfully. Clicks don't count." },
  { key: "sharesCreated", label: "Roast Off links created", description: "Distinct share links that left the page (first copy or share)." },
  { key: "sharesCopied", label: "Roast Off links copied", description: "Every clipboard copy or native share-sheet share." },
  { key: "shareOpens", label: "Roast Off link visits", description: "Times a shared roast-off link was opened, by anyone." },
  { key: "cvsGenerated", label: "AI-generated CVs", description: "CVs the server generated successfully (rewrite, from roast, or builder)." },
  { key: "imagesDownloaded", label: "Roast images downloaded", description: "PNG rendered and handed to the browser's download." }
];

function Overview({ data }: { data: DashboardData }) {
  return (
    <section id="overview" className="mt-6 scroll-mt-24">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {KPI_CARDS.map((card) => {
          const kpi = data.kpis[card.key];
          return (
            <div key={card.key} className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-surface)] p-4">
              <p className="text-[13px] font-medium text-[var(--adm-muted)]">{card.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-[28px] font-semibold leading-none tabular-nums tracking-tight">{formatNumber(kpi.value)}</p>
                  <div className="mt-2">
                    <Delta value={kpi.value} previous={kpi.previous} />
                  </div>
                </div>
                <Sparkline values={kpi.series} />
              </div>
              <p className="mt-3 border-t border-[var(--adm-line)] pt-2.5 text-[11.5px] leading-4 text-[var(--adm-faint)]">{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Table({ head, rows, empty = "No data yet" }: { head: string[]; rows: (string | number)[][]; empty?: string }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-[var(--adm-faint)]">{empty}</p>;
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="text-xs text-[var(--adm-faint)]">
            {head.map((cell, index) => (
              <th key={cell} className={`px-1 pb-2 font-medium ${index === 0 ? "" : "text-right"}`}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-[var(--adm-line)]">
              {row.map((cell, index) => (
                <td key={index} className={`px-1 py-2 ${index === 0 ? "max-w-[260px] truncate text-[var(--adm-text)]" : "text-right tabular-nums text-[var(--adm-muted)]"}`}>
                  {typeof cell === "number" ? formatNumber(cell) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct / unknown",
  organic: "Organic search & AI answers",
  social: "Social",
  referral: "Referral sites",
  campaign: "Campaigns (UTM)",
  paid: "Paid",
  email: "Email",
  internal: "Internal navigation"
};

function Traffic({ data, granularity }: { data: DashboardData; granularity: Granularity }) {
  const { traffic, series, buckets } = data;
  const lines = [
    { label: "Page views", color: "var(--adm-s1)", values: series.pageViews },
    { label: "Unique visitors", color: "var(--adm-s2)", values: series.visitors },
    { label: "Sessions", color: "var(--adm-s3)", values: series.sessions, dashed: true }
  ];
  const split = traffic.newVsReturning;
  const splitTotal = split.new + split.returning;

  return (
    <>
      <SectionHeading
        id="traffic"
        title="Traffic"
        description="Unique visitors are counted per bucket, so the sum over buckets can exceed the range total. Sources use the first page of each session (referrer host + UTM tags)."
      />
      <Card title="Visitors over time" action={<Legend series={lines} />}>
        <LineChart series={lines} buckets={buckets} granularity={granularity} ariaLabel="Page views, unique visitors and sessions over time" />
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="Traffic sources" description="Sessions by first-touch source.">
          <BarList rows={traffic.sources.map((row) => ({ label: SOURCE_LABELS[row.label] ?? row.label, value: row.sessions }))} />
        </Card>
        <Card title="Referrers" description="Sessions by referring site (hostname only).">
          <BarList rows={traffic.referrers.map((row) => ({ label: row.label, value: row.sessions }))} empty="No referrers yet" />
        </Card>
        <Card title="New vs returning" description="New = first-ever visit falls inside this range.">
          {splitTotal ? (
            <>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-[var(--adm-bar)]">
                <span style={{ width: `${(split.new / splitTotal) * 100}%`, background: "var(--adm-s1)" }} />
                <span style={{ width: `${(split.returning / splitTotal) * 100}%`, background: "var(--adm-s2)" }} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-[var(--adm-faint)]">New</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    {formatNumber(split.new)} <span className="text-xs font-normal text-[var(--adm-muted)]">{pct(ratio(split.new, splitTotal))}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--adm-faint)]">Returning</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    {formatNumber(split.returning)} <span className="text-xs font-normal text-[var(--adm-muted)]">{pct(ratio(split.returning, splitTotal))}</span>
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="py-6 text-center text-sm text-[var(--adm-faint)]">No visitors yet</p>
          )}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs text-[var(--adm-faint)]">Devices</p>
              <BarList rows={traffic.devices.map((row) => ({ label: row.label, value: row.visitors }))} />
            </div>
            <div>
              <p className="mb-2 text-xs text-[var(--adm-faint)]">Browsers</p>
              <BarList rows={traffic.browsers.slice(0, 5).map((row) => ({ label: row.label, value: row.visitors }))} />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card title="Best traffic sources" description="Which sources bring sessions that go on to complete a roast.">
          <Table
            head={["Source", "Sessions", "Visitors", "Roasted", "Conv."]}
            rows={traffic.sources.map((row) => [SOURCE_LABELS[row.label] ?? row.label, row.sessions, row.visitors, row.converted, pct(ratio(row.converted, row.sessions), 1)])}
          />
        </Card>
        <Card title="Landing pages" description="First page of each session, and how often that session completed a roast.">
          <Table
            head={["Landing page", "Sessions", "Visitors", "Roasted", "Conv."]}
            rows={traffic.landingPages.map((row) => [row.label, row.sessions, row.visitors, row.converted, pct(ratio(row.converted, row.sessions), 1)])}
          />
        </Card>
        <Card title="Top pages" description="All page views by path. Roast Off share links are grouped as /[roast-off].">
          <Table head={["Page", "Views", "Visitors"]} rows={traffic.pages.map((row) => [row.label, row.views, row.visitors])} />
        </Card>
        <Card title="Campaigns & countries" description="UTM campaigns by session; countries come from the host's geo header (no IPs stored).">
          <Table
            head={["Campaign", "Sessions", "Roasted"]}
            rows={traffic.campaigns.map((row) => [row.label, row.sessions, row.converted])}
            empty="No UTM-tagged visits yet"
          />
          <div className="mt-4">
            <BarList rows={traffic.countries.map((row) => ({ label: row.label, value: row.visitors }))} empty="No country data (only available on hosts that send a geo header)" />
          </div>
        </Card>
      </div>
    </>
  );
}

const REASON_LABELS: Record<string, string> = {
  rate_limited: "Hit the fair-use limit",
  invalid_input: "Invalid or unreadable input",
  ai_unavailable: "AI providers unavailable",
  ai_not_configured: "AI not configured",
  server_error: "Server error",
  network: "Network failure (never reached server)",
  clipboard: "Clipboard blocked",
  render: "Rendering failed"
};

function Features({ data, granularity }: { data: DashboardData; granularity: Granularity }) {
  const { features, series, buckets } = data;
  const charts = [
    {
      title: "CV roasts",
      lines: [
        { label: "Started", color: "var(--adm-s3)", values: series.roastsStarted, dashed: true },
        { label: "Completed", color: "var(--adm-s1)", values: series.roastsCompleted },
        { label: "Failed", color: "var(--adm-bad)", values: series.roastsFailed }
      ]
    },
    {
      title: "AI CV generation",
      lines: [
        { label: "Started", color: "var(--adm-s3)", values: series.generationsStarted, dashed: true },
        { label: "Completed", color: "var(--adm-s4)", values: series.generationsCompleted },
        { label: "Failed", color: "var(--adm-bad)", values: series.generationsFailed }
      ]
    },
    {
      title: "Roast Off sharing",
      lines: [
        { label: "Links created", color: "var(--adm-s5)", values: series.sharesCreated },
        { label: "Copies / shares", color: "var(--adm-s2)", values: series.sharesCopied },
        { label: "Link visits", color: "var(--adm-s1)", values: series.shareOpens }
      ]
    },
    {
      title: "Roast image downloads",
      lines: [
        { label: "Started", color: "var(--adm-s3)", values: series.downloadsStarted, dashed: true },
        { label: "Handed to browser", color: "var(--adm-s2)", values: series.downloadsCompleted },
        { label: "Failed", color: "var(--adm-bad)", values: series.downloadsFailed }
      ]
    }
  ];

  return (
    <>
      <SectionHeading
        id="features"
        title="Feature usage"
        description="Roast and CV generation outcomes are recorded by the server after the AI call finishes. Success rate = completed ÷ (completed + failed); abandoned = the visitor cancelled while waiting."
      />
      <Card>
        <Table
          head={["Feature", "Started", "Completed", "Failed", "Abandoned", "Unique users", "Success"]}
          rows={features.rows.map((row) => [
            row.label,
            row.started ?? "—",
            row.completed,
            row.failed,
            row.abandoned ?? "—",
            row.uniqueVisitors,
            pct(row.successRate, 1)
          ])}
        />
      </Card>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {charts.map((chart) => (
          <Card key={chart.title} title={chart.title} action={<Legend series={chart.lines} />}>
            <LineChart series={chart.lines} buckets={buckets} granularity={granularity} height={180} ariaLabel={`${chart.title} over time`} />
          </Card>
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="Why roasts and generations fail" description="Server-recorded failure reasons.">
          <BarList
            rows={features.failureReasons.map((row) => ({
              label: `${row.feature === "roast" ? "Roast" : `CV${row.mode ? ` (${row.mode.replace("_", " ")})` : ""}`}: ${REASON_LABELS[row.reason] ?? row.reason}`,
              value: row.total
            }))}
            empty="No failures in this range"
            color="var(--adm-bad-soft)"
          />
        </Card>
        <Card title="AI CV generation by mode" description="Rewrite of the original, rewrite using the roast, or the No-CV builder.">
          <BarList
            rows={features.generationModes.map((row) => ({
              label: { rewrite: "Rewrite (no roast)", from_roast: "Rewrite from roast", builder: "No-CV builder" }[row.mode] ?? row.mode,
              value: row.total
            }))}
            empty="No CVs generated yet"
          />
        </Card>
        <Card title="Browser-side errors" description="Problems the server never saw (network failures, blocked clipboard).">
          <BarList
            rows={features.clientErrors.map((row) => ({ label: `${row.feature}: ${REASON_LABELS[row.reason] ?? row.reason}`, value: row.total }))}
            empty="No browser errors in this range"
            color="var(--adm-bad-soft)"
          />
        </Card>
      </div>
    </>
  );
}

function Funnel({ data }: { data: DashboardData }) {
  const stages = data.funnel.stages;
  const top = stages[0]?.visitors ?? 0;
  const conversion = data.funnel.roastToGeneration;
  return (
    <>
      <SectionHeading
        id="funnel"
        title="Conversion funnel"
        description="Diagnostic, not a forced path: each bar is the number of distinct anonymous visitors who did that action in the range, whatever order they did it in. A later stage can be larger than an earlier one (e.g. builder users generate a CV without roasting). Visitors with Do Not Track are counted in totals elsewhere but can't be followed here."
      />
      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <ol className="space-y-3">
            {stages.map((stage, index) => {
              const previous = index > 0 ? stages[index - 1].visitors : null;
              const lost = previous !== null && previous > stage.visitors ? previous - stage.visitors : 0;
              return (
                <li key={stage.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                    <span className="text-[var(--adm-text)]">
                      <span className="mr-2 text-xs tabular-nums text-[var(--adm-faint)]">{index + 1}</span>
                      {stage.label}
                    </span>
                    <span className="tabular-nums text-[var(--adm-muted)]">
                      <span className="font-semibold text-[var(--adm-text)]">{formatNumber(stage.visitors)}</span>
                      <span className="ml-2 text-xs">{pct(ratio(stage.visitors, top), 1)} of visitors</span>
                      {previous !== null ? <span className="ml-2 text-xs">· {pct(ratio(stage.visitors, previous), 1)} of previous</span> : null}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--adm-bar)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${top ? Math.min(100, (stage.visitors / top) * 100) : 0}%`, background: index === 0 ? "var(--adm-s2)" : "var(--adm-s1)" }}
                    />
                  </div>
                  {lost ? <p className="mt-1 text-[11px] text-[var(--adm-faint)]">−{formatNumber(lost)} fewer than the previous stage</p> : null}
                </li>
              );
            })}
          </ol>
        </Card>
        <Card title="Roast → new CV" description="Of the visitors who completed a roast in this range, how many then started and finished an AI CV (after the roast, same browser).">
          <dl className="space-y-4">
            <Stat label="Completed a roast" value={formatNumber(conversion.roasters)} />
            <Stat label="Then started a CV" value={formatNumber(conversion.started)} hint={pct(ratio(conversion.started, conversion.roasters), 1)} />
            <Stat label="Then got a CV" value={formatNumber(conversion.completed)} hint={pct(ratio(conversion.completed, conversion.roasters), 1)} />
          </dl>
        </Card>
      </div>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="text-xs text-[var(--adm-faint)]">{label}</dt>
      <dd className="mt-0.5 flex items-baseline gap-2">
        <span className="font-display text-xl font-semibold tabular-nums">{value}</span>
        {hint ? <span className="text-xs text-[var(--adm-muted)]">{hint}</span> : null}
      </dd>
    </div>
  );
}

function RoastOff({ data, granularity }: { data: DashboardData; granularity: Granularity }) {
  const { roastOff, series, buckets } = data;
  const lines = [
    { label: "Links created", color: "var(--adm-s5)", values: series.sharesCreated },
    { label: "Copies / shares", color: "var(--adm-s2)", values: series.sharesCopied },
    { label: "Link visits", color: "var(--adm-s1)", values: series.shareOpens },
    { label: "Interactions", color: "var(--adm-s4)", values: series.shareInteractions, dashed: true }
  ];
  const bestDays = buckets
    .map((key, index) => ({ key, value: series.sharesCopied[index] + series.shareOpens[index] }))
    .filter((day) => day.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <>
      <SectionHeading
        id="roast-off"
        title="Roast Off performance"
        description="A link is “created” the first time it leaves the page, “copied” on every copy or share-sheet share, and “opened” when someone loads it. Links are identified by their opaque code; no CV or roast content is shown or stored."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Links created" value={roastOff.created} />
        <MiniStat label="Copies / shares" value={roastOff.copies} hint={`${formatNumber(roastOff.nativeShares)} via share sheet`} />
        <MiniStat label="Link visits" value={roastOff.opens} hint={`${formatNumber(roastOff.opensByOthers)} by someone other than the sharer`} />
        <MiniStat label="Unique visitors reached" value={roastOff.uniqueOpeners} />
        <MiniStat
          label="Avg visits per link"
          value={roastOff.linksOpened ? (roastOff.opens / roastOff.linksOpened).toFixed(1) : "—"}
          hint="across links opened in range"
        />
        <MiniStat label="Interactions" value={roastOff.interactions} hint={`${formatNumber(roastOff.interactingVisitors)} visitors uploaded, roasted, or generated`} />
        <MiniStat
          label="Openers who roasted"
          value={roastOff.downstream.roasted}
          hint={`${pct(ratio(roastOff.downstream.roasted, roastOff.downstream.openers), 1)} of ${formatNumber(roastOff.downstream.openers)} openers`}
        />
        <MiniStat
          label="Openers who generated a CV"
          value={roastOff.downstream.generated}
          hint={pct(ratio(roastOff.downstream.generated, roastOff.downstream.openers), 1)}
        />
      </div>
      <Card title="Sharing over time" className="mt-3" action={<Legend series={lines} />}>
        <LineChart series={lines} buckets={buckets} granularity={granularity} height={200} ariaLabel="Roast Off sharing over time" />
      </Card>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="Most visited links" description="By opaque share code." className="lg:col-span-2">
          <Table
            head={["Link", "Visits", "Visitors", "Roasted after", "Last visit"]}
            rows={roastOff.topLinks.map((link) => [`/${link.id}`, link.opens, link.visitors, link.roasted, new Date(link.lastOpened).toLocaleDateString()])}
            empty="No shared links opened yet"
          />
        </Card>
        <div className="grid gap-3">
          <Card title="Where link visitors came from" description="Referrer of sessions that landed on a share link.">
            <BarList rows={roastOff.referral.map((row) => ({ label: row.label, value: row.sessions }))} empty="No share-link sessions yet" />
          </Card>
          <Card title="Best sharing periods" description="Copies + link visits.">
            <BarList rows={bestDays.map((day) => ({ label: formatBucket(day.key, granularity, true), value: day.value }))} empty="No sharing yet" />
          </Card>
        </div>
      </div>
    </>
  );
}

const TRIGGER_LABELS: Record<string, string> = {
  after_roast: "After a roast",
  engaged: "After 45s on the site",
  exit_intent: "Exit intent (desktop)"
};

const CLOSE_LABELS: Record<string, string> = {
  close: "✕ button",
  no_thanks: "“No thanks” link",
  escape: "Esc key"
};

function EmailSignups({ data, granularity }: { data: DashboardData; granularity: Granularity }) {
  const { email, series, buckets } = data;
  const lines = [
    { label: "Saw the popup", color: "var(--adm-s1)", values: series.popupShown },
    { label: "Closed it", color: "var(--adm-s3)", values: series.popupDismissed, dashed: true },
    { label: "Signed up", color: "var(--adm-s2)", values: series.emailSubscribed }
  ];
  const leftOpen = Math.max(email.shown - email.dismissed - email.subscribed, 0);

  return (
    <>
      <SectionHeading
        id="emails"
        title="Email signups"
        description="The “get updates” popup. It shows at most once per session (after a roast, after 45 seconds on the site, or on exit intent), and closing it hides it for 14 days. Popup counts come from analytics events, so your own browser and Do-Not-Track visitors aren't included; “On the list” is the real number of saved addresses."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Saw the popup" value={email.shown} hint={`${formatNumber(email.shownVisitors)} unique visitors`} />
        <MiniStat
          label="Closed it"
          value={email.dismissed}
          hint={`${pct(ratio(email.dismissed, email.shown), 1)} of views · ${formatNumber(leftOpen)} left it open`}
        />
        <MiniStat label="Signed up" value={email.subscribed} hint={`${pct(ratio(email.subscribed, email.shown), 1)} signup rate`} />
        <MiniStat
          label="On the list"
          value={email.list ? email.list.total : "—"}
          hint={email.list ? `+${formatNumber(email.list.newInRange)} new in this range` : "Run `npm run db:migrate` to create the list"}
        />
      </div>
      <Card title="Popup over time" className="mt-3" action={<Legend series={lines} />}>
        <LineChart series={lines} buckets={buckets} granularity={granularity} height={180} ariaLabel="Email popup views, closes and signups over time" />
      </Card>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="What opened it" description="Signup rate by trigger." className="lg:col-span-2">
          <Table
            head={["Trigger", "Seen", "Closed", "Signed up", "Rate"]}
            rows={email.byTrigger.map((row) => [
              TRIGGER_LABELS[row.trigger] ?? row.trigger,
              row.shown,
              row.dismissed,
              row.subscribed,
              pct(ratio(row.subscribed, row.shown), 1)
            ])}
            empty="The popup hasn't been shown yet"
          />
        </Card>
        <Card title="How people closed it">
          <BarList rows={email.dismissMethods.map((row) => ({ label: CLOSE_LABELS[row.method] ?? row.method, value: row.total }))} empty="Nobody has closed it yet" />
        </Card>
        <Card
          title="Latest signups"
          description="Newest first. Download the CSV to import the full list into your email tool."
          className="lg:col-span-3"
          action={
            email.list?.total ? (
              // A file download from an API route, not a page navigation.
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a
                download
                href="/api/admin/subscribers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--adm-line-strong)] px-2.5 py-1 text-xs text-[var(--adm-muted)] hover:text-[var(--adm-text)]"
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                CSV
              </a>
            ) : null
          }
        >
          {email.list?.recent.length ? (
            <ul className="divide-y divide-[var(--adm-line)] text-sm">
              {email.list.recent.map((row) => (
                <li key={row.email} className="flex items-center justify-between gap-3 py-2">
                  <span className="truncate">{row.email}</span>
                  <span className="shrink-0 text-xs text-[var(--adm-faint)]">{new Date(row.at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-[var(--adm-faint)]">{email.list ? "No signups yet" : "Subscriber table not created yet"}</p>
          )}
        </Card>
      </div>
    </>
  );
}

function MiniStat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-surface)] p-4">
      <p className="text-xs text-[var(--adm-muted)]">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums tracking-tight">{typeof value === "number" ? formatNumber(value) : value}</p>
      {hint ? <p className="mt-1 text-[11px] leading-4 text-[var(--adm-faint)]">{hint}</p> : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading analytics">
      {Array.from({ length: 9 }, (_, index) => (
        <div key={index} className="h-[150px] animate-pulse rounded-xl border border-[var(--adm-line)] bg-[var(--adm-surface)]" />
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  const copy = ERROR_COPY[error] ?? {
    title: error === "network" ? "Couldn't reach the server" : "Analytics query failed",
    body: "Check the server logs for “[admin-analytics]”. Your public site is unaffected."
  };
  return (
    <div className="mt-6 rounded-xl border border-[var(--adm-bad-soft)] bg-[var(--adm-surface)] p-6" role="alert">
      <p className="font-semibold">{copy.title}</p>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--adm-muted)]">{copy.body}</p>
      <button type="button" onClick={onRetry} className="mt-4 rounded-lg border border-[var(--adm-line-strong)] px-3 py-1.5 text-sm">
        Try again
      </button>
    </div>
  );
}

function EmptyBanner() {
  return (
    <div className="mt-6 rounded-xl border border-[var(--adm-line)] bg-[var(--adm-surface)] p-5 text-sm leading-6 text-[var(--adm-muted)]">
      <p className="font-semibold text-[var(--adm-text)]">No events collected yet</p>
      Tracking is connected and waiting for the first real visit. To check it end to end, open the site in a private window (your admin browser is
      excluded on purpose), roast a CV, and refresh this page. Browsers with Do Not Track or Global Privacy Control are not tracked.
    </div>
  );
}
