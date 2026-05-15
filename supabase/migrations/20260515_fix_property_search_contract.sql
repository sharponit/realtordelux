-- Keep the public search contract aligned with the frontend.
-- Canonical listing_type values are: sale, rent, new_development.

alter table public.properties
  alter column listing_type set default 'sale';

update public.properties
set listing_type = 'sale'
where listing_type = 'buy';

update public.properties
set listing_type = 'sale'
where id = '00000000-0000-4000-8000-000000000001';

update public.properties
set property_type = case
  when lower(property_type) = 'beachfront home' then 'Beachfront Home'
  when lower(property_type) = 'golf estate' then 'Golf Estate'
  when lower(property_type) = 'new development' then 'New Development'
  when lower(property_type) = 'private compound' then 'Private Compound'
  when lower(property_type) = 'investment building' then 'Investment Property'
  when lower(property_type) = 'smart luxury home' then 'Smart Luxury Home'
  when lower(property_type) = 'boutique hotel' then 'Boutique Hotel'
  else property_type
end
where property_type is not null;

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
      case
        when lower(nullif(filter_listing_type, '')) = 'buy' then 'sale'
        else lower(nullif(filter_listing_type, ''))
      end as normalized_listing_type,
      lower(nullif(filter_country, '')) as normalized_country,
      lower(nullif(filter_city, '')) as normalized_city,
      lower(nullif(filter_region, '')) as normalized_region,
      lower(nullif(filter_property_type, '')) as normalized_property_type,
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
        + case when params.normalized_city is not null and lower(p.city) = params.normalized_city then 0.12 else 0 end
        + case when params.normalized_region is not null and lower(p.region) = params.normalized_region then 0.10 else 0 end
        + case when params.normalized_country is not null and lower(p.country) = params.normalized_country then 0.08 else 0 end
        + case when params.normalized_property_type is not null and lower(p.property_type) = params.normalized_property_type then 0.08 else 0 end
      )::double precision as computed_relevance_score
    from public.properties p
    cross join params
    where p.deleted_at is null
      and p.status = 'published'
      and p.published_at is not null
      and p.published_at <= now()
      and (params.query_tree is null or p.search_vector @@ params.query_tree)
      and (params.normalized_country is null or lower(p.country) = params.normalized_country)
      and (params.normalized_city is null or lower(p.city) = params.normalized_city)
      and (params.normalized_region is null or lower(p.region) = params.normalized_region)
      and (
        params.normalized_listing_type is null
        or lower(p.listing_type) = params.normalized_listing_type
        or (params.normalized_listing_type = 'sale' and lower(p.listing_type) = 'buy')
      )
      and (params.normalized_property_type is null or lower(p.property_type) = params.normalized_property_type)
      and (min_price is null or p.price >= min_price)
      and (max_price is null or p.price <= max_price)
      and (min_bedrooms is null or p.bedrooms >= min_bedrooms)
      and (min_bathrooms is null or p.bathrooms >= min_bathrooms)
      and (min_size_m2 is null or p.interior_size_m2 >= min_size_m2)
      and (max_size_m2 is null or p.interior_size_m2 <= max_size_m2)
      and (
        required_amenities is null
        or not exists (
          select 1
          from unnest(required_amenities) required
          where not exists (
            select 1
            from unnest(p.amenities) amenity
            where lower(amenity) = lower(required)
          )
        )
      )
      and (
        required_lifestyle_tags is null
        or not exists (
          select 1
          from unnest(required_lifestyle_tags) required
          where not exists (
            select 1
            from unnest(p.lifestyle_tags) tag
            where lower(tag) = lower(required)
          )
        )
      )
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
    case when counted.listing_type = 'buy' then 'sale' else counted.listing_type end,
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

grant execute on function public.search_properties(
  text, text, text, text, text, text, numeric, numeric, int, int, numeric, numeric,
  text[], text[], boolean, boolean, double precision, double precision, double precision,
  text, int, int
) to anon, authenticated;

grant execute on function public.search_suggestions(text, int) to anon, authenticated;
