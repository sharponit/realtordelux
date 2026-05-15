import type {
  PropertySearchInput,
  PropertySearchResponse,
  PropertySearchResult,
  SearchSuggestion
} from '@/types/search';

const locations = [
  ['Spain', 'Andalusia', 'Marbella', 'Golden Mile', 36.5101, -4.8824],
  ['Spain', 'Andalusia', 'Benahavis', 'La Zagaleta', 36.5238, -5.0465],
  ['Spain', 'Andalusia', 'Estepona', 'New Golden Mile', 36.4276, -5.1459],
  ['Spain', 'Balearic Islands', 'Ibiza', 'Santa Eularia', 38.9846, 1.5341],
  ['Spain', 'Community of Madrid', 'Madrid', 'Salamanca', 40.4306, -3.6807],
  ['Spain', 'Catalonia', 'Barcelona', 'Pedralbes', 41.3907, 2.1128],
  ['UAE', 'Dubai', 'Dubai', 'Palm Jumeirah', 25.1124, 55.139],
  ['UAE', 'Dubai', 'Dubai Hills', 'Dubai Hills Estate', 25.1095, 55.2477],
  ['UAE', 'Dubai', 'Emirates Hills', 'Sector E', 25.0708, 55.1677],
  ['UAE', 'Abu Dhabi', 'Abu Dhabi', 'Saadiyat Island', 24.5431, 54.4388],
  ['Morocco', 'Dakhla-Oued Ed-Dahab', 'Dakhla', 'Lagoon', 23.6848, -15.9579],
  ['Morocco', 'Casablanca-Settat', 'Casablanca', 'Anfa', 33.5928, -7.6721],
  ['Morocco', 'Rabat-Sale-Kenitra', 'Rabat', 'Souissi', 33.9716, -6.8498],
  ['Morocco', 'Marrakech-Safi', 'Marrakech', 'Palmeraie', 31.6768, -7.957],
  ['Morocco', 'Tangier-Tetouan-Al Hoceima', 'Tangier', 'Malabata', 35.7806, -5.7897],
  ['Portugal', 'Lisbon', 'Lisbon', 'Chiado', 38.7106, -9.1425],
  ['Portugal', 'Algarve', 'Algarve', 'Quinta do Lago', 37.0438, -8.0196],
  ['Portugal', 'Porto', 'Porto', 'Foz do Douro', 41.1512, -8.6747],
  ['France', "Provence-Alpes-Cote d'Azur", 'Cannes', 'Californie', 43.5624, 7.0358],
  ['France', 'Monaco Region', 'Roquebrune-Cap-Martin', 'Cap Martin', 43.7608, 7.4728],
  ['France', "Provence-Alpes-Cote d'Azur", 'Saint-Tropez', 'Les Parcs', 43.2677, 6.6407],
  ['USA', 'Florida', 'Miami', 'Miami Beach', 25.7907, -80.13],
  ['United Kingdom', 'England', 'London', 'Mayfair', 51.509, -0.1476],
  ['Turkey', 'Istanbul', 'Istanbul', 'Bebek', 41.077, 29.043],
  ['Indonesia', 'Bali', 'Bali', 'Canggu', -8.65, 115.138]
] as const;

const propertyTypes = [
  'Villa',
  'Mansion',
  'Penthouse',
  'Beachfront Home',
  'Golf Estate',
  'Apartment',
  'Smart Luxury Home',
  'New Development',
  'Investment Property',
  'Boutique Hotel',
  'Private Compound'
];

const lifestyleSets = [
  ['Sea view', 'Beachfront', 'Marina nearby', 'Designer furnished'],
  ['Golf front', 'Gated community', 'Privacy focused', 'Family compound'],
  ['Smart home', 'Wellness spa', 'Home cinema', 'Remote work friendly'],
  ['Crypto accepted', 'Golden visa eligible', 'High rental yield', 'Investment opportunity'],
  ['Islamic finance compatible', 'Staff quarters', 'New construction', 'Rooftop terrace']
];

const amenitySets = [
  ['Pool', 'Spa', 'Gym', 'Cinema', 'Garage', 'Security'],
  ['Private dock', 'Chef kitchen', 'Elevator', 'Wine room', 'Concierge desk'],
  ['Wellness pavilion', 'Padel court', 'Smart lighting', 'Outdoor kitchen', 'Guest house'],
  ['Rooftop pool', 'Private lift', 'Valet parking', 'Business lounge', 'Kids club']
];

