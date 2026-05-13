import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';

export default async function BrokerageInvitationsPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <ProtectedShell eyebrow="Brokerage Overview" profile={profile} title="Firm seller invitation activity">
      <section className="grid gap-5 md:grid-cols-3">
        {[
          ['Seller invitations', 'Brokerage admins can view invitations created by realtors in their firm.'],
          ['Listing pipeline', 'Seller onboarding status is tracked from invited through publication.'],
          ['Commission trace', 'Attribution remains connected to the realtor, brokerage, property, listing, and future sale.']
        ].map(([title, body]) => (
          <article className="border border-black/10 bg-white p-7" key={title}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Firm Control</p>
            <h2 className="font-display text-3xl">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-taupe">{body}</p>
          </article>
        ))}
      </section>
    </ProtectedShell>
  );
}
