import { PricingBreakdown } from '@/components/photography/PricingBreakdown';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';

const statuses = ['draft', 'invited', 'pending_acceptance', 'accepted', 'scheduled', 'completed', 'delivered', 'approved'];

export default async function PhotographyJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOnboardedProfile();
  const { id } = await params;

  return (
    <ProtectedShell eyebrow="Photography Job" profile={profile} title={`Job ${id}`}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Assignment status
          </p>
          <div className="grid gap-3 md:grid-cols-4">
            {statuses.map((status) => (
              <span className="border border-black/10 bg-porcelain px-3 py-3 text-xs text-taupe" key={status}>
                {status.replaceAll('_', ' ')}
              </span>
            ))}
          </div>
          <dl className="mt-7 grid gap-4 text-sm text-taupe md:grid-cols-2">
            <div><dt>Property region</dt><dd className="font-semibold text-black">Marbella, Spain</dd></div>
            <div><dt>Requested shoot date</dt><dd className="font-semibold text-black">Pending schedule</dd></div>
            <div><dt>Service package</dt><dd className="font-semibold text-black">Interior, exterior, drone, twilight</dd></div>
            <div><dt>Payment status</dt><dd className="font-semibold text-black">Prepared for Stripe</dd></div>
          </dl>
        </section>
        <aside className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Customer price
          </p>
          <PricingBreakdown photographerPrice={650} />
          <a className="mt-6 block bg-black px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-white" href={`/photography/jobs/${id}/upload`}>
            Open upload area
          </a>
        </aside>
      </div>
    </ProtectedShell>
  );
}
