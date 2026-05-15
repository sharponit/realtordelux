import { createSupabaseServerClient } from '@/lib/supabase/server';
import { searchDemoProperties } from '@/lib/search/demoPropertySearch';
import type { ListingType, PropertySearchInput, PropertySearchResponse, PropertySearchResult } from '@/types/search';

function normalizeArray(value?: string[]) {
  return value?.length ? value : null;
}

function normalizeNumber(value?: number) {
  return Number.isFinite(value) ? value : null;
}

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function normalizeListingType(value?: ListingType) {
  return value === 'sale' ? 'sale' : value || null;
}

export async function searchPropertiesServer(input: PropertySearchInput): Promise<PropertySearchResponse> {
  const pageSize = input.pagination?.pageSize || 24;
  const pageNumber = input.pagination?.pageNumber || 1;

  if (!hasSupabaseConfig()) {
    return searchDemoProperties(input);
  }

  const filters = input.filters || {};
  const location = input.location || {};
  const supabase = (await createSupabaseServerClient()) as any;
  const { data, error } = await supabase.rpc('search_properties', {
    search_query: input.query || null,
    filter_country: filters.country || null,
    filter_city: filters.city || null,
    filter_region: filters.region || null,
    filter_listing_type: normalizeListingType(filters.listingType),
    filter_property_type: filters.propertyType || null,
    min_price: normalizeNumber(filters.minPrice),
    max_price: normalizeNumber(filters.maxPrice),
    min_bedrooms: normalizeNumber(filters.minBedrooms),
    min_bathrooms: normalizeNumber(filters.minBathrooms),
    min_size_m2: normalizeNumber(filters.minSizeM2),
    max_size_m2: normalizeNumber(filters.maxSizeM2),
    required_amenities: normalizeArray(filters.amenities),
    required_lifestyle_tags: normalizeArray(filters.lifestyleTags),
    only_verified: filters.verifiedOnly || false,
    only_highlighted: filters.highlightedOnly || false,
    center_lat: normalizeNumber(location.lat),
    center_lng: normalizeNumber(location.lng),
    radius_km: normalizeNumber(location.radiusKm),
    sort_by: input.sort || 'relevance',
    page_size: pageSize,
    page_number: pageNumber
  });

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Viyra property search RPC failed, using demo search fallback:', error.message);
    }
    return searchDemoProperties(input);
  }

  const results = (data || []) as PropertySearchResult[];

  return {
    results,
    totalCount: results[0]?.total_count || 0,
    pageNumber,
    pageSize
  };
}
