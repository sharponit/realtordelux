-- Photographer access requests begin publicly, then move into Realtor review or Realtor signup.

create table if not exists public.photographer_realtor_requests (
  id uuid primary key default gen_random_uuid(),
  photographer_name text not null,
  photographer_email text not null,
  realtor_name text,
  realtor_email text not null,
  message text,
  status text not null default 'pending_realtor_signup',
  existing_realtor_user_id uuid references auth.users(id) on delete set null,
  invitation_id uuid references public.invitations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days'),
  constraint photographer_realtor_requests_status_check check (
    status in (
      'pending_realtor_review',
      'pending_realtor_signup',
      'approved',
      'rejected',
      'expired'
    )
  )
);

alter table if exists public.realtor_photographer_relationships
  add column if not exists photographer_request_id uuid references public.photographer_realtor_requests(id) on delete set null;

alter table public.photographer_realtor_requests enable row level security;

drop policy if exists photographer_requests_realtor_or_admin_read on public.photographer_realtor_requests;
create policy photographer_requests_realtor_or_admin_read on public.photographer_realtor_requests
for select using (
  existing_realtor_user_id = auth.uid()
  or photographer_email = (auth.jwt() ->> 'email')
  or public.is_platform_admin()
);

drop policy if exists photographer_requests_realtor_or_admin_update on public.photographer_realtor_requests;
create policy photographer_requests_realtor_or_admin_update on public.photographer_realtor_requests
for update using (
  existing_realtor_user_id = auth.uid()
  or public.is_platform_admin()
)
with check (
  existing_realtor_user_id = auth.uid()
  or public.is_platform_admin()
);

create index if not exists photographer_requests_realtor_email_idx
  on public.photographer_realtor_requests (lower(realtor_email));
create index if not exists photographer_requests_photographer_email_idx
  on public.photographer_realtor_requests (lower(photographer_email));
create index if not exists photographer_requests_realtor_status_idx
  on public.photographer_realtor_requests (existing_realtor_user_id, status);
create index if not exists photographer_requests_status_created_idx
  on public.photographer_realtor_requests (status, created_at desc);
do $$
begin
  if to_regclass('public.realtor_photographer_relationships') is not null then
    create index if not exists realtor_photographer_relationships_request_idx
      on public.realtor_photographer_relationships (photographer_request_id);
  end if;
end $$;
