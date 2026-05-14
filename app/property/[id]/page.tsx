import { GoldButton, PageShell, Panel } from '@/components/layout/SiteChrome';
import { properties } from '@/lib/mock/data';

export default async function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = properties.find((item) => item.id === id) ?? properties[0];

  return (
    <PageShell
      eyebrow="Private Listing"
      title={property.title}
      description="A premium property view centered on lifestyle fit, legal readiness, and transaction confidence."
    >
      <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
            alt={property.title}
            className="h-[420px] w-full object-cover"
          />
          <div className="p-8">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              {property.city}, {property.country}
            </p>
            <h2 className="font-display text-4xl">EUR{property.price.toLocaleString()}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-taupe">
              Strong fit for a private international family lifestyle with remote purchase
              readiness, premium amenities, and a refined cross-border transaction workflow.
            </p>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="bg-[#171717] p-7 text-white">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Private Match Profile
            </p>
            <p className="font-display text-5xl text-gold">{property.aiMatch}</p>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Lifestyle, investment, legal readiness, and cultural preferences are refined after
              secure onboarding.
            </p>
          </Panel>
          <Panel className="p-7">
            <h2 className="font-display text-3xl">Nearby priorities</h2>
            <div className="mt-5 grid gap-3 text-sm text-taupe">
              <p>Airport: 35 minutes</p>
              <p>Schools: 12 minutes</p>
              <p>Marina, golf, and beach access available</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <GoldButton href="/transactions">Make Offer</GoldButton>
              <a
                className="inline-flex border border-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-gold"
                href="/login"
              >
                Request Concierge
              </a>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
