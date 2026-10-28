-- VibeJudge analytics, schema v1. Idempotent: safe to run more than once.
-- No CV text, roast text, file names, emails, IP addresses, or raw user agents are ever stored here.

create table if not exists analytics_events (
  id              bigserial primary key,
  event_id        uuid        not null unique,            -- idempotency key (client- or server-generated)
  schema_version  smallint    not null default 1,
  name            text        not null,
  source          text        not null check (source in ('client', 'server')),  -- 'server' = outcome confirmed by the backend
  occurred_at     timestamptz not null,
  received_at     timestamptz not null default now(),
  visitor_id      text,                                   -- random first-party id (localStorage), null if opted out
  session_id      text,                                   -- random id, 30-minute inactivity timeout
  entity_id       text,                                   -- opaque roast-off share code, when relevant
  path            text,                                   -- pathname only, no query string
  referrer_host   text,                                   -- hostname only
  traffic_source  text,                                   -- direct | organic | social | referral | campaign | paid | email | internal
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  device          text,                                   -- mobile | tablet | desktop
  browser         text,                                   -- browser family only
  country         text,                                   -- ISO country from the host's geo header, if any
  metadata        jsonb       not null default '{}'::jsonb   -- enum-only fields, validated per event
                  check (jsonb_typeof(metadata) = 'object')
);

create index if not exists analytics_events_occurred_idx      on analytics_events (occurred_at desc);
create index if not exists analytics_events_name_occurred_idx on analytics_events (name, occurred_at);
create index if not exists analytics_events_visitor_idx       on analytics_events (visitor_id, occurred_at) where visitor_id is not null;
create index if not exists analytics_events_session_idx       on analytics_events (session_id, name) where session_id is not null;
create index if not exists analytics_events_entity_idx        on analytics_events (entity_id, name) where entity_id is not null;

-- If you use Supabase: keep the table private to the server. With RLS on and no policies,
-- the anon/authenticated API roles cannot read or write it; the server connects as the DB owner.
alter table analytics_events enable row level security;
