-- Product-update email list. Idempotent: safe to run more than once.
-- Deliberately NOT linked to analytics: no visitor or session id is stored, so signing up never
-- de-anonymises anyone's analytics history.

create table if not exists email_subscribers (
  id               bigserial primary key,
  email            text        not null unique check (email = lower(email) and length(email) <= 254),
  source           text        not null default 'popup',   -- where the signup form lives
  trigger          text,                                   -- what opened the popup: after_roast | engaged | exit_intent
  path             text,                                   -- pathname the visitor signed up on
  country          text,                                   -- ISO country from the host's geo header, if any
  created_at       timestamptz not null default now(),
  unsubscribed_at  timestamptz                             -- set when someone opts out; keep the row so they are never re-added by mistake
);

create index if not exists email_subscribers_created_idx on email_subscribers (created_at desc);

-- Private to the server, like analytics_events: RLS on, no policies.
alter table email_subscribers enable row level security;
