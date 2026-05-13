import { notFound } from 'next/navigation';
import { PricingBreakdown } from '@/components/photography/PricingBreakdown';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';
import { demoPhotographers } from '@/lib/photography/search';

export default async function PhotographerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOnboardedProfile();
  const { id } = await params;
  const photographer = demoPhotographers.find((item) => item.id === id);

  if (!photographer) notFound();

  return (
    <ProtectedShell eyebrow="Photographer Profile" profile={profile} title={photographer.display_name}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Luxury property photography
          </p>
          <dl className="grid gap-4 text-sm text-taupe md:grid-cols-2">
            <div><dt>Country</dt><dd className="font-semibold text-black">{photographer.country}</dd></div>
            <div><dt>City</dt><dd className="font-semibold text-black">{photographer.city}</dd></div>
            <div><dt>Operating radius</dt><dd className="font-semibold text-black">{photographer.operating_radius_km} km</dd></div>
            <div><dt>Languages</dt><dd className="font-semibold text-black">{photographer.languages.join(', ')}</dd></div>
            <div><dt>Drone availability</dt><dd className="font-semibold text-black">{photographer.drone_available ? 'Yes, certification required' : 'No'}</dd></div>
            <div><dt>Average delivery</dt><dd className="font-semibold text-black">{photographer.average_delivery_days} days</dd></div>
            <div><dt>Rating</dt><dd className="font-semibold text-black">{photographer.rating}</dd></div>
            <div><dt>Completed luxury jobs</dt><dd className="font-semibold text-black">{photographer.completed_luxury_jobs}</dd></div>
          </dl>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {photographer.services.map((service) => (
              <span className="border border-black/10 bg-porcelain px-4 py-3 text-sm text-taupe" key={service}>
                {service}
              </span>
            ))}
          </div>
        </section>
        <aside className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Transparent pricing
          </p>
          <PricingBreakdown photographerPrice={photographer.base_price} />
          <p className="mt-5 text-sm leading-7 text-taupe">
            Portfolio images, equipment list, certification uploads, review history, and private
            availability windows are ready for Supabase-backed data.
          </p>
        </aside>
      </div>
    </ProtectedShell>
  );
}
