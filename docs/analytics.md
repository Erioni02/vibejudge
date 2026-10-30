# VibeJudge analytics

First-party product analytics behind a private admin dashboard at **`/admin-analytics`**. No third-party scripts, no cookies for visitors, no fingerprinting, and no CV content anywhere in analytics.

## Setup

1. **Database.** Create any Postgres database (Neon or Supabase via the Vercel Marketplace, Vercel Postgres, RDS…) and copy its connection string. On Supabase, use the pooled connection string (port 6543).
2. **Schema.** Run the migration once (it is idempotent):
   ```bash
   DATABASE_URL="postgres://…" npm run db:migrate
   ```
3. **Admin credentials.** Run `npm run admin:hash`, type a strong password (12+ chars), and copy the two printed values.
4. **Environment variables** (server-side only, never `NEXT_PUBLIC_`). In Vercel: Project → Settings → Environment Variables, Production (and Preview if wanted):

   | Variable | Purpose |
   | --- | --- |
   | `DATABASE_URL` | Postgres connection string. Without it the site works normally but stores no analytics. |
   | `ADMIN_USERNAME` | The single administrator's username. |
   | `ADMIN_PASSWORD_HASH` | `scrypt:…` hash from `npm run admin:hash`. The plain password is never stored. |
   | `ADMIN_SESSION_SECRET` | 32+ random characters used to sign the session cookie (printed by `npm run admin:hash`). |
   | `ANALYTICS_RETENTION_DAYS` | Optional. Raw-event retention, default `395` (13 months), minimum `30`. |

   If any of the three `ADMIN_*` values is missing, `/admin-analytics` returns 404 and the login API is disabled.
5. **Redeploy**, open `https://vibejudge.app/admin-analytics`, and sign in.

Rotating `ADMIN_PASSWORD_HASH` or `ADMIN_SESSION_SECRET` signs out every existing session.

## Security model

