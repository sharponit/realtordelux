import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getDemoSearchSuggestions, searchDemoProperties } from '@/lib/search/demoPropertySearch';
import type {
  ListingType,
  PropertySearchInput,
  PropertySearchResponse,
  PropertySearchResult,
  SearchSuggestion
} from '@/types/search';

type SupabaseMode = 'server' | 'browser';

async function getClient(_mode: SupabaseMode) {
  return createSupabaseBrowserClient();
}

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

// Search backend boundary. Future OpenSearch, Typesense, Meilisearch, vector search,
// or AI semantic search adapters should preserve this function contract.
export async function searchProperties(
  input: PropertySearchInput,
  mode: SupabaseMode = 'browser'
): Promise<PropertySearchResponse> {
  if (!hasSupabaseConfig()) {
    return searchDemoProperties(input);
  }

  const pageSize = input.pagination?.pageSize || 24;
  const pageNumber = input.pagination?.pageNumber || 1;
  const filters = input.filters || {};
  const location = input.location || {};
  const supabase = (await getClient(mode)) as any;

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

export async function getSearchSuggestions(query: string, mode: SupabaseMode = 'browser') {
  if (!hasSupabaseConfig() || query.trim().length < 2) {
    return getDemoSearchSuggestions(query);
  }

  const supabase = (await getClient(mode)) as any;
  const { data, error } = await supabase.rpc('search_suggestions', {
    query,
    limit_count: 8
  });

  if (error) {
    return getDemoSearchSuggestions(query);
  }

  return (data || []) as SearchSuggestion[];
}

export async function saveSearch(input: PropertySearchInput, name: string) {
  const supabase = createSupabaseBrowserClient() as any;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { requiresLogin: true };
  }

  const { error } = await supabase.from('saved_searches').insert({
    user_id: user.id,
    name,
    query: input.query || '',
    filters: input.filters || {}
  });

  if (error) {
    throw new Error(error.message);
  }

  return { requiresLogin: false };
}

export async function trackSearchEvent(input: PropertySearchInput, resultCount: number, clickedPropertyId?: string) {
  if (!hasSupabaseConfig()) {
    return;
  }

  const supabase = createSupabaseBrowserClient() as any;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from('search_events').insert({
    user_id: user?.id || null,
    query: input.query || '',
    filters: input.filters || {},
    result_count: resultCount,
    clicked_property_id: clickedPropertyId || null
  });
}
