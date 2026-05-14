import Link from 'next/link';
import { PageShell, Panel } from '@/components/layout/SiteChrome';
import { properties } from '@/lib/mock/data';

const filters = [
  'Country',
  'City',
  'Budget',
  'Bedrooms',
  'Property type',
  'Sea view',
  'Golf access',
  'Smart home',
  'Pool',
  'Remote purchase ready'
];

export default function Search() {
  return (
    <PageShell
      eyebrow="Private Property Search"
      title="Curated homes matched to lifestyle, privacy, and investment goals."
      description="Explore premium listings through the same quiet, editorial Viyra experience used by buyers, advisors, and international transaction teams."
    >
      <Panel className="mb-8 p-6">
        <div className="grid gap-3 md:grid-cols-5">
          {filters.map((filter) => (
            <button
              className="border border-black/10 bg-porcelain px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-taupe transition hover:border-gold hover:text-black"
              key={filter}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </Panel>

      <section className="grid gap-6 md:grid-cols-2">
        {properties.map((property) => (
          <Panel className="overflow-hidden" key={property.id}>
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85"
                alt={property.title}
                className="h-full min-h-64 w-full object-cover"
              />
              <div className="p-7">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  AI Match {property.aiMatch}%
                </p>
                <h2 className="font-display text-3xl">{property.title}</h2>
                <p className="mt-3 text-sm text-taupe">
                  {property.city}, {property.country}
                </p>
                <p className="mt-5 text-2xl font-semibold">EUR{property.price.toLocaleString()}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <span className="bg-ivory px-3 py-2 text-xs text-taupe" key={feature.name}>
                      {feature.name}: {String(feature.value)}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/property/${property.id}`}
                  className="mt-7 inline-flex border border-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-gold"
                >
                  View Details
                </Link>
              </div>
            </div>
          </Panel>
        ))}
      </section>
    </PageShell>
  );
}
