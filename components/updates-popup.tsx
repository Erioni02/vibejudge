"use client";

import { Check, Flame, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PopupTrigger } from "@/lib/analytics/events";
import { analyticsHeaders, trackEvent } from "@/lib/analytics/client";

/**
 * "Get updates" email capture. A small corner card (bottom sheet on phones) that never blocks the page
 * or steals focus, and shows at most once per session at a good moment:
 * - a few seconds after a roast lands (the visitor is engaged and has just seen what the product does),
 * - otherwise after 45s of actually looking at the site,
 * - or on desktop exit intent.
 * Closing it snoozes it for 14 days; signing up hides it for good.
 */

const STATE_KEY = "vj_updates";
const SHOWN_KEY = "vj_updates_shown";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const AFTER_ROAST_DELAY_MS = 5000;
const ENGAGED_AFTER_MS = 45_000;
const EXIT_INTENT_AFTER_MS = 10_000;
const HIDDEN_ON = ["/admin-analytics", "/privacy", "/terms"];

/** Fired by the roast flow so the popup waits for (and then follows) a roast instead of interrupting it. */
export const ROAST_EVENT = "vj:roast";
export type RoastEventDetail = { state: "started" | "completed" | "failed" };

export function announceRoast(state: RoastEventDetail["state"]) {
  window.dispatchEvent(new CustomEvent<RoastEventDetail>(ROAST_EVENT, { detail: { state } }));
}

type Stored = { status: "subscribed" } | { status: "dismissed"; at: number };

