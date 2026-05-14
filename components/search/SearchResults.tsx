'use client';

import Link from 'next/link';
import type { PropertySearchResult } from '@/types/search';

export function SearchResults({
  results,
  isLoading,
  error,
  onPropertyClick
}: {
  results: PropertySearchResult[];
  isLoading: boolean;
  error?: string;
  onPropertyClick: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-80 animate-pulse bg-white shadow-[0_18px_55px_rgba(23,23,23,0.06)]" key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="border border-gold/30 bg-gold/10 p-7 text-sm text-black">{error}</div>;
  }

  if (!results.length) {
    return (
      <div className="border border-black/10 bg-white p-10 text-center">
        <h2 className="font-display text-3xl">No matching residences yet.</h2>
        <p className="mt-3 text-sm leading-7 text-taupe">
          Try a broader region, fewer filters, or a lifestyle term such as sea view, golf front, or wellness spa.
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {results.map((property) => (
        <article className="overflow-hidden border border-black/10 bg-white shadow-[0_18px_55px_rgba(23,23,23,0.06)]" key={property.id}>
          <img
            alt={property.title}
            className="h-64 w-full object-cover"
            src={property.image_url || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'}
          />
          <div className="p-7">
            <div className="mb-3 flex flex-wrap gap-2">
              {property.is_verified ? <Badge>Verified</Badge> : null}
              {property.is_highlighted ? <Badge>Highlighted</Badge> : null}
              <Badge>{property.listing_type.replace('_', ' ')}</Badge>
            </div>
            <h2 className="font-display text-3xl">{property.title}</h2>
            <p className="mt-2 text-sm text-taupe">
              {property.city}, {property.region || property.country}
              {property.distance_km ? ` - ${property.distance_km.toFixed(1)} km` : ''}
            </p>
            <p className="mt-5 text-2xl font-semibold">
              {property.currency}{Number(property.price).toLocaleString()}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-taupe">
              <span>{property.bedrooms || 0} beds</span>
              <span>{property.bathrooms || 0} baths</span>
              <span>{Number(property.interior_size_m2 || 0).toLocaleString()} m2</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {property.lifestyle_tags.slice(0, 4).map((tag) => (
                <span className="bg-ivory px-3 py-2 text-xs text-taupe" key={tag}>{tag}</span>
              ))}
            </div>
            <Link
              className="mt-7 inline-flex border border-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-gold"
              href={`/property/${property.id}`}
              onClick={() => onPropertyClick(property.id)}
            >
              View Details
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}

function Badge({ children }: { children: string }) {
  return <span className="border border-gold/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-gold">{children}</span>;
}
