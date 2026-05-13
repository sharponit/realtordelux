-- Viyra authentication, roles, firms, onboarding, and verification foundation.

do $$ begin
  create type public.user_role as enum (
    'buyer',
    'seller',
    'realtor',
    'lawyer',
    'notary',
    'firm_owner',
    'firm_admin',
    'admin',
    'super_admin'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.onboarding_status as enum (
    'not_started',
    'in_progress',
    'pending_verification',
    'complete'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role public.user_role not null default 'buyer',
  onboarding_status public.onboarding_status not null default 'not_started',
  preferred_language text not null default 'en',
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists user_id uuid unique references auth.users(id) on delete cascade;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists onboarding_status public.onboarding_status not null default 'not_started';
alter table public.profiles add column if not exists preferred_language text not null default 'en';
alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  registration_number text,
  chamber_of_commerce_country text,
  chamber_of_commerce_id text,
  vat_number text,
  firm_type text not null default 'mixed_services',
  address text,
  city text,
  country text,
  website text,
  verification_status text not null default 'pending',
  subscription_status text not null default 'trial',
  license_seats integer not null default 1 check (license_seats > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.firm_users (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_in_firm text not null,
  platform_role public.user_role not null,
  status text not null default 'invited',
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (firm_id, user_id)
);

create table if not exists public.professional_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  firm_id uuid references public.firms(id) on delete cascade,
  profession_type text not null,
  country text not null,
  registry_source text not null,
  registry_number text,
  verification_status text not null default 'pending',
  verification_payload jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  plan_name text not null,
  billing_provider text not null default 'stripe',
  license_seats integer not null default 1 check (license_seats > 0),
  active_users integer not null default 0 check (active_users >= 0),
  status text not null default 'trialing',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions add column if not exists firm_id uuid references public.firms(id) on delete cascade;
alter table public.subscriptions add column if not exists plan_name text;
alter table public.subscriptions add column if not exists billing_provider text not null default 'stripe';
alter table public.subscriptions add column if not exists license_seats integer not null default 1 check (license_seats > 0);
alter table public.subscriptions add column if not exists active_users integer not null default 0 check (active_users >= 0);
alter table public.subscriptions add column if not exists current_period_start timestamptz;
alter table public.subscriptions add column if not exists current_period_end timestamptz;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role::public.user_role from public.profiles where user_id = auth.uid() limit 1
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'super_admin'), false)
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'super_admin', false)
$$;

create or replace function public.is_firm_manager(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.firm_users fu
    where fu.firm_id = target_firm_id
      and fu.user_id = auth.uid()
      and fu.status = 'active'
      and fu.platform_role in ('firm_owner', 'firm_admin')
  ) or public.is_platform_admin()
$$;

create or replace function public.active_firm_user_count(target_firm_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer from public.firm_users where firm_id = target_firm_id and status = 'active'
$$;

create or replace function public.enforce_firm_license_seats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  seats integer;
  active_count integer;
begin
  if new.status = 'active' then
    select license_seats into seats from public.firms where id = new.firm_id;
    select public.active_firm_user_count(new.firm_id) into active_count;

    if tg_op = 'INSERT' then
      active_count := active_count + 1;
    end if;

    if active_count > seats and not public.is_super_admin() then
      raise exception 'Firm license seats exceeded. Upgrade subscription before activating another user.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_firm_license_seats on public.firm_users;
create trigger enforce_firm_license_seats
before insert or update on public.firm_users
for each row execute function public.enforce_firm_license_seats();

alter table public.profiles enable row level security;
alter table public.firms enable row level security;
alter table public.firm_users enable row level security;
alter table public.professional_verifications enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles
for select using (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
for insert with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin on public.profiles
for update using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists firms_select_member_or_admin on public.firms;
create policy firms_select_member_or_admin on public.firms
for select using (
  public.is_platform_admin()
  or exists (select 1 from public.firm_users fu where fu.firm_id = id and fu.user_id = auth.uid())
);

drop policy if exists firms_insert_owner_or_admin on public.firms;
create policy firms_insert_owner_or_admin on public.firms
for insert with check (auth.uid() is not null or public.is_platform_admin());

drop policy if exists firms_update_manager_or_admin on public.firms;
create policy firms_update_manager_or_admin on public.firms
for update using (public.is_firm_manager(id))
with check (public.is_firm_manager(id));

drop policy if exists firm_users_select_self_manager_admin on public.firm_users;
create policy firm_users_select_self_manager_admin on public.firm_users
for select using (user_id = auth.uid() or public.is_firm_manager(firm_id));

drop policy if exists firm_users_insert_manager_admin on public.firm_users;
create policy firm_users_insert_manager_admin on public.firm_users
for insert with check (public.is_firm_manager(firm_id) or user_id = auth.uid());

drop policy if exists firm_users_update_manager_admin on public.firm_users;
create policy firm_users_update_manager_admin on public.firm_users
for update using (public.is_firm_manager(firm_id))
with check (public.is_firm_manager(firm_id));

drop policy if exists verifications_select_owner_firm_admin on public.professional_verifications;
create policy verifications_select_owner_firm_admin on public.professional_verifications
for select using (
  user_id = auth.uid()
  or (firm_id is not null and public.is_firm_manager(firm_id))
  or public.is_platform_admin()
);

drop policy if exists verifications_insert_owner_or_manager on public.professional_verifications;
create policy verifications_insert_owner_or_manager on public.professional_verifications
for insert with check (
  user_id = auth.uid()
  or (firm_id is not null and public.is_firm_manager(firm_id))
  or public.is_platform_admin()
);

drop policy if exists subscriptions_select_firm_manager_admin on public.subscriptions;
create policy subscriptions_select_firm_manager_admin on public.subscriptions
for select using (public.is_firm_manager(firm_id));

drop policy if exists subscriptions_update_admin_only on public.subscriptions;
create policy subscriptions_update_admin_only on public.subscriptions
for update using (public.is_platform_admin())
with check (public.is_platform_admin());

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists firm_users_firm_id_idx on public.firm_users(firm_id);
create index if not exists firm_users_user_id_idx on public.firm_users(user_id);
create index if not exists professional_verifications_user_id_idx on public.professional_verifications(user_id);
create index if not exists professional_verifications_firm_id_idx on public.professional_verifications(firm_id);