const images = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85'
];

const prices = [
  250000, 500000, 950000, 1250000, 1800000, 3000000, 4750000, 6500000, 8500000, 10000000,
  14500000, 18000000, 25000000, 32000000
];

const architectureStyles = [
  'Contemporary Mediterranean',
  'Modern Andalusian',
  'Desert contemporary',
  'Minimalist coastal',
  'Art deco revival',
  'Boutique riad modern',
  'Classic Haussmann-inspired',
  'Ultra-modern glass pavilion'
];

function uuidFor(index: number) {
  return `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
}

function norm(value: string | null | undefined) {
  return (value || '').trim().toLowerCase();
}

function includesIgnoreCase(values: string[], required: string[]) {
  const normalizedValues = values.map(norm);
  return required.every((item) => normalizedValues.includes(norm(item)));
}

function textFor(property: PropertySearchResult) {
  return [
    property.title,
    property.description,
    property.country,
    property.region,
    property.city,
    property.district,
    property.property_type,
    property.architecture_style,
    ...property.amenities,
    ...property.lifestyle_tags,
    ...property.investment_tags
  ].join(' ').toLowerCase();
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function buildProperty(index: number): PropertySearchResult {
  const [country, region, city, district, lat, lng] = locations[index % locations.length];
  const propertyType = propertyTypes[index % propertyTypes.length];
  const lifestyleTags = lifestyleSets[index % lifestyleSets.length];
  const amenities = amenitySets[index % amenitySets.length];
  const listingType = index !== 0 && index % 9 === 0 ? 'rent' : index !== 0 && index % 5 === 0 ? 'new_development' : 'sale';
  const price = prices[index % prices.length] * (country === 'UAE' ? 1.15 : country === 'France' ? 1.35 : 1);
  const bedrooms = propertyType === 'Investment Property' || propertyType === 'Boutique Hotel' ? 12 + (index % 16) : 2 + (index % 8);
  const bathrooms = Math.max(2, bedrooms - 1);
  const interior = 120 + (index % 12) * 85 + (propertyType.includes('Villa') || propertyType.includes('Mansion') ? 320 : 0);
  const plot = propertyType.includes('Apartment') || propertyType.includes('Penthouse') ? 0 : interior * (2 + (index % 5));
  const titlePrefix = lifestyleTags[0].replace('Sea view', 'Sea-View');
  const title = `${titlePrefix} ${propertyType} in ${city}`;
  const latitude = Number((lat + (index % 7) * 0.006).toFixed(6));
  const longitude = Number((lng + (index % 5) * 0.006).toFixed(6));

  return {
    id: uuidFor(index),
    title,
    description: `${title} positioned in ${district}, ${city}, with refined interiors, discreet arrival, generous entertaining areas, and a calm luxury profile suited to international buyers, family offices, and private investors. The residence is prepared for concierge-led viewings and structured cross-border due diligence.`,
    country,
    region,
    city,
    district,
    address_public: `${district}, ${city}`,
    property_type: propertyType,
    listing_type: listingType,
    price: Math.round(price),
    currency: country === 'UAE' ? 'AED' : country === 'USA' ? 'USD' : country === 'United Kingdom' ? 'GBP' : 'EUR',
    bedrooms,
    bathrooms,
    interior_size_m2: interior,
    plot_size_m2: plot,
    latitude,
    longitude,
    amenities,
    lifestyle_tags: lifestyleTags,
    architecture_style: architectureStyles[index % architectureStyles.length],
    investment_tags: [
      index % 2 === 0 ? 'High rental yield' : 'Capital appreciation',
      index % 3 === 0 ? 'Golden visa eligible' : 'Prime lifestyle asset',
      index % 4 === 0 ? 'Crypto accepted' : 'International buyer ready'
    ],
    status: 'published',
    is_highlighted: index % 4 === 0,
    is_verified: index % 3 !== 0,
    media_quality_score: 78 + (index % 22),
    image_url: images[index % images.length],
    published_at: new Date(Date.UTC(2026, 3, 1 + (index % 40), 10, 0, 0)).toISOString(),
    total_count: 0,
    distance_km: null,
    relevance_score: 0
  };
}

export const demoProperties = Array.from({ length: 50 }, (_, index) => buildProperty(index));

export function searchDemoProperties(input: PropertySearchInput): PropertySearchResponse {
  const filters = input.filters || {};
  const location = input.location || {};
  const pageSize = input.pagination?.pageSize || 24;
  const pageNumber = input.pagination?.pageNumber || 1;
  const terms = norm(input.query).split(/\s+/).filter(Boolean);
  const minPrice = filters.minPrice ?? Number.NEGATIVE_INFINITY;
  const maxPrice = filters.maxPrice ?? Number.POSITIVE_INFINITY;

  const matches = demoProperties
    .map((property) => {
      const propertyText = textFor(property);
      const distance = location.lat && location.lng && property.latitude && property.longitude
        ? distanceKm(location.lat, location.lng, property.latitude, property.longitude)
        : null;
      const queryMatches = terms.length === 0 || terms.every((term) => propertyText.includes(term));
      const passes =
        queryMatches &&
        (!filters.country || norm(property.country) === norm(filters.country)) &&
        (!filters.city || norm(property.city) === norm(filters.city)) &&
        (!filters.region || norm(property.region) === norm(filters.region)) &&
        (!filters.listingType || property.listing_type === filters.listingType) &&
        (!filters.propertyType || norm(property.property_type) === norm(filters.propertyType)) &&
        property.price >= minPrice &&
        property.price <= maxPrice &&
        (!filters.minBedrooms || (property.bedrooms || 0) >= filters.minBedrooms) &&
        (!filters.minBathrooms || (property.bathrooms || 0) >= filters.minBathrooms) &&
        (!filters.minSizeM2 || (property.interior_size_m2 || 0) >= filters.minSizeM2) &&
        (!filters.maxSizeM2 || (property.interior_size_m2 || 0) <= filters.maxSizeM2) &&
        (!filters.verifiedOnly || property.is_verified) &&
        (!filters.highlightedOnly || property.is_highlighted) &&
        (!filters.amenities?.length || includesIgnoreCase(property.amenities, filters.amenities)) &&
        (!filters.lifestyleTags?.length || includesIgnoreCase(property.lifestyle_tags, filters.lifestyleTags)) &&
        (!location.radiusKm || distance === null || distance <= location.radiusKm);

      return {
        property: {
          ...property,
          distance_km: distance,
          relevance_score:
            (terms.length ? terms.filter((term) => propertyText.includes(term)).length : 0) +
            (property.is_verified ? 0.2 : 0) +
            (property.is_highlighted ? 0.18 : 0) +
            property.media_quality_score / 1000
        },
        passes
      };
    })
    .filter((item) => item.passes)
    .map((item) => item.property);

  matches.sort((a, b) => {
    if (input.sort === 'newest') {
      return String(b.published_at).localeCompare(String(a.published_at));
    }
    if (input.sort === 'price_low_high') {
      return a.price - b.price;
    }
    if (input.sort === 'price_high_low') {
      return b.price - a.price;
    }
    if (input.sort === 'size_high_low') {
      return (b.interior_size_m2 || 0) - (a.interior_size_m2 || 0);
    }
    if (input.sort === 'distance') {
      return (a.distance_km ?? Number.POSITIVE_INFINITY) - (b.distance_km ?? Number.POSITIVE_INFINITY);
    }
    return b.relevance_score - a.relevance_score || String(b.published_at).localeCompare(String(a.published_at));
  });

  const totalCount = matches.length;
  const start = (pageNumber - 1) * pageSize;
  const results = matches.slice(start, start + pageSize).map((property) => ({ ...property, total_count: totalCount }));

  return { results, totalCount, pageNumber, pageSize };
}

export function getDemoSearchSuggestions(query: string): SearchSuggestion[] {
  const q = norm(query);
  if (q.length < 2) {
    return [];
  }

  const candidates = new Map<string, SearchSuggestion>();
  const add = (label: string | null, type: SearchSuggestion['type']) => {
    if (!label || !norm(label).includes(q)) {
      return;
    }
    candidates.set(`${type}:${label}`, { label, type, value: label });
  };

  demoProperties.forEach((property) => {
    add(property.country, 'country');
    add(property.region, 'region');
    add(property.city, 'city');
    add(property.property_type, 'property_type');
    property.amenities.forEach((item) => add(item, 'amenity'));
    property.lifestyle_tags.forEach((item) => add(item, 'lifestyle_tag'));
  });

  return [...candidates.values()].sort((a, b) => a.label.localeCompare(b.label)).slice(0, 8);
}
