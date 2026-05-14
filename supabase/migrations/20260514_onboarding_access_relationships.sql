-- Deterministic onboarding, multi-role access, public highlights, and relationship placeholders.

alter type public.user_role add value if not exists 'general';
alter type public.user_role add value if not exists 'renter';
alter type public.user_role add value if not exists 'investor';
alter type public.user_role add value if not exists 'photographer';

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null,
  is_primary boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.onboarding_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  assigned_roles public.user_role[] not null default '{}'::public.user_role[],
  status public.onboarding_status not null default 'in_progress',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role public.user_role not null,
  permission text not null,
  created_at timestamptz not null default now(),
  unique (role, permission)
);

create table if not exists public.organization_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  organization_type text not null,
  registration_number text,
  jurisdiction text,
  countries_served text[] not null default '{}',
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  invitation_type text not null,
  sender_user_id uuid references auth.users(id) on delete set null,
  recipient_user_id uuid references auth.users(id) on delete set null,
  recipient_email text,
  transaction_id uuid,
  property_id uuid,
  recommended_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  context jsonb not null default '{}'::jsonb,
  accepted_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invitations_supported_types check (
    invitation_type in (
      'realtor_to_seller',
      'realtor_lawyer_recommendation',
      'seller_lawyer_invitation',
      'seller_notary_invitation',
      'lawyer_notary_invitation',
      'realtor_photographer_invitation',
      'seller_photographer_invitation',
      'buyer_concierge_assignment'
    )
  )
);

create table if not exists public.property_highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  price_label text,
  image_url text,
  summary text,
  is_public boolean not null default true,
  display_order integer not null default 100,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.concierge_assignments (
  id uuid primary key default gen_random_uuid(),
  buyer_user_id uuid not null references auth.users(id) on delete cascade,
  concierge_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'placeholder',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_user_roles()
returns public.user_role[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(role), '{}'::public.user_role[])
  from public.user_roles
  where user_id = auth.uid()
    and status = 'active'
$$;

create or replace function public.has_role(target_role public.user_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select target_role = any(public.current_user_roles()) or public.is_platform_admin()
$$;

alter table public.user_roles enable row level security;
alter table public.onboarding_answers enable row level security;
alter table public.role_permissions enable row level security;
alter table public.organization_profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.property_highlights enable row level security;
alter table public.concierge_assignments enable row level security;

drop policy if exists user_roles_select_own_or_admin on public.user_roles;
create policy user_roles_select_own_or_admin on public.user_roles
for select using (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists user_roles_insert_own_or_admin on public.user_roles;
create policy user_roles_insert_own_or_admin on public.user_roles
for insert with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists user_roles_update_own_or_admin on public.user_roles;
create policy user_roles_update_own_or_admin on public.user_roles
for update using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists user_roles_delete_own_or_admin on public.user_roles;
create policy user_roles_delete_own_or_admin on public.user_roles
for delete using (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists onboarding_answers_own_or_admin on public.onboarding_answers;
create policy onboarding_answers_own_or_admin on public.onboarding_answers
for all using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists role_permissions_read_authenticated on public.role_permissions;
create policy role_permissions_read_authenticated on public.role_permissions
for select using (auth.uid() is not null);

drop policy if exists organization_profiles_owner_admin on public.organization_profiles;
create policy organization_profiles_owner_admin on public.organization_profiles
for all using (owner_user_id = auth.uid() or public.is_platform_admin())
with check (owner_user_id = auth.uid() or public.is_platform_admin());

drop policy if exists invitations_related_users on public.invitations;
create policy invitations_related_users on public.invitations
for select using (
  sender_user_id = auth.uid()
  or recipient_user_id = auth.uid()
  or recommended_user_id = auth.uid()
  or public.is_platform_admin()
);

drop policy if exists invitations_insert_authenticated on public.invitations;
create policy invitations_insert_authenticated on public.invitations
for insert with check (sender_user_id = auth.uid() or public.is_platform_admin());

drop policy if exists invitations_update_related on public.invitations;
create policy invitations_update_related on public.invitations
for update using (
  sender_user_id = auth.uid()
  or recipient_user_id = auth.uid()
  or public.is_platform_admin()
)
with check (
  sender_user_id = auth.uid()
  or recipient_user_id = auth.uid()
  or public.is_platform_admin()
);

drop policy if exists property_highlights_public_read on public.property_highlights;
create policy property_highlights_public_read on public.property_highlights
for select using (is_public = true or public.is_platform_admin() or created_by = auth.uid());

drop policy if exists property_highlights_admin_write on public.property_highlights;
create policy property_highlights_admin_write on public.property_highlights
for all using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists concierge_assignments_related on public.concierge_assignments;
create policy concierge_assignments_related on public.concierge_assignments
for select using (
  buyer_user_id = auth.uid()
  or concierge_user_id = auth.uid()
  or public.is_platform_admin()
);

drop policy if exists concierge_assignments_admin_write on public.concierge_assignments;
create policy concierge_assignments_admin_write on public.concierge_assignments
for all using (public.is_platform_admin())
with check (public.is_platform_admin());

create index if not exists user_roles_user_id_idx on public.user_roles(user_id);
create index if not exists onboarding_answers_user_id_idx on public.onboarding_answers(user_id);
create index if not exists invitations_sender_user_id_idx on public.invitations(sender_user_id);
create index if not exists invitations_recipient_user_id_idx on public.invitations(recipient_user_id);
create index if not exists property_highlights_public_order_idx on public.property_highlights(is_public, display_order);
create index if not exists concierge_assignments_buyer_user_id_idx on public.concierge_assignments(buyer_user_id);
