-- Public buyer briefs with controlled Realtor lead summaries.

create table if not exists public.buyer_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  preferred_contact_method text not null,
  preferred_language text not null,
  country text not null,
  region text,
  city text not null,
  property_type text not null,
  budget_min numeric,
  budget_max numeric,
  timeline text not null,
  buying_purpose text not null,
  financing_needed text not null,
  special_requirements text[] not null default '{}',
  message text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_requests_status_check check (
    status in ('submitted', 'matched', 'shortlisted', 'assigned', 'closed')
  )
);

create table if not exists public.buyer_request_realtor_matches (
  id uuid primary key default gen_random_uuid(),
  buyer_request_id uuid not null references public.buyer_requests(id) on delete cascade,
  realtor_user_id uuid not null references auth.users(id) on delete cascade,
  match_score numeric,
  status text not null default 'notified',
  lead_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (buyer_request_id, realtor_user_id),
  constraint buyer_request_realtor_matches_status_check check (
    status in ('notified', 'viewed', 'interested', 'declined', 'shortlisted', 'assigned')
  )
);

alter table public.buyer_requests enable row level security;
alter table public.buyer_request_realtor_matches enable row level security;

drop policy if exists buyer_requests_private_read on public.buyer_requests;
create policy buyer_requests_private_read on public.buyer_requests
for select using (
  email = (auth.jwt() ->> 'email')
  or public.is_platform_admin()
);

drop policy if exists buyer_requests_admin_update on public.buyer_requests;
create policy buyer_requests_admin_update on public.buyer_requests
for update using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists buyer_request_matches_realtor_read on public.buyer_request_realtor_matches;
create policy buyer_request_matches_realtor_read on public.buyer_request_realtor_matches
for select using (
  realtor_user_id = auth.uid()
  or public.is_platform_admin()
);

drop policy if exists buyer_request_matches_realtor_update on public.buyer_request_realtor_matches;
create policy buyer_request_matches_realtor_update on public.buyer_request_realtor_matches
for update using (
  realtor_user_id = auth.uid()
  or public.is_platform_admin()
)
with check (
  realtor_user_id = auth.uid()
  or public.is_platform_admin()
);

create index if not exists buyer_requests_location_status_idx on public.buyer_requests(country, city, status, created_at desc);
create index if not exists buyer_requests_email_idx on public.buyer_requests(lower(email));
create index if not exists buyer_request_matches_realtor_status_idx on public.buyer_request_realtor_matches(realtor_user_id, status, created_at desc);
create index if not exists buyer_request_matches_request_idx on public.buyer_request_realtor_matches(buyer_request_id);
