-- Photographer role, regional search, booking, pricing, uploads, and admin controls.

alter type public.user_role add value if not exists 'photographer';

do $$ begin
  create type public.photography_job_status as enum (
    'draft',
    'invited',
    'pending_acceptance',
    'accepted',
    'scheduled',
    'completed',
    'delivered',
    'approved',
    'rejected',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.photographer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  display_name text not null,
  profile_photo_url text,
  country text not null,
  city text not null,
  operating_region text,
  operating_radius_km integer not null default 50 check (operating_radius_km > 0),
  languages text[] not null default '{}',
  phone text,
  email text,
  website text,
  social_links jsonb not null default '{}'::jsonb,
  portfolio_images text[] not null default '{}',
  drone_available boolean not null default false,
  drone_certification_url text,
  equipment_list text[] not null default '{}',
  real_estate_experience text,
  luxury_experience_years integer not null default 0 check (luxury_experience_years >= 0),
  average_delivery_days integer not null default 3 check (average_delivery_days > 0),
  services text[] not null default array[
    'Interior photography',
    'Exterior photography'
  ],
  base_price numeric(12,2) not null default 0 check (base_price >= 0),
  add_on_prices jsonb not null default '{}'::jsonb,
  rating numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  completed_jobs integer not null default 0 check (completed_jobs >= 0),
  completed_luxury_jobs integer not null default 0 check (completed_luxury_jobs >= 0),
  verification_status text not null default 'pending',
  active_status text not null default 'active',
  viyra_service_fee_rate numeric(5,4) not null default 0.03,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photographer_pricing (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  interior_price numeric(12,2) not null default 0,
  exterior_price numeric(12,2) not null default 0,
  drone_price numeric(12,2) not null default 0,
  twilight_price numeric(12,2) not null default 0,
  video_walkthrough_price numeric(12,2) not null default 0,
  tour_360_price numeric(12,2) not null default 0,
  floorplan_scan_price numeric(12,2) not null default 0,
  viyra_service_fee_rate numeric(5,4) not null default 0.03,
  calculated_service_fee numeric(12,2) not null default 0,
  calculated_customer_total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photographer_portfolios (
  id uuid primary key default gen_random_uuid(),
  photographer_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  image_url text not null,
  category text,
  property_style text,
  country text,
  city text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.photography_jobs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  requested_by uuid not null references auth.users(id) on delete cascade,
  photographer_id uuid references auth.users(id) on delete set null,
  property_address text,
  property_city text,
  property_region text,
  property_country text,
  requested_shoot_date timestamptz,
  service_package text[] not null default '{}',
  requires_drone boolean not null default false,
  photographer_price numeric(12,2) not null default 0,
  viyra_service_fee numeric(12,2) not null default 0,
  customer_total numeric(12,2) not null default 0,
  status public.photography_job_status not null default 'draft',
  payment_status text not null default 'unpaid',
  stripe_payment_intent_id text,
  payout_status text not null default 'not_started',
  photographer_payout_amount numeric(12,2) not null default 0,
  platform_fee_amount numeric(12,2) not null default 0,
  service_fee_rate_override numeric(5,4),
  admin_price_override numeric(12,2),
  admin_override_by uuid references auth.users(id),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photography_job_invites (
  id uuid primary key default gen_random_uuid(),
  photography_job_id uuid references public.photography_jobs(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  invited_by uuid not null references auth.users(id) on delete cascade,
  photographer_name text not null,
  photographer_email text not null,
  photographer_phone text,
  notes text,
  status text not null default 'invited',
  accepted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create table if not exists public.photography_uploads (
  id uuid primary key default gen_random_uuid(),
  photography_job_id uuid not null references public.photography_jobs(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  storage_bucket text not null default 'photography-deliveries',
  storage_path text not null,
  file_name text not null,
  file_type text not null,
  photo_category text,
  upload_status text not null default 'uploaded',
  image_count integer not null default 1,
  below_minimum_warning boolean not null default false,
  admin_override_minimum boolean not null default false,
  ai_score numeric(5,2),
  ai_selected boolean not null default false,
  ai_category text,
  sharpness_score numeric(5,2),
  brightness_score numeric(5,2),
  luxury_score numeric(5,2),
  room_detected text,
  image_orientation text,
  publication_status text not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photography_reviews (
  id uuid primary key default gen_random_uuid(),
  photography_job_id uuid references public.photography_jobs(id) on delete cascade,
  photographer_id uuid not null references auth.users(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now()
);

create or replace function public.is_photography_job_participant(target_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.photography_jobs job
    where job.id = target_job_id
      and (job.requested_by = auth.uid() or job.photographer_id = auth.uid())
  ) or public.is_platform_admin()
$$;

alter table public.photographer_profiles enable row level security;
alter table public.photographer_pricing enable row level security;
alter table public.photographer_portfolios enable row level security;
alter table public.photography_jobs enable row level security;
alter table public.photography_job_invites enable row level security;
alter table public.photography_uploads enable row level security;
alter table public.photography_reviews enable row level security;

drop policy if exists photographer_profiles_select_active on public.photographer_profiles;
create policy photographer_profiles_select_active on public.photographer_profiles
for select using (active_status = 'active' or user_id = auth.uid() or public.is_platform_admin());

drop policy if exists photographer_profiles_write_own_admin on public.photographer_profiles;
create policy photographer_profiles_write_own_admin on public.photographer_profiles
for all using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists photographer_pricing_select on public.photographer_pricing;
create policy photographer_pricing_select on public.photographer_pricing
for select using (
  user_id = auth.uid()
  or public.is_platform_admin()
  or exists (select 1 from public.photographer_profiles pp where pp.user_id = photographer_pricing.user_id and pp.active_status = 'active')
);

drop policy if exists photographer_pricing_write_own_admin on public.photographer_pricing;
create policy photographer_pricing_write_own_admin on public.photographer_pricing
for all using (user_id = auth.uid() or public.is_platform_admin())
with check (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists photographer_portfolios_select_active on public.photographer_portfolios;
create policy photographer_portfolios_select_active on public.photographer_portfolios
for select using (
  public.is_platform_admin()
  or photographer_user_id = auth.uid()
  or exists (select 1 from public.photographer_profiles pp where pp.user_id = photographer_user_id and pp.active_status = 'active')
);

drop policy if exists photographer_portfolios_write_own_admin on public.photographer_portfolios;
create policy photographer_portfolios_write_own_admin on public.photographer_portfolios
for all using (photographer_user_id = auth.uid() or public.is_platform_admin())
with check (photographer_user_id = auth.uid() or public.is_platform_admin());

drop policy if exists photography_jobs_select_participants_admin on public.photography_jobs;
create policy photography_jobs_select_participants_admin on public.photography_jobs
for select using (requested_by = auth.uid() or photographer_id = auth.uid() or public.is_platform_admin());

drop policy if exists photography_jobs_insert_requester on public.photography_jobs;
create policy photography_jobs_insert_requester on public.photography_jobs
for insert with check (
  requested_by = auth.uid()
  and public.current_user_role() in ('seller', 'realtor', 'admin', 'super_admin')
);

drop policy if exists photography_jobs_update_participants_admin on public.photography_jobs;
create policy photography_jobs_update_participants_admin on public.photography_jobs
for update using (requested_by = auth.uid() or photographer_id = auth.uid() or public.is_platform_admin())
with check (requested_by = auth.uid() or photographer_id = auth.uid() or public.is_platform_admin());

drop policy if exists photography_invites_select_participants_admin on public.photography_job_invites;
create policy photography_invites_select_participants_admin on public.photography_job_invites
for select using (invited_by = auth.uid() or accepted_by = auth.uid() or public.is_platform_admin());

drop policy if exists photography_invites_insert_requester on public.photography_job_invites;
create policy photography_invites_insert_requester on public.photography_job_invites
for insert with check (invited_by = auth.uid() or public.is_platform_admin());

drop policy if exists photography_uploads_select_participants_admin on public.photography_uploads;
create policy photography_uploads_select_participants_admin on public.photography_uploads
for select using (public.is_photography_job_participant(photography_job_id));

drop policy if exists photography_uploads_insert_photographer_admin on public.photography_uploads;
create policy photography_uploads_insert_photographer_admin on public.photography_uploads
for insert with check (
  uploaded_by = auth.uid()
  and public.is_photography_job_participant(photography_job_id)
);

drop policy if exists photography_uploads_update_participants_admin on public.photography_uploads;
create policy photography_uploads_update_participants_admin on public.photography_uploads
for update using (public.is_photography_job_participant(photography_job_id))
with check (public.is_photography_job_participant(photography_job_id));

drop policy if exists photography_reviews_select_public_active on public.photography_reviews;
create policy photography_reviews_select_public_active on public.photography_reviews
for select using (true);

drop policy if exists photography_reviews_insert_participant on public.photography_reviews;
create policy photography_reviews_insert_participant on public.photography_reviews
for insert with check (reviewer_id = auth.uid() and public.is_photography_job_participant(photography_job_id));

create index if not exists photographer_profiles_location_idx on public.photographer_profiles(country, city);
create index if not exists photographer_profiles_rating_idx on public.photographer_profiles(verification_status, rating desc, completed_luxury_jobs desc);
create index if not exists photography_jobs_requested_by_idx on public.photography_jobs(requested_by);
create index if not exists photography_jobs_photographer_idx on public.photography_jobs(photographer_id);
create index if not exists photography_uploads_job_idx on public.photography_uploads(photography_job_id);
