import { calculatePhotographyPrice } from './pricing';

export interface PhotographerSearchInput {
  country: string;
  city?: string;
  radiusKm?: number;
  requiresDrone?: boolean;
}

export interface PhotographerResult {
  id: string;
  display_name: string;
  country: string;
  city: string;
  operating_radius_km: number;
  languages: string[];
  rating: number;
  completed_jobs: number;
  completed_luxury_jobs: number;
  verification_status: 'verified' | 'pending' | 'rejected';
  drone_available: boolean;
  average_delivery_days: number;
  base_price: number;
  distance_km: number;
  services: string[];
}

export const demoPhotographers: PhotographerResult[] = [
  {
    id: 'marbella-studio',
    display_name: 'Marbella Estate Studio',
    country: 'Spain',
    city: 'Marbella',
    operating_radius_km: 85,
    languages: ['en', 'es', 'nl'],
    rating: 4.96,
    completed_jobs: 142,
    completed_luxury_jobs: 118,
    verification_status: 'verified',
    drone_available: true,
    average_delivery_days: 3,
    base_price: 650,
    distance_km: 8,
    services: ['Interior photography', 'Exterior photography', 'Drone photography', 'Twilight/sunset photography', 'Video walkthrough']
  },
  {
    id: 'costa-lux-visuals',
    display_name: 'Costa Lux Visuals',
    country: 'Spain',
    city: 'Estepona',
    operating_radius_km: 70,
    languages: ['en', 'es'],
    rating: 4.91,
    completed_jobs: 96,
    completed_luxury_jobs: 74,
    verification_status: 'verified',
    drone_available: true,
    average_delivery_days: 4,
    base_price: 540,
    distance_km: 21,
    services: ['Interior photography', 'Exterior photography', 'Drone photography', '360 tour', 'Floorplan scan']
  },
  {
    id: 'monaco-light-house',
    display_name: 'Monaco Light House',
    country: 'France',
    city: 'Nice',
    operating_radius_km: 120,
    languages: ['fr', 'en'],
    rating: 4.88,
    completed_jobs: 81,
    completed_luxury_jobs: 69,
    verification_status: 'verified',
    drone_available: false,
    average_delivery_days: 2,
    base_price: 720,
    distance_km: 34,
    services: ['Interior photography', 'Exterior photography', 'Twilight/sunset photography', 'Video walkthrough']
  }
];

export function rankPhotographers(input: PhotographerSearchInput, photographers = demoPhotographers) {
  const country = input.country.toLowerCase();
  const city = input.city?.toLowerCase();

  return photographers
    .filter((photographer) => photographer.country.toLowerCase() === country || !country)
    .filter((photographer) => !city || photographer.city.toLowerCase().includes(city) || photographer.distance_km <= (input.radiusKm ?? photographer.operating_radius_km))
    .filter((photographer) => !input.requiresDrone || photographer.drone_available)
    .sort((a, b) => {
      const verifiedScore = Number(b.verification_status === 'verified') - Number(a.verification_status === 'verified');
      if (verifiedScore) return verifiedScore;
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (a.distance_km !== b.distance_km) return a.distance_km - b.distance_km;
      if (b.completed_luxury_jobs !== a.completed_luxury_jobs) return b.completed_luxury_jobs - a.completed_luxury_jobs;
      return a.average_delivery_days - b.average_delivery_days;
    })
    .slice(0, 10)
    .map((photographer) => ({
      ...photographer,
      pricing: calculatePhotographyPrice(photographer.base_price)
    }));
}
