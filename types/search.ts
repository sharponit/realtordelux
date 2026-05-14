export type ListingType = 'buy' | 'rent' | 'new_development';

export type PropertySearchSort =
  | 'relevance'
  | 'newest'
  | 'price_low_high'
  | 'price_high_low'
  | 'size_high_low'
  | 'distance';

export type PropertySearchFilters = {
  country?: string;
  region?: string;
  city?: string;
  listingType?: ListingType;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minSizeM2?: number;
  maxSizeM2?: number;
  amenities?: string[];
  lifestyleTags?: string[];
  verifiedOnly?: boolean;
  highlightedOnly?: boolean;
};

export type PropertySearchLocation = {
  lat?: number;
  lng?: number;
  radiusKm?: number;
};

export type PropertySearchPagination = {
  pageSize?: number;
  pageNumber?: number;
};

export type PropertySearchInput = {
  query?: string;
  filters?: PropertySearchFilters;
  location?: PropertySearchLocation;
  pagination?: PropertySearchPagination;
  sort?: PropertySearchSort;
};

export type PropertySearchResult = {
  id: string;
  title: string;
  description: string;
  country: string;
  region: string | null;
  city: string;
  district: string | null;
  address_public: string | null;
  property_type: string;
  listing_type: ListingType;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  interior_size_m2: number | null;
  plot_size_m2: number | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  lifestyle_tags: string[];
  architecture_style: string | null;
  investment_tags: string[];
  status: string;
  is_highlighted: boolean;
  is_verified: boolean;
  media_quality_score: number;
  image_url: string | null;
  published_at: string | null;
  total_count: number;
  distance_km: number | null;
  relevance_score: number;
};

export type PropertySearchResponse = {
  results: PropertySearchResult[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type SearchSuggestion = {
  label: string;
  type: 'country' | 'region' | 'city' | 'property_type' | 'amenity' | 'lifestyle_tag';
  value: string;
};
