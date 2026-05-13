import Link from 'next/link';
import type { Route } from 'next';
import { rankPhotographers, type PhotographerSearchInput } from '@/lib/photography/search';
import { PricingBreakdown } from './PricingBreakdown';

export function PhotographerCards({ search }: { search: PhotographerSearchInput }) {
  const photographers = rankPhotographers(search);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {photographers.map((photographer, index) => (
        <article className="border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(23,23,23,0.06)]" key={photographer.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                Top {index + 1} regional match
              </p>
              <h2 className="font-display mt-3 text-3xl">{photographer.display_name}</h2>
              <p className="mt-2 text-sm text-taupe">{photographer.city}, {photographer.country}</p>
            </div>
            <span className="border border-gold/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
              {photographer.verification_status}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-taupe">
            <p>Rating <strong className="text-black">{photographer.rating}</strong></p>
            <p>Distance <strong className="text-black">{photographer.distance_km} km</strong></p>
            <p>Luxury jobs <strong className="text-black">{photographer.completed_luxury_jobs}</strong></p>
            <p>Delivery <strong className="text-black">{photographer.average_delivery_days} days</strong></p>
            <p>Drone <strong className="text-black">{photographer.drone_available ? 'Available' : 'Not listed'}</strong></p>
            <p>Radius <strong className="text-black">{photographer.operating_radius_km} km</strong></p>
          </div>

          <div className="mt-5">
            <PricingBreakdown photographerPrice={photographer.base_price} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {photographer.services.slice(0, 4).map((service) => (
              <span className="bg-porcelain px-3 py-2 text-xs text-taupe" key={service}>{service}</span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Link className="flex-1 bg-black px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white" href={`/photographers/${photographer.id}` as Route}>
              View profile
            </Link>
            <Link className="flex-1 border border-gold px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-gold" href={`/photography/assign?photographer=${photographer.id}` as Route}>
              Assign
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
