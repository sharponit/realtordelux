-- Realtor-to-seller invitation onboarding and permanent commission attribution.

do $$ begin
  create type public.invitation_status as enum ('pending', 'opened', 'accepted', 'expired', 'revoked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.representation_type as enum (
    'exclusive_listing',
    'co_listing',
    'referral_introduction',
    'buyer_side_introduction',
    'platform_assisted_listing'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_privacy_mode as enum ('public', 'qualified_buyers_only', 'off_market');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.seller_listing_onboarding_status as enum (
    'invited',
    'account_created',
    'documents_pending',
    'property_details_pending',
    'media_pending',
    'pending_realtor_review',
    'pending_legal_review',
    'ready_to_publish',
    'published'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.commission_status as enum ('draft', 'active', 'disputed', 'released', 'cancelled');
exception when duplicate_object then null;
end $$;

alter table public.properties add column if not exists seller_id uuid references auth.users(id) on delete set null;
alter table public.properties add column if not exists invited_by_realtor_id uuid references auth.users(id) on delete set null;
alter table public.properties add column if not exists brokerage_id uuid references public.firms(id) on delete set null;
alter table public.properties add column if not exists invitation_id uuid;
alter table public.properties add column if not exists address text;
alter table public.properties add column if not exists city text;
alter table public.properties add column if not exists country text;
alter table public.properties add column if not exists property_type text;
alter table public.properties add column if not exists listing_privacy_mode public.listing_privacy_mode default 'qualified_buyers_only';
alter table public.properties add column if not exists seller_onboarding_status public.seller_listing_onboarding_status default 'invited';
alter table public.properties add column if not exists attribution_source text;
alter table public.properties add column if not exists ownership_verified boolean not null default false;
alter table public.properties add column if not exists ai_metadata jsonb not null default '{}'::jsonb;

alter table public.notifications add column if not exists type text;
alter table public.notifications add column if not exists title text;
alter table public.notifications add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.notifications add column if not exists read_at timestamptz;

create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  status text not null default 'queued',
  to_email text,
  to_phone text,
  template text not null,
  subject text,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  listing_realtor_id uuid not null references auth.users(id) on delete restrict,
  brokerage_id uuid references public.firms(id) on delete set null,
  invitation_id uuid,
  privacy_mode public.listing_privacy_mode not null default 'qualified_buyers_only',
  status public.seller_listing_onboarding_status not null default 'pending_realtor_review',
  title text,
  description text,
  ai_metadata jsonb not null default '{}'::jsonb,
  missing_information jsonb not null default '{}'::jsonb,
  legal_review_requested_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seller_invitations (
  id uuid primary key default gen_random_uuid(),
  token_hash text unique not null,
  seller_full_name text not null,
  seller_email text not null,
  seller_phone text,
  property_address text not null,
  city text not null,
  country text not null,
  estimated_property_value numeric(14,2),
  property_type text,
  preferred_privacy_mode public.listing_privacy_mode not null default 'qualified_buyers_only',
  personal_message text,
  commission_model text not null default 'percentage',
  commission_percentage numeric(6,3) not null default 3,
  platform_fee_percentage numeric(6,3) not null default 0,
  representation_type public.representation_type not null default 'exclusive_listing',
  invited_by_realtor_id uuid not null references auth.users(id) on delete restrict,
  brokerage_id uuid references public.firms(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  listing_id uuid references public.property_listings(id) on delete set null,
  status public.invitation_status not null default 'pending',
  expires_at timestamptz not null default now() + interval '30 days',
  opened_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  resent_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties
  drop constraint if exists properties_invitation_id_fkey;
alter table public.properties
  add constraint properties_invitation_id_fkey
  foreign key (invitation_id) references public.seller_invitations(id) on delete set null;

alter table public.property_listings
  drop constraint if exists property_listings_invitation_id_fkey;
alter table public.property_listings
  add constraint property_listings_invitation_id_fkey
  foreign key (invitation_id) references public.seller_invitations(id) on delete set null;

create table if not exists public.seller_realtor_relationships (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  realtor_id uuid not null references auth.users(id) on delete restrict,
  brokerage_id uuid references public.firms(id) on delete set null,
  invitation_id uuid not null references public.seller_invitations(id) on delete restrict,
  representation_type public.representation_type not null,
  status text not null default 'active',
  accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (seller_id, realtor_id, invitation_id)
);

create table if not exists public.seller_property_onboardings (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.seller_invitations(id) on delete restrict,
  seller_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  listing_id uuid not null references public.property_listings(id) on delete cascade,
  ownership_name text not null,
  seller_type text not null default 'individual',
  title_deed_url text,
  identity_document_url text,
  company_document_url text,
  living_area_sqm numeric(12,2),
  plot_size_sqm numeric(12,2),
  bedrooms integer,
  bathrooms numeric(4,1),
  staff_rooms integer,
  garage_spaces integer,
  luxury_features text[] not null default '{}',
  amenity_flags jsonb not null default '{}'::jsonb,
  media_urls text[] not null default '{}',
  request_certified_photographer boolean not null default false,
  status public.seller_listing_onboarding_status not null default 'pending_realtor_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_attributions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  listing_id uuid references public.property_listings(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  listing_realtor_id uuid not null references auth.users(id) on delete restrict,
  buyer_realtor_id uuid references auth.users(id) on delete set null,
  referral_realtor_id uuid references auth.users(id) on delete set null,
  brokerage_id uuid references public.firms(id) on delete set null,
  invitation_id uuid not null references public.seller_invitations(id) on delete restrict,
  attribution_source text not null default 'seller_invitation',
  representation_type public.representation_type not null,
  status text not null default 'active',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.commission_attributions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  listing_id uuid references public.property_listings(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  listing_realtor_id uuid not null references auth.users(id) on delete restrict,
  buyer_realtor_id uuid references auth.users(id) on delete set null,
  referral_realtor_id uuid references auth.users(id) on delete set null,
  brokerage_id uuid references public.firms(id) on delete set null,
  commission_percentage numeric(6,3) not null,
  platform_fee_percentage numeric(6,3) not null default 0,
  attribution_source text not null default 'seller_invitation',
  invitation_id uuid not null references public.seller_invitations(id) on delete restrict,
  representation_type public.representation_type not null,
  status public.commission_status not null default 'draft',
  custom_split jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create table if not exists public.co_listing_agents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.property_listings(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  realtor_id uuid not null references auth.users(id) on delete restrict,
  brokerage_id uuid references public.firms(id) on delete set null,
  split_percentage numeric(6,3) not null default 0,
  status text not null default 'invited',
  created_at timestamptz not null default now()
);

create table if not exists public.referral_links (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references public.seller_invitations(id) on delete set null,
  property_id uuid references public.properties(id) on delete cascade,
  listing_id uuid references public.property_listings(id) on delete cascade,
  referral_realtor_id uuid not null references auth.users(id) on delete restrict,
  referred_to_realtor_id uuid references auth.users(id) on delete set null,
  referral_percentage numeric(6,3) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create or replace function public.is_brokerage_admin(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_firm_manager(target_firm_id)
$$;

create or replace function public.can_access_seller_invitation(target_invitation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.seller_invitations invitation
    where invitation.id = target_invitation_id
      and (
        invitation.invited_by_realtor_id = auth.uid()
        or invitation.accepted_by = auth.uid()
        or (invitation.brokerage_id is not null and public.is_brokerage_admin(invitation.brokerage_id))
        or public.is_platform_admin()
      )
  )
$$;

create or replace function public.can_access_property_attribution(target_property_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.property_attributions attribution
    where attribution.property_id = target_property_id
      and (
        attribution.seller_id = auth.uid()
        or attribution.listing_realtor_id = auth.uid()
        or attribution.buyer_realtor_id = auth.uid()
        or attribution.referral_realtor_id = auth.uid()
        or (attribution.brokerage_id is not null and public.is_brokerage_admin(attribution.brokerage_id))
        or public.is_platform_admin()
      )
  )
$$;

alter table public.seller_invitations enable row level security;
alter table public.property_listings enable row level security;
alter table public.seller_realtor_relationships enable row level security;
alter table public.seller_property_onboardings enable row level security;
alter table public.property_attributions enable row level security;
alter table public.commission_attributions enable row level security;
alter table public.co_listing_agents enable row level security;
alter table public.referral_links enable row level security;
alter table public.notification_events enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists seller_invitations_select_authorized on public.seller_invitations;
create policy seller_invitations_select_authorized on public.seller_invitations
for select using (public.can_access_seller_invitation(id));

drop policy if exists seller_invitations_insert_realtor on public.seller_invitations;
create policy seller_invitations_insert_realtor on public.seller_invitations
for insert with check (
  (invited_by_realtor_id = auth.uid() and public.current_user_role() in ('realtor', 'firm_owner', 'firm_admin', 'admin', 'super_admin'))
  or (brokerage_id is not null and public.is_brokerage_admin(brokerage_id))
  or public.is_platform_admin()
);

drop policy if exists seller_invitations_update_authorized on public.seller_invitations;
create policy seller_invitations_update_authorized on public.seller_invitations
for update using (public.can_access_seller_invitation(id))
with check (public.can_access_seller_invitation(id));

drop policy if exists property_listings_select_authorized on public.property_listings;
create policy property_listings_select_authorized on public.property_listings
for select using (
  seller_id = auth.uid()
  or listing_realtor_id = auth.uid()
  or (brokerage_id is not null and public.is_brokerage_admin(brokerage_id))
  or public.is_platform_admin()
);

drop policy if exists property_listings_write_authorized on public.property_listings;
create policy property_listings_write_authorized on public.property_listings
for all using (
  seller_id = auth.uid()
  or listing_realtor_id = auth.uid()
  or (brokerage_id is not null and public.is_brokerage_admin(brokerage_id))
  or public.is_platform_admin()
)
with check (
  seller_id = auth.uid()
  or listing_realtor_id = auth.uid()
  or (brokerage_id is not null and public.is_brokerage_admin(brokerage_id))
  or public.is_platform_admin()
);

drop policy if exists seller_relationships_select_authorized on public.seller_realtor_relationships;
create policy seller_relationships_select_authorized on public.seller_realtor_relationships
for select using (
  seller_id = auth.uid()
  or realtor_id = auth.uid()
  or (brokerage_id is not null and public.is_brokerage_admin(brokerage_id))
  or public.is_platform_admin()
);

drop policy if exists seller_relationships_insert_authorized on public.seller_realtor_relationships;
create policy seller_relationships_insert_authorized on public.seller_realtor_relationships
for insert with check (seller_id = auth.uid() or public.is_platform_admin());

drop policy if exists seller_onboarding_select_authorized on public.seller_property_onboardings;
create policy seller_onboarding_select_authorized on public.seller_property_onboardings
for select using (
  seller_id = auth.uid()
  or public.can_access_seller_invitation(invitation_id)
);

drop policy if exists seller_onboarding_write_seller on public.seller_property_onboardings;
create policy seller_onboarding_write_seller on public.seller_property_onboardings
for all using (seller_id = auth.uid() or public.can_access_seller_invitation(invitation_id))
with check (seller_id = auth.uid() or public.can_access_seller_invitation(invitation_id));

drop policy if exists property_attributions_select_authorized on public.property_attributions;
create policy property_attributions_select_authorized on public.property_attributions
for select using (public.can_access_property_attribution(property_id));

drop policy if exists property_attributions_insert_authorized on public.property_attributions;
create policy property_attributions_insert_authorized on public.property_attributions
for insert with check (seller_id = auth.uid() or listing_realtor_id = auth.uid() or public.is_platform_admin());

drop policy if exists commission_attributions_select_authorized on public.commission_attributions;
create policy commission_attributions_select_authorized on public.commission_attributions
for select using (public.can_access_property_attribution(property_id));

drop policy if exists commission_attributions_update_admin on public.commission_attributions;
create policy commission_attributions_update_admin on public.commission_attributions
for update using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists co_listing_agents_select_authorized on public.co_listing_agents;
create policy co_listing_agents_select_authorized on public.co_listing_agents
for select using (public.can_access_property_attribution(property_id) or realtor_id = auth.uid());

drop policy if exists referral_links_select_authorized on public.referral_links;
create policy referral_links_select_authorized on public.referral_links
for select using (public.can_access_property_attribution(property_id) or referral_realtor_id = auth.uid());

drop policy if exists notifications_select_own_admin on public.notifications;
create policy notifications_select_own_admin on public.notifications
for select using (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists notifications_insert_system on public.notifications;
create policy notifications_insert_system on public.notifications
for insert with check (auth.uid() is not null or public.is_platform_admin());

drop policy if exists notification_events_admin on public.notification_events;
create policy notification_events_admin on public.notification_events
for all using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists audit_logs_admin on public.audit_logs;
create policy audit_logs_admin on public.audit_logs
for select using (public.is_platform_admin());

create index if not exists seller_invitations_token_hash_idx on public.seller_invitations(token_hash);
create index if not exists seller_invitations_realtor_idx on public.seller_invitations(invited_by_realtor_id);
create index if not exists seller_invitations_brokerage_idx on public.seller_invitations(brokerage_id);
create index if not exists property_listings_property_idx on public.property_listings(property_id);
create index if not exists property_listings_realtor_idx on public.property_listings(listing_realtor_id);
create index if not exists property_attributions_property_idx on public.property_attributions(property_id);
create index if not exists commission_attributions_property_idx on public.commission_attributions(property_id);
create index if not exists seller_onboardings_invitation_idx on public.seller_property_onboardings(invitation_id);
