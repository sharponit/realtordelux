-- Residency opportunity alerts, rule management, and immigration lawyer review workflow.

create table if not exists public.residency_rules (
  id text primary key,
  country text not null,
  country_code text not null,
  pathway_key text not null,
  pathway_name text not null,
  status text not null default 'draft' check (status in ('active', 'draft', 'paused')),
  min_property_value numeric not null default 0 check (min_property_value >= 0),
  currency text not null default 'EUR',
  eligible_nationalities text[] not null default '{}',
  excluded_nationalities text[] not null default '{}',
  buyer_profile_requirements jsonb not null default '{}'::jsonb,
  summary text not null,
  multilingual_content jsonb not null default '{}'::jsonb,
  disclaimer text not null default 'This is not legal advice. Eligibility must be verified by a qualified immigration lawyer.',
  luxury_markets text[] not null default '{}',
  managed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.residency_opportunity_interests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid,
  country text not null,
  residency_pathway text not null,
  rule_id text references public.residency_rules(id),
  action_source text not null check (action_source in ('view', 'save', 'offer', 'purchase', 'manual_review')),
  buyer_nationality text,
  buyer_profile jsonb not null default '{}'::jsonb,
  status text not null default 'informational_alert' check (status in ('informational_alert', 'review_requested', 'assigned', 'closed')),
  assigned_lawyer_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.residency_lawyer_review_requests (
  id uuid primary key default gen_random_uuid(),
  interest_id uuid not null references public.residency_opportunity_interests(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete cascade,
  assigned_lawyer_id uuid references auth.users(id),
  country text not null,
  residency_pathway text not null,
  message text,
  status text not null default 'pending_lawyer_assignment' check (status in ('pending_lawyer_assignment', 'assigned', 'in_review', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.residency_rules enable row level security;
alter table public.residency_opportunity_interests enable row level security;
alter table public.residency_lawyer_review_requests enable row level security;

drop policy if exists residency_rules_read_active_or_admin_legal on public.residency_rules;
create policy residency_rules_read_active_or_admin_legal on public.residency_rules
for select using (
  status = 'active'
  or public.is_platform_admin()
  or public.current_user_role() = 'lawyer'
);

drop policy if exists residency_rules_manage_admin_legal on public.residency_rules;
create policy residency_rules_manage_admin_legal on public.residency_rules
for all using (
  public.is_platform_admin()
  or public.current_user_role() = 'lawyer'
)
with check (
  public.is_platform_admin()
  or public.current_user_role() = 'lawyer'
);

drop policy if exists residency_interests_select_buyer_lawyer_admin on public.residency_opportunity_interests;
create policy residency_interests_select_buyer_lawyer_admin on public.residency_opportunity_interests
for select using (
  buyer_id = auth.uid()
  or assigned_lawyer_id = auth.uid()
  or public.current_user_role() = 'lawyer'
  or public.is_platform_admin()
);

drop policy if exists residency_interests_insert_buyer on public.residency_opportunity_interests;
create policy residency_interests_insert_buyer on public.residency_opportunity_interests
for insert with check (buyer_id = auth.uid() or public.is_platform_admin());

drop policy if exists residency_interests_update_lawyer_admin on public.residency_opportunity_interests;
create policy residency_interests_update_lawyer_admin on public.residency_opportunity_interests
for update using (
  buyer_id = auth.uid()
  or assigned_lawyer_id = auth.uid()
  or public.current_user_role() = 'lawyer'
  or public.is_platform_admin()
)
with check (
  buyer_id = auth.uid()
  or assigned_lawyer_id = auth.uid()
  or public.current_user_role() = 'lawyer'
  or public.is_platform_admin()
);

drop policy if exists residency_reviews_select_parties_admin on public.residency_lawyer_review_requests;
create policy residency_reviews_select_parties_admin on public.residency_lawyer_review_requests
for select using (
  requested_by = auth.uid()
  or assigned_lawyer_id = auth.uid()
  or public.current_user_role() = 'lawyer'
  or public.is_platform_admin()
);

drop policy if exists residency_reviews_insert_buyer on public.residency_lawyer_review_requests;
create policy residency_reviews_insert_buyer on public.residency_lawyer_review_requests
for insert with check (requested_by = auth.uid() or public.is_platform_admin());

drop policy if exists residency_reviews_update_lawyer_admin on public.residency_lawyer_review_requests;
create policy residency_reviews_update_lawyer_admin on public.residency_lawyer_review_requests
for update using (
  assigned_lawyer_id = auth.uid()
  or public.current_user_role() = 'lawyer'
  or public.is_platform_admin()
)
with check (
  assigned_lawyer_id = auth.uid()
  or public.current_user_role() = 'lawyer'
  or public.is_platform_admin()
);

insert into public.residency_rules (
  id,
  country,
  country_code,
  pathway_key,
  pathway_name,
  status,
  min_property_value,
  currency,
  excluded_nationalities,
  summary,
  multilingual_content,
  luxury_markets
) values (
  'spain-golden-visa-transition',
  'Spain',
  'ES',
  'spain_residency_legal_review',
  'Spain Residency Legal Review',
  'active',
  500000,
  'EUR',
  array['Spain'],
  'Spanish luxury property may create immigration, relocation, or tax residency planning questions that should be reviewed before offer or completion.',
  '{"en":{"pathwayName":"Spain Residency Legal Review","summary":"This property may justify a qualified review of Spanish residency, relocation, or tax residency options."},"es":{"pathwayName":"Revision legal de residencia en Espana","summary":"Esta propiedad puede justificar una revision cualificada de opciones de residencia, reubicacion o residencia fiscal en Espana."},"fr":{"pathwayName":"Revue juridique de residence en Espagne","summary":"Ce bien peut justifier une analyse qualifiee des options de residence, relocation ou residence fiscale en Espagne."}}'::jsonb,
  array['Marbella','Madrid','Barcelona','Mallorca','Ibiza']
) on conflict (id) do update set
  status = excluded.status,
  min_property_value = excluded.min_property_value,
  summary = excluded.summary,
  multilingual_content = excluded.multilingual_content,
  updated_at = now();

create index if not exists residency_rules_country_status_idx on public.residency_rules(country, status);
create index if not exists residency_interests_buyer_idx on public.residency_opportunity_interests(buyer_id);
create index if not exists residency_interests_property_idx on public.residency_opportunity_interests(property_id);
create index if not exists residency_reviews_requested_by_idx on public.residency_lawyer_review_requests(requested_by);
create index if not exists residency_reviews_assigned_lawyer_idx on public.residency_lawyer_review_requests(assigned_lawyer_id);
