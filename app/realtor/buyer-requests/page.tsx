import { redirect } from 'next/navigation';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { getPostLoginPath } from '@/lib/auth/routing';
import { requireOnboardedProfile } from '@/lib/auth/session';

const requestCards = [
  {
    title: 'New regional briefs',
    copy:
      'See buyer preference summaries matched to your country, city, region, language, specialization, and verification profile.'
  },
  {
    title: 'Respond with interest',
    copy:
      'Express interest when you can provide premium service. Contact details stay controlled until the buyer or platform selects a next step.'
  },
  {
    title: 'Pipeline states',
    copy:
      'Future workflow states are prepared for new, viewed, interested, shortlisted, assigned, and closed buyer requests.'
  }
];

export default async function RealtorBuyerRequestsPage() {
  const { profile } = await requireOnboardedProfile();
  const roles = profile.roles?.length ? profile.roles : [profile.role];
  const canReviewBuyerRequests = roles.some((role) => ['realtor', 'admin', 'super_admin'].includes(role));

  if (!canReviewBuyerRequests) {
    redirect(getPostLoginPath(profile) as any);
  }

  return (
    <ProtectedShell eyebrow="Regional Buyer Briefs" profile={profile} title="Buyer Requests">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(23,23,23,0.07)]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Controlled Lead Summary
          </p>
          <h2 className="font-display text-3xl">Let qualified buyers choose the right regional expert.</h2>
          <p className="mt-5 text-sm leading-7 text-taupe">
            Buyer requests submitted from the public Buying page are matched to selected Realtors. This first version
            prepares the response workflow while protecting buyer contact details until assignment or accepted next steps.
          </p>
        </section>

        <section className="grid gap-4">
          {requestCards.map((card) => (
            <article className="border border-black/10 bg-white p-6 shadow-[0_16px_50px_rgba(23,23,23,0.06)]" key={card.title}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Buyer Request Placeholder
              </p>
              <h3 className="font-display text-2xl">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-taupe">{card.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </ProtectedShell>
  );
}
