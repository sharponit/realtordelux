import { PropertySearchExperience } from '@/components/search/PropertySearchExperience';
import type { ListingType, PropertySearchFilters } from '@/types/search';

type SearchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeListingType(value: string | undefined): ListingType | undefined {
  if (value === 'sale') {
    return 'buy';
  }

  if (value === 'buy' || value === 'rent' || value === 'new_development') {
    return value;
  }

  return undefined;
}

function numericParam(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeLifestyle(value: string | undefined) {
  const lifestyleMap: Record<string, string> = {
    'Sea View': 'Sea view',
    Beachfront: 'Beachfront',
    'Golf Front': 'Golf front',
    'Gated Community': 'Gated community',
    'Private Pool': 'Pool',
    'Smart Home': 'Smart home',
    'Golden Visa Eligible': 'Golden visa eligible',
    'Crypto Accepted': 'Crypto accepted',
    'High Rental Yield': 'High rental yield',
    'Privacy Focused': 'Privacy focused'
  };

  return value ? lifestyleMap[value] || value : undefined;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const initialQuery = firstParam(params?.q) || '';
  const lifestyle = normalizeLifestyle(firstParam(params?.lifestyle));
  const initialFilters: PropertySearchFilters = {
    listingType: normalizeListingType(firstParam(params?.listing_type)),
    city: firstParam(params?.city),
    region: firstParam(params?.region),
    country: firstParam(params?.country),
    propertyType: firstParam(params?.property_type),
    minPrice: numericParam(firstParam(params?.min_price)),
    maxPrice: numericParam(firstParam(params?.max_price)),
    lifestyleTags: lifestyle ? [lifestyle] : undefined,
    highlightedOnly: firstParam(params?.highlighted) === 'true'
  };

  return <PropertySearchExperience initialFilters={initialFilters} initialQuery={initialQuery} />;
}
