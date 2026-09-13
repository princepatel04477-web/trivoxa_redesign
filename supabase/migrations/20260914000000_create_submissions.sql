-- Migration: create_submissions.sql
-- Trivoxa Group RFQ and Contact form submissions tables
-- Enables RLS and restricts inserts/selects to service role only.

-- RFQ Submissions
create table if not exists public.rfq_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  reference text not null unique,
  full_name text not null,
  company_name text not null,
  email text not null,
  phone text,
  destination text,
  industry text,
  category text,
  product text,
  requirement text not null,
  referral text,
  path text,
  division text,
  payload jsonb not null default '{}'::jsonb
);

-- Contact Submissions
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  reference text not null unique,
  inquiry_type text not null,
  full_name text not null,
  company_name text,
  email text not null,
  callback_number text,
  message text not null,
  payload jsonb not null default '{}'::jsonb
);

-- Indices for operational lookups
create index if not exists idx_rfq_submissions_created_at on public.rfq_submissions (created_at desc);
create index if not exists idx_rfq_submissions_reference on public.rfq_submissions (reference);
create index if not exists idx_contact_submissions_created_at on public.contact_submissions (created_at desc);
create index if not exists idx_contact_submissions_reference on public.contact_submissions (reference);

-- Enable Row Level Security (RLS)
alter table public.rfq_submissions enable row level security;
alter table public.contact_submissions enable row level security;

-- Strict RLS: Do NOT allow public anon access
-- The service role key used server-side automatically bypasses RLS in Supabase.
drop policy if exists  Deny all public access to rfq_submissions on public.rfq_submissions;
create policy Deny all public access to rfq_submissions
  on public.rfq_submissions
  for all
  to anon, authenticated
  using (false);

drop policy if exists Deny all public access to contact_submissions on public.contact_submissions;
create policy Deny all public access to contact_submissions
  on public.contact_submissions
  for all
  to anon, authenticated
  using (false);
