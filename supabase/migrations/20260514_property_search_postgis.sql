-- Supabase/PostgreSQL property search foundation. No Elasticsearch dependency.

create extension if not exists postgis;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  country text not null,
  region text,
  city text not null,
  district text,
  address_public text,
  property_type text not null,
  listing_type text not null default 'buy',
  price numeric not null check (price >= 0),
  currency text not null default 'EUR',
  bedrooms integer,
  bathrooms integer,
  interior_size_m2 numeric,
  plot_size_m2 numeric,
  latitude double precision,
  longitude double precision,
  location geography(Point, 4326) generated always as (
    case
      when latitude is not null and longitude is not null
      then st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
      else null
    end
  ) stored,
  amenities text[] not null default '{}',
  lifestyle_tags text[] not null default '{}',
  architecture_style text,
  investment_tags text[] not null default '{}',
  status text not null default 'draft',
  is_highlighted boolean not null default false,
  is_verified boolean not null default false,
  media_quality_score integer not null default 80 check (media_quality_score between 0 and 100),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz
);

alter table public.properties add column if not exists description text not null default '';
alter table public.properties add column if not exists region text;
alter table public.properties add column if not exists district text;
alter table public.properties add column if not exists address_public text;
alter table public.properties add column if not exists property_type text not null default 'Villa';
alter table public.properties add column if not exists listing_type text not null default 'buy';
alter table public.properties add column if not exists currency text not null default 'EUR';
alter table public.properties add column if not exists bedrooms integer;
alter table public.properties add column if not exists bathrooms integer;
alter table public.properties add column if not exists interior_size_m2 numeric;
alter table public.properties add column if not exists plot_size_m2 numeric;
alter table public.properties add column if not exists latitude double precision;
alter table public.properties add column if not exists longitude double precision;
alter table public.properties add column if not exists location geography(Point, 4326) generated always as (
  case
    when latitude is not null and longitude is not null
    then st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
    else null
  end
) stored;
alter table public.properties add column if not exists amenities text[] not null default '{}';
alter table public.properties add column if not exists lifestyle_tags text[] not null default '{}';
alter table public.properties add column if not exists architecture_style text;
alter table public.properties add column if not exists investment_tags text[] not null default '{}';
alter table public.properties add column if not exists status text not null default 'draft';
alter table public.properties add column if not exists is_highlighted boolean not null default false;
alter table public.properties add column if not exists is_verified boolean not null default false;
alter table public.properties add column if not exists media_quality_score integer not null default 80;
alter table public.properties add column if not exists image_url text;
alter table public.properties add column if not exists published_at timestamptz;
alter table public.properties add column if not exists deleted_at timestamptz;

alter table public.properties
  drop column if exists search_vector;