- Every admin page and API checks a signed, HttpOnly, `SameSite=Strict`, `Secure` session cookie **on the server** (`lib/server/admin-auth.ts`). Sessions last 12 hours.
- Login (`POST /api/admin/session`) checks the origin, is rate-limited (5 attempts per IP and 30 in total per 15 minutes), compares in constant time, and never reveals whether the username or the password was wrong.
- `/admin-analytics` and `/api/admin/*` send `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, and `X-Frame-Options: DENY`; the page also has robots `noindex, nofollow` metadata. The route is deliberately **not** listed in `robots.txt`, because listing it would advertise it.
- The public ingestion endpoint (`POST /api/track`) validates every event with strict per-event schemas, caps body size (16 KB) and batch size (25), and is rate-limited per IP. It **refuses** the trusted outcome events (roast and CV generation), which only the server can write, so nobody can inflate them from a browser.
- The old `GET /api/track`, which exposed in-memory counters publicly, has been removed.
- On Supabase, the migration enables row-level security with no policies, so the public API keys cannot read the table.

## Event catalogue (schema v1)

Defined in `lib/analytics/events.ts`. Every event stores: `event_id` (UUID, idempotency key), `name`, `source` (`client` or `server`), `occurred_at`, anonymous `visitor_id` and `session_id`, an optional `entity_id` (the roast-off share code), `path` (pathname only), coarse `device`/`browser`/`country`, and enum-only `metadata`.

**Traffic (client)**
| Event | When |
| --- | --- |
| `page_view` | Every route change. |
| `session_started` | First event after 30+ min of inactivity. Carries the first-touch referrer host and UTM tags. |
| `landing_page_view` | Same moment: the session's first page. |
| `unique_visitor` / `returning_visitor` | At session start: a brand-new browser id, or an existing one. |
| `session_ended` | Not sent (browsers can't report it reliably). Sessions end after 30 minutes of inactivity. |

**CV roast:** `cv_roast_started`, `cv_upload_completed` (`input: file|text`), `cv_roast_completed`, and `cv_roast_failed` (`reason`) are **server** events in `/api/analyze`. `cv_upload_started` (a file was picked) and `cv_roast_abandoned` (the user cancelled) come from the client.

**AI CV generation:** `cv_generation_started`, `cv_generation_completed`, and `cv_generation_failed` are **server** events from `/api/generate-cv` (`mode: rewrite|from_roast`) and `/api/build-cv` (`mode: builder`). `cv_generation_abandoned` comes from the client.

**Roast Off (client, `entity_id` = share code)**
| Event | When |
| --- | --- |
| `roast_off_share_created` | The first time a roast's link leaves the page (first copy or share-sheet share). One code per roast. |
| `roast_off_share_copied` | Every successful clipboard copy (`method: clipboard`) or native share (`method: native`). |
| `roast_off_share_opened` | Someone loads `/<code>` (or a legacy `/?vs=` link: `legacy: true`, no code). |
| `roast_off_interaction` | A visitor who arrived via a share link uploads a CV, completes a roast, or starts an AI CV. |

**Downloads (client):** `roast_image_download_started`, `roast_image_download_completed`, `roast_image_download_failed` (`variant: full|score_only`); `cv_download_completed` and `cv_download_failed` (`format: pdf|png`).

**Errors (client):** `client_error` (`feature`, `reason: network|clipboard|render`) covers problems the server never saw.

**Email updates popup:** `email_popup_shown` (`trigger: after_roast|engaged|exit_intent`) and `email_popup_dismissed` (`trigger`, `method: close|no_thanks|escape`) come from the client. `email_subscribed` (`trigger`) is a **server** event from `/api/subscribe`, written only when a new address is saved. The address itself never goes into analytics.

## Email updates list

`components/updates-popup.tsx` is a small corner card (a bottom sheet on phones). It never blocks the page or takes focus. Its main trigger is 5 s after a roast completes, once per session; nothing shown earlier uses up that slot. The only other trigger is desktop exit intent (after 15 s on the site, once per session) for visitors who never roast. It never interrupts a roast in progress and is hidden on `/admin-analytics`, `/privacy` and `/terms`. Closing it snoozes it for 24 hours (localStorage `vj_updates`); signing up hides it for good. The `engaged` trigger value remains in the schema only for older events. Add `?preview=updates` to any page to show it immediately for a design check.

Addresses are stored in `email_subscribers` (migration `002`, RLS on): the lower-cased email, trigger, signup path, country and date. No visitor or session id is stored, so the list can't be joined to analytics. `/api/subscribe` checks the origin and rate-limits to 5 requests per IP per 10 minutes. It uses a honeypot field and gives the same reply for new and existing addresses, and a repeat signup never re-subscribes someone whose `unsubscribed_at` is set. The dashboard's **Emails** section shows views, closes, signups and signup rate by trigger, plus the latest signups. **CSV** (`/api/admin/subscribers`, admin-only) exports every active address. To unsubscribe someone, set `unsubscribed_at = now()` on their row.

## Metric definitions

All ranges are local calendar days in the dashboard's time zone (the browser's), `[start, end)`. The comparison period is the same number of days immediately before. "All time" has no comparison. A percentage change is shown only when the previous period has 10 or more; otherwise the absolute difference is shown.

| Metric | Definition |
| --- | --- |
| Total visits | Count of `page_view`. |
| Unique visitors | Distinct `visitor_id` with a `page_view` in the range. In charts this is per bucket. |
| Sessions | Distinct `session_id` with a `page_view`. |
| New vs returning | Active visitors whose first-ever event is inside the range, vs before it. |
| Traffic source / referrer / campaign / landing page | Per session, from its `session_started` / `landing_page_view`. "Roasted" = that session has a server `cv_roast_completed`. |
| CVs roasted | Count of server `cv_roast_completed`. |
| Success rate | completed ÷ (completed + failed). Abandoned and in-flight requests are excluded. |
| Roast Off links created | Distinct `entity_id` on `roast_off_share_created`. |
| Link visits / opened by others | `roast_off_share_opened` count, and those where the opener isn't the link's creator. |
| AI-generated CVs | Count of server `cv_generation_completed` (all modes). |
| Roast images downloaded | `roast_image_download_completed`: the PNG was rendered and handed to the browser's download. |
| Funnel stage | Distinct visitors who did that action in the range, in any order (a diagnostic, not a forced path). "Link opened by someone else" = creators whose link was opened by a different visitor. |
| Roast → new CV | Visitors with a completed roast in range who later (same visitor, still in range) started or completed a generation. |

Trusted events only count when `source = 'server'`. Every query is time-bounded and aggregated in Postgres, using the indexes in the migration. With realistic traffic (up to a few million rows) no rollup tables are needed. If the dashboard becomes slow at larger scale, add daily rollups.

## Privacy

- Never stored: CV files or text, roast text, generated CVs, names, emails, file names, IP addresses, raw user agents, query strings, or full referrer URLs. Metadata is a closed set of enums, so free text is impossible.
- IDs are random UUIDs in `localStorage`, not cookies or fingerprints. Do Not Track or Global Privacy Control turns off browser tracking and ID storage completely. The server still counts roast and CV outcomes for those visitors, but without IDs.
- Excluded traffic: bots and crawlers (user-agent filter), requests carrying the admin session cookie, and any browser that has opened `/admin-analytics` (it is marked internal via `localStorage`; clear site data to undo).
- Retention: events older than `ANALYTICS_RETENTION_DAYS` are deleted automatically (checked at most every 6 hours per server instance during ingestion).
- Country comes from the hosting platform's geo header (`x-vercel-ip-country`), if present.

## Reliability

- Browser events are batched (flushed within ~1.5 s, or immediately via `sendBeacon` when the page is hidden) and re-queued in `sessionStorage` on network or 5xx failures. Every event has a UUID, so retries never double-count (`on conflict (event_id) do nothing`).
- Server events are written after the response is sent (`next/server` `after`), so a slow or broken database can never delay or fail a roast. Failures are logged as `[analytics] write failed`.

## Verifying collection

1. Open the site in a **private window** (your admin browser is excluded on purpose) and turn off Do Not Track there.
2. Check the network tab: `POST /api/track` should return `200` with `{"ok":true}`.
3. Roast a CV, copy the roast-off link, open that link in another private window, and download the roast card.
4. In the dashboard, click **Refresh**: page views, the roast, and the share link's created, copied, and opened counts should all appear, and the Recent activity feed (polling every 20 s) lists them.
5. Or query directly: `select name, source, occurred_at from analytics_events order by id desc limit 20;`

## Known limitations

- **Downloads:** browsers don't confirm that a file was saved, so "downloaded" means "rendered and handed to the browser".
- **Native share sheet:** the browser only reports that the user completed the share sheet, not which app they picked or whether the message was actually sent.
- **Unique visitors** are per browser: the same person on two devices counts twice, and clearing site data creates a new visitor. Do-Not-Track visitors are not counted in traffic at all.
- **Abandoned roasts:** if a user cancels, the server may still finish the AI call and record `cv_roast_completed`. The client separately records `cv_roast_abandoned`.
- **Rate limiting** (AI routes, login, ingestion) is in-memory per server instance, so it is best-effort on multi-instance serverless deployments.
- **Share links** are stateless codes. A link opened without JavaScript (most chat-app link previews) isn't counted, and that is intended.
- **History:** events recorded by the old in-memory counter were never persisted, so the dashboard starts from the first deploy of this system.
