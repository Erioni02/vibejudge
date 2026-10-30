"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActivityItem } from "@/lib/server/analytics/queries";

const POLL_MS = 20_000;

type Tone = "neutral" | "good" | "bad" | "accent";

function describe(item: ActivityItem): { text: string; tone: Tone } {
  const meta = item.metadata ?? {};
  switch (item.name) {
    case "landing_page_view":
      return { text: `A visitor landed on ${item.path ?? "a page"}`, tone: "neutral" };
    case "cv_roast_completed":
      return { text: "A visitor completed a CV roast", tone: "good" };
    case "cv_roast_failed":
      return { text: `A CV roast failed (${String(meta.reason ?? "unknown").replace(/_/g, " ")})`, tone: "bad" };
    case "cv_generation_completed":
      return { text: `A CV was generated with AI (${String(meta.mode ?? "").replace(/_/g, " ")})`, tone: "good" };
    case "cv_generation_failed":
      return { text: `CV generation failed (${String(meta.reason ?? "unknown").replace(/_/g, " ")})`, tone: "bad" };
    case "roast_off_share_created":
      return { text: "A Roast Off link was created", tone: "accent" };
    case "roast_off_share_copied":
      return { text: meta.method === "native" ? "A Roast Off link was shared via the share sheet" : "A Roast Off link was copied", tone: "accent" };
    case "roast_off_share_opened":
      return { text: "A shared roast was opened", tone: "accent" };
    case "roast_off_interaction":
      return { text: `A Roast Off visitor ${{ upload_started: "picked a CV to upload", roast_completed: "finished their own roast", generation_started: "started an AI CV" }[String(meta.action)] ?? "interacted"}`, tone: "accent" };
    case "roast_image_download_completed":
      return { text: "A roast image download was handed to the browser", tone: "good" };
    case "roast_image_download_failed":
      return { text: "A roast image failed to render", tone: "bad" };
    case "cv_download_completed":
      return { text: `A generated CV was downloaded (${String(meta.format ?? "").toUpperCase()})`, tone: "good" };
    case "email_subscribed":
      return { text: "Someone joined the updates email list", tone: "good" };
    case "client_error":
      return { text: `Browser error: ${String(meta.feature)} (${String(meta.reason)})`, tone: "bad" };
    default:
      return { text: item.name, tone: "neutral" };
  }
}

const TONE_COLOR: Record<Tone, string> = {
  neutral: "var(--adm-s3)",
  good: "var(--adm-good)",
  bad: "var(--adm-bad)",
  accent: "var(--adm-accent)"
};

function relative(iso: string, now: number) {
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

/** Periodically refreshed (polling every 20 s while the tab is visible) — not a live stream. */
export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const [error, setError] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/analytics/activity", { cache: "no-store" });
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      const payload = (await response.json()) as { items: ActivityItem[] };
      setItems(payload.items);
      setError(false);
      setFetchedAt(Date.now());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_MS);
    const tick = window.setInterval(() => setNow(Date.now()), 5_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(poll);
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return (
    <div className="mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Recent activity</h2>
          <p className="mt-1 text-sm text-[var(--adm-muted)]">
            Latest notable events from the last 30 days. Visitors appear only as a short one-way hash of their random id.
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-[var(--adm-faint)]">
          <span className={`h-1.5 w-1.5 rounded-full ${error ? "bg-[var(--adm-bad)]" : "bg-[var(--adm-good)]"}`} aria-hidden />
          Polling every 20 s (not real-time)
          {fetchedAt ? ` · checked ${relative(new Date(fetchedAt).toISOString(), now)}` : ""}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-surface)]">
        {items === null ? (
          <p className="p-6 text-center text-sm text-[var(--adm-faint)]">{error ? "Couldn't load activity." : "Loading activity…"}</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-sm text-[var(--adm-faint)]">No activity in the last 30 days yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--adm-line)]">
            {items.map((item) => {
              const { text, tone } = describe(item);
              const chips = [
                item.trafficSource && item.name === "landing_page_view" ? item.referrerHost ?? item.trafficSource : null,
                item.entityId ? `link /${item.entityId}` : null,
                item.device,
                item.country
              ].filter(Boolean) as string[];
              return (
                <li key={item.id} className="flex flex-col gap-1 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:gap-3">
                  <span className="flex min-w-0 flex-1 items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TONE_COLOR[tone] }} aria-hidden />
                    <span className="truncate text-[var(--adm-text)]">{text}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5 pl-[18px] text-[11px] text-[var(--adm-faint)] sm:pl-0">
                    {chips.map((chip) => (
                      <span key={chip} className="rounded border border-[var(--adm-line)] px-1.5 py-0.5">
                        {chip}
                      </span>
                    ))}
                    {item.visitor ? <span className="font-mono">v·{item.visitor}</span> : <span>anonymous</span>}
                    <time dateTime={item.at} title={new Date(item.at).toLocaleString()} className="w-16 text-right tabular-nums">
                      {relative(item.at, now)}
                    </time>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