alter table public.properties
  add column search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(city, '') || ' ' || coalesce(region, '') || ' ' || coalesce(country, '') || ' ' || coalesce(property_type, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(district, '') || ' ' || coalesce(architecture_style, '') || ' ' || array_to_string(lifestyle_tags, ' ') || ' ' || array_to_string(investment_tags, ' ')), 'B') ||
    setweight(to_tsvector('english', array_to_string(amenities, ' ') || ' ' || coalesce(description, '')), 'C')
  ) stored;

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  query text,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.search_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  query text,
  filters jsonb not null default '{}'::jsonb,
  result_count integer not null default 0,
  clicked_property_id uuid references public.properties(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists properties_search_vector_gin_idx on public.properties using gin(search_vector);
create index if not exists properties_location_gist_idx on public.properties using gist(location);
create index if not exists properties_status_published_idx on public.properties(status, published_at desc) where deleted_at is null;
create index if not exists properties_listing_type_idx on public.properties(listing_type);
create index if not exists properties_country_region_city_idx on public.properties(country, region, city);
create index if not exists properties_property_type_idx on public.properties(property_type);
create index if not exists properties_price_idx on public.properties(price);
create index if not exists properties_bedrooms_bathrooms_idx on public.properties(bedrooms, bathrooms);
create index if not exists properties_interior_size_idx on public.properties(interior_size_m2);
create index if not exists properties_highlight_verified_idx on public.properties(is_highlighted, is_verified);
create index if not exists properties_amenities_gin_idx on public.properties using gin(amenities);
create index if not exists properties_lifestyle_tags_gin_idx on public.properties using gin(lifestyle_tags);
create index if not exists saved_searches_user_id_idx on public.saved_searches(user_id);
create index if not exists search_events_created_at_idx on public.search_events(created_at desc);
create index if not exists search_events_user_id_idx on public.search_events(user_id);

alter table public.properties enable row level security;
alter table public.saved_searches enable row level security;
alter table public.search_events enable row level security;

drop policy if exists properties_public_published_read on public.properties;
create policy properties_public_published_read on public.properties
for select using (
  deleted_at is null
  and status = 'published'
  and published_at is not null
  and published_at <= now()
);

drop policy if exists properties_admin_write on public.properties;
create policy properties_admin_write on public.properties
for all using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists saved_searches_own on public.saved_searches;
create policy saved_searches_own on public.saved_searches
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists search_events_insert_public on public.search_events;
create policy search_events_insert_public on public.search_events
for insert with check (user_id is null or user_id = auth.uid());

drop policy if exists search_events_select_own_or_admin on public.search_events;
create policy search_events_select_own_or_admin on public.search_events
for select using (user_id = auth.uid() or public.is_platform_admin());

create or replace function public.search_properties(
  search_query text,
  filter_country text default null,
  filter_city text default null,
  filter_region text default null,
  filter_listing_type text default null,
  filter_property_type text default null,
  min_price numeric default null,
  max_price numeric default null,
  min_bedrooms int default null,
  min_bathrooms int default null,
  min_size_m2 numeric default null,
  max_size_m2 numeric default null,
  required_amenities text[] default null,
  required_lifestyle_tags text[] default null,
  only_verified boolean default false,
  only_highlighted boolean default false,
  center_lat double precision default null,
  center_lng double precision default null,
  radius_km double precision default null,
  sort_by text default 'relevance',
  page_size int default 24,
  page_number int default 1
)
returns table (
  id uuid,
  title text,
  description text,
  country text,
  region text,
  city text,
  district text,
  address_public text,
  property_type text,
  listing_type text,
  price numeric,
  currency text,
  bedrooms int,
  bathrooms int,
  interior_size_m2 numeric,
  plot_size_m2 numeric,
  latitude double precision,
  longitude double precision,
  amenities text[],
  lifestyle_tags text[],
  architecture_style text,
  investment_tags text[],
  status text,
  is_highlighted boolean,
  is_verified boolean,
  media_quality_score int,
  image_url text,
  published_at timestamptz,
  total_count bigint,
  distance_km double precision,
  relevance_score double precision
)
language sql
stable
security definer
set search_path = public
as $$
  with params as (
    select
      case
        when nullif(trim(search_query), '') is null then null
        else websearch_to_tsquery('english', search_query)
      end as query_tree,
      case
        when center_lat is not null and center_lng is not null
        then st_setsrid(st_makepoint(center_lng, center_lat), 4326)::geography
        else null
      end as center_point,
      greatest(1, least(coalesce(page_size, 24), 60)) as safe_page_size,
      greatest(1, coalesce(page_number, 1)) as safe_page_number
  ),
  ranked as (
    select
      p.*,
      case
        when params.center_point is not null and p.location is not null
        then st_distance(p.location, params.center_point) / 1000.0
        else null
      end as computed_distance_km,
      (
        case when params.query_tree is null then 0 else ts_rank(p.search_vector, params.query_tree) end
        + case when p.is_verified then 0.20 else 0 end
        + case when p.is_highlighted then 0.18 else 0 end
        + least(p.media_quality_score, 100) / 1000.0
        + case when p.published_at > now() - interval '45 days' then 0.08 else 0 end
        + case when filter_city is not null and p.city ilike filter_city then 0.12 else 0 end
        + case when filter_region is not null and p.region ilike filter_region then 0.10 else 0 end
        + case when filter_country is not null and p.country ilike filter_country then 0.08 else 0 end
        + case when filter_property_type is not null and p.property_type ilike filter_property_type then 0.08 else 0 end
      )::double precision as computed_relevance_score
    from public.properties p
    cross join params
    where p.deleted_at is null
      and p.status = 'published'
      and p.published_at is not null
      and p.published_at <= now()
      and (params.query_tree is null or p.search_vector @@ params.query_tree)
      and (filter_country is null or p.country ilike filter_country)
      and (filter_city is null or p.city ilike filter_city)
      and (filter_region is null or p.region ilike filter_region)
      and (filter_listing_type is null or p.listing_type = filter_listing_type)
      and (filter_property_type is null or p.property_type ilike filter_property_type)
      and (min_price is null or p.price >= min_price)
      and (max_price is null or p.price <= max_price)
      and (min_bedrooms is null or p.bedrooms >= min_bedrooms)
      and (min_bathrooms is null or p.bathrooms >= min_bathrooms)
      and (min_size_m2 is null or p.interior_size_m2 >= min_size_m2)
      and (max_size_m2 is null or p.interior_size_m2 <= max_size_m2)
      and (required_amenities is null or p.amenities @> required_amenities)
      and (required_lifestyle_tags is null or p.lifestyle_tags @> required_lifestyle_tags)
      and (only_verified = false or p.is_verified = true)
      and (only_highlighted = false or p.is_highlighted = true)
      and (
        params.center_point is null
        or radius_km is null
        or (p.location is not null and st_dwithin(p.location, params.center_point, radius_km * 1000.0))
      )
  ),
  counted as (
    select ranked.*, count(*) over() as total_count
    from ranked
  )
  select
    counted.id,
    counted.title,
    counted.description,
    counted.country,
    counted.region,
    counted.city,
    counted.district,
    counted.address_public,
    counted.property_type,
    counted.listing_type,
    counted.price,
    counted.currency,
    counted.bedrooms,
    counted.bathrooms,
    counted.interior_size_m2,
    counted.plot_size_m2,
    counted.latitude,
    counted.longitude,
    counted.amenities,
    counted.lifestyle_tags,
    counted.architecture_style,
    counted.investment_tags,
    counted.status,
    counted.is_highlighted,
    counted.is_verified,
    counted.media_quality_score,
    counted.image_url,
    counted.published_at,
    counted.total_count,
    counted.computed_distance_km,
    counted.computed_relevance_score
  from counted
  cross join params
  order by
    case when sort_by = 'distance' then counted.computed_distance_km end asc nulls last,
    case when sort_by = 'newest' then counted.published_at end desc nulls last,
    case when sort_by = 'price_low_high' then counted.price end asc nulls last,
    case when sort_by = 'price_high_low' then counted.price end desc nulls last,
    case when sort_by = 'size_high_low' then counted.interior_size_m2 end desc nulls last,
    counted.computed_relevance_score desc,
    counted.published_at desc nulls last
  limit (select safe_page_size from params)
  offset ((select safe_page_number from params) - 1) * (select safe_page_size from params);
$$;

create or replace function public.search_suggestions(query text, limit_count int default 8)
returns table (
  label text,
  type text,
  value text
)
language sql
stable
security definer
set search_path = public
as $$
  with candidates as (
    select distinct country as label, 'country'::text as type, country as value
    from public.properties
    where status = 'published' and deleted_at is null and country ilike '%' || query || '%'
    union
    select distinct region, 'region', region
    from public.properties
    where status = 'published' and deleted_at is null and region is not null and region ilike '%' || query || '%'
    union
    select distinct city, 'city', city
    from public.properties
    where status = 'published' and deleted_at is null and city ilike '%' || query || '%'
    union
    select distinct property_type, 'property_type', property_type
    from public.properties
    where status = 'published' and deleted_at is null and property_type ilike '%' || query || '%'
    union
    select distinct amenity, 'amenity', amenity
    from public.properties p, unnest(p.amenities) amenity
    where p.status = 'published' and p.deleted_at is null and amenity ilike '%' || query || '%'
    union
    select distinct tag, 'lifestyle_tag', tag
    from public.properties p, unnest(p.lifestyle_tags) tag
    where p.status = 'published' and p.deleted_at is null and tag ilike '%' || query || '%'
  )
  select candidates.label, candidates.type, candidates.value
  from candidates
  order by label
  limit greatest(1, least(coalesce(limit_count, 8), 20));
$$;
