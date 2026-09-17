-- Migration: create_newsletter_subscribers.sql
-- Trivoxa Group newsletter registry (Privacy Policy §"Processing infrastructure
-- and storage" / §"Data sharing" already describes this list and its one-click
-- unsubscribe — this is the table that claim depends on).

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  source text,
  unsubscribed_at timestamptz
);

create index if not exists idx_newsletter_subscribers_created_at
  on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;

-- Strict RLS: service role only, same posture as rfq_submissions / contact_submissions.
drop policy if exists "Deny all public access to newsletter_subscribers" on public.newsletter_subscribers;
create policy "Deny all public access to newsletter_subscribers"
  on public.newsletter_subscribers
  for all
  to anon, authenticated
  using (false);
