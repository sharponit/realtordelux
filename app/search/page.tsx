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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const initialQuery = firstParam(params?.q) || '';
  const initialFilters: PropertySearchFilters = {
    listingType: normalizeListingType(firstParam(params?.listing_type)),
    city: firstParam(params?.city),
    country: firstParam(params?.country),
    highlightedOnly: firstParam(params?.highlighted) === 'true'
  };

  return <PropertySearchExperience initialFilters={initialFilters} initialQuery={initialQuery} />;
}
