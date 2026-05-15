-- Role-based professional onboarding expansion.

alter type public.user_role add value if not exists 'developer';
alter type public.user_role add value if not exists 'property_manager';

create table if not exists public.professional_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null,
  organization_id uuid references public.organization_profiles(id) on delete set null,
  display_name text,
  company_name text,
  website text,
  languages text[] not null default '{}',
  service_regions text[] not null default '{}',
  specialties text[] not null default '{}',
  verification_status text not null default 'pending',
  onboarding_state text not null default 'started',
  profile_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.service_regions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  organization_id uuid references public.organization_profiles(id) on delete cascade,
  role public.user_role,
  country text not null,
  region text,
  city text,
  service_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.onboarding_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null,
  status text not null default 'in_progress',
  current_step text,
  verification_status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.realtor_photographer_relationships (
  id uuid primary key default gen_random_uuid(),
  realtor_user_id uuid not null references auth.users(id) on delete cascade,
  photographer_user_id uuid references auth.users(id) on delete cascade,
  photographer_email text,
  invitation_id uuid,
  photographer_request_id uuid references public.photographer_realtor_requests(id) on delete set null,
  relationship_status text not null default 'invited',
  quality_status text not null default 'pending_review',
  portfolio_approved boolean not null default false,
  quality_score numeric(5,2),
  preferred_partner boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint realtor_photographer_has_target check (photographer_user_id is not null or photographer_email is not null)
);

alter table public.professional_profiles enable row level security;
alter table public.service_regions enable row level security;
alter table public.onboarding_states enable row level security;
alter table public.realtor_photographer_relationships enable row level security;

drop policy if exists professional_profiles_own_or_admin on public.professional_profiles;
create policy professional_profiles_own_or_admin on public.professional_profiles
for all using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists service_regions_owner_org_admin on public.service_regions;
create policy service_regions_owner_org_admin on public.service_regions
for all using (
  user_id = auth.uid()
  or public.is_platform_admin()
  or exists (
    select 1 from public.organization_profiles op
    where op.id = service_regions.organization_id
      and op.owner_user_id = auth.uid()
  )
)
with check (
  user_id = auth.uid()
  or public.is_platform_admin()
  or exists (
    select 1 from public.organization_profiles op
    where op.id = service_regions.organization_id
      and op.owner_user_id = auth.uid()
  )
);

drop policy if exists onboarding_states_own_or_admin on public.onboarding_states;
create policy onboarding_states_own_or_admin on public.onboarding_states
for all using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists realtor_photographer_relationships_related on public.realtor_photographer_relationships;
create policy realtor_photographer_relationships_related on public.realtor_photographer_relationships
for select using (
  realtor_user_id = auth.uid()
  or photographer_user_id = auth.uid()
  or public.is_platform_admin()
);

drop policy if exists realtor_photographer_relationships_realtor_insert on public.realtor_photographer_relationships;
create policy realtor_photographer_relationships_realtor_insert on public.realtor_photographer_relationships
for insert with check (
  realtor_user_id = auth.uid()
  and public.has_role('realtor')
);

drop policy if exists realtor_photographer_relationships_realtor_update on public.realtor_photographer_relationships;
create policy realtor_photographer_relationships_realtor_update on public.realtor_photographer_relationships
for update using (
  realtor_user_id = auth.uid()
  or photographer_user_id = auth.uid()
  or public.is_platform_admin()
)
with check (
  realtor_user_id = auth.uid()
  or photographer_user_id = auth.uid()
  or public.is_platform_admin()
);

insert into public.role_permissions(role, permission)
values
  ('developer', 'developments:manage'),
  ('developer', 'projects:manage'),
  ('developer', 'investor_leads:read'),
  ('developer', 'media:manage'),
  ('property_manager', 'managed_properties:manage'),
  ('property_manager', 'maintenance:manage'),
  ('property_manager', 'tenants:manage'),
  ('property_manager', 'concierge:manage'),
  ('realtor', 'photographer_invitations:manage')
on conflict do nothing;

create index if not exists professional_profiles_user_role_idx on public.professional_profiles(user_id, role);
create index if not exists professional_profiles_role_verification_idx on public.professional_profiles(role, verification_status);
create index if not exists service_regions_lookup_idx on public.service_regions(role, country, region, city);
create index if not exists onboarding_states_user_role_idx on public.onboarding_states(user_id, role);
create index if not exists realtor_photographer_realtor_idx on public.realtor_photographer_relationships(realtor_user_id);
create index if not exists realtor_photographer_photographer_idx on public.realtor_photographer_relationships(photographer_user_id);
create index if not exists realtor_photographer_relationships_request_idx on public.realtor_photographer_relationships(photographer_request_id);
