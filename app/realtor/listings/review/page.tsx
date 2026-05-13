import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { CommissionAttributionPanel } from '@/components/seller-invitations/CommissionAttributionPanel';
import { requireOnboardedProfile } from '@/lib/auth/session';

export default async function RealtorListingReviewPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <ProtectedShell eyebrow="Realtor Review" profile={profile} title="Listings pending realtor review">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Review Workflow
          </p>
          <h2 className="font-display text-3xl">Seller submissions arrive as pending_realtor_review</h2>
          <div className="mt-6 grid gap-3 text-sm text-taupe">
            {[
              'Review and edit listing draft',
              'Request missing documents or media',
              'Approve for legal review',
              'Approve for publication depending on privacy workflow',
              'Trigger photographer request when needed'
            ].map((item) => <p className="border border-black/10 bg-porcelain p-4" key={item}>{item}</p>)}
          </div>
        </section>
        <CommissionAttributionPanel />
      </div>
    </ProtectedShell>
  );
}