function read<T>(kind: "local" | "session", key: string): T | null {
  try {
    const store = kind === "local" ? window.localStorage : window.sessionStorage;
    return JSON.parse(store.getItem(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}

function write(kind: "local" | "session", key: string, value: unknown) {
  try {
    (kind === "local" ? window.localStorage : window.sessionStorage).setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked: the in-memory guard still keeps it to once per page load
  }
}

function eligible() {
  if (read<boolean>("session", SHOWN_KEY)) return false;
  const stored = read<Stored>("local", STATE_KEY);
  if (stored?.status === "subscribed") return false;
  if (stored?.status === "dismissed" && Date.now() - stored.at < SNOOZE_MS) return false;
  return true;
}

const ERRORS: Record<string, string> = {
  invalid_email: "That email doesn't look right. Mind checking it?",
  rate_limited: "Too many tries. Give it a few minutes."
};

type Phase = "hidden" | "open" | "closing";
type View = "form" | "sending" | "done";

const COPY: Record<PopupTrigger, { title: string; body: string }> = {
  after_roast: {
    title: "Want round two to sting less?",
    body: "Get new features, CV templates and job-hunt tips the moment they drop."
  },
  engaged: {
    title: "Be first to get what's next",
    body: "New roast modes, CV templates and job-hunt tips, sent the moment they ship."
  },
  exit_intent: {
    title: "Before you go, want the upgrades?",
    body: "New roast modes, CV templates and job-hunt tips, sent the moment they ship."
  }
};

export function UpdatesPopup() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [view, setView] = useState<View>("form");
  const [trigger, setTrigger] = useState<PopupTrigger>("engaged");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const shown = useRef(false);
  const roastBusy = useRef(false);

  const hiddenHere = HIDDEN_ON.some((path) => pathname.startsWith(path));

  const show = useCallback(
    (reason: PopupTrigger, force = false) => {
      if (shown.current || (!force && (hiddenHere || !eligible()))) return;
      shown.current = true;
      write("session", SHOWN_KEY, true);
      setTrigger(reason);
      setPhase("open");
      trackEvent("email_popup_shown", { meta: { trigger: reason } });
    },
    [hiddenHere]
  );

  // Triggers. Each one is a no-op once the popup has been shown this session.
  useEffect(() => {
    if (hiddenHere) return;
    const startedAt = Date.now();
    let roastTimer: number | undefined;

    // Preview link for checking the design: /?preview=updates
    if (new URLSearchParams(window.location.search).get("preview") === "updates") {
      roastTimer = window.setTimeout(() => show("engaged", true), 600);
    }

    const onRoast = (event: Event) => {
      const { state } = (event as CustomEvent<RoastEventDetail>).detail;
      roastBusy.current = state === "started";
      if (state === "completed") {
        window.clearTimeout(roastTimer);
        roastTimer = window.setTimeout(() => show("after_roast"), AFTER_ROAST_DELAY_MS);
      }
    };

    // Count only time the tab is actually visible, and never interrupt a roast in progress.
    let visibleMs = 0;
    let last = Date.now();
    const tick = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === "visible") visibleMs += now - last;
      last = now;
      if (visibleMs >= ENGAGED_AFTER_MS && !roastBusy.current) show("engaged");
    }, 1000);

    const desktop = window.matchMedia("(pointer: fine)").matches;
    const onLeave = (event: MouseEvent) => {
      if (event.relatedTarget === null && event.clientY <= 0 && Date.now() - startedAt > EXIT_INTENT_AFTER_MS && !roastBusy.current) {
        show("exit_intent");
      }
    };

    window.addEventListener(ROAST_EVENT, onRoast);
    if (desktop) document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener(ROAST_EVENT, onRoast);
      document.removeEventListener("mouseout", onLeave);
      window.clearInterval(tick);
      window.clearTimeout(roastTimer);
    };
  }, [hiddenHere, show]);

  const close = useCallback(
    (method: "close" | "no_thanks" | "escape") => {
      if (phase !== "open") return;
      if (view !== "done") {
        write("local", STATE_KEY, { status: "dismissed", at: Date.now() } satisfies Stored);
        trackEvent("email_popup_dismissed", { meta: { trigger, method } });
      }
      setPhase("closing");
    },
    [phase, view, trigger]
  );

  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close("escape");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  // After a successful signup, say thanks briefly and get out of the way.
  useEffect(() => {
    if (view !== "done" || phase !== "open") return;
    const timer = window.setTimeout(() => setPhase("closing"), 3200);
    return () => window.clearTimeout(timer);
  }, [view, phase]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (view === "sending") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(ERRORS.invalid_email);
      return;
    }
    setError("");
    setView("sending");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...analyticsHeaders() },
        body: JSON.stringify({ email, trigger, path: window.location.pathname, ...(company ? { company } : {}) })
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !payload?.ok) {
        setError(ERRORS[payload?.error ?? ""] ?? "Couldn't save that right now. Please try again in a moment.");
        setView("form");
        return;
      }
      write("local", STATE_KEY, { status: "subscribed" } satisfies Stored);
      setView("done");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setView("form");
    }
  }

  if (phase === "hidden") return null;
  const copy = COPY[trigger];

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6">
      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="vj-updates-title"
        aria-describedby="vj-updates-body"
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && phase === "closing") setPhase("hidden");
        }}
        className={`vj-popup pointer-events-auto relative w-full max-w-[380px] overflow-hidden rounded-card border border-line bg-white p-5 shadow-lift ${
          phase === "closing" ? "vj-popup-out" : "vj-popup-in"
        }`}
      >
        <div aria-hidden className="vj-popup-glow pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ember via-amber to-ember" />
        <button
          type="button"
          onClick={() => close("close")}
          aria-label="Close"
          className="focus-ring absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full text-ink-3 transition hover:bg-paper-2 hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        {view === "done" ? (
          <div className="vj-stagger flex items-center gap-3 pr-8" role="status">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-moss text-white">
              <Check className="vj-check h-5 w-5" strokeWidth={3} aria-hidden />
            </span>
            <div>
              <p id="vj-updates-title" className="font-display text-lg font-semibold tracking-tight">
                You&apos;re on the list
              </p>
              <p id="vj-updates-body" className="text-sm leading-5 text-ink-3">
                We&apos;ll only email when something new ships.
              </p>
            </div>
          </div>
        ) : (
          <div className="vj-stagger">
            <div className="flex items-start gap-3 pr-8">
              <span className="vj-wiggle grid h-10 w-10 shrink-0 place-items-center rounded-control bg-ember-soft text-ember">
                <Flame className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 id="vj-updates-title" className="font-display text-[17px] font-semibold leading-snug tracking-tight text-ink">
                  {copy.title}
                </h2>
                <p id="vj-updates-body" className="mt-1 text-sm leading-5 text-ink-3">
                  {copy.body}
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-4" noValidate>
              <label htmlFor="vj-updates-email" className="sr-only">
                Email address
              </label>
              {/* Honeypot: invisible to people and screen readers. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <div className="flex gap-2">
                <input
                  id="vj-updates-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "vj-updates-error" : undefined}
                  className="focus-ring min-w-0 flex-1 rounded-control border border-line-strong bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-3/70 transition focus:border-ink-3 sm:text-sm"
                />
                <button type="submit" className="btn btn-primary shrink-0" aria-busy={view === "sending" || undefined} disabled={view === "sending"}>
                  {view === "sending" ? "Adding…" : "Count me in"}
                </button>
              </div>
              {error ? (
                <p id="vj-updates-error" role="alert" className="mt-2 text-[13px] text-ember-dark">
                  {error}
                </p>
              ) : null}
            </form>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-ink-3">
              <p>
                No spam. Unsubscribe anytime.{" "}
                <Link href="/privacy#updates" className="underline decoration-line-strong underline-offset-2 hover:text-ink">
                  Privacy
                </Link>
              </p>
              <button type="button" onClick={() => close("no_thanks")} className="focus-ring shrink-0 rounded-sm font-medium text-ink-3 hover:text-ink">
                No thanks
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
