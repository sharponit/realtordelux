import { redirect } from 'next/navigation';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { getPostLoginPath } from '@/lib/auth/routing';
import { requireOnboardedProfile } from '@/lib/auth/session';

const requestSteps = [
  {
    title: 'Pending requests',
    copy:
      'Review photographers who have asked to join Viyra through your Realtor relationship. Account existence stays private until you decide how to proceed.'
  },
  {
    title: 'Approve or reject',
    copy:
      'Approval will generate a photographer onboarding invitation, link the photographer to your Realtor profile, and notify them by email.'
  },
  {
    title: 'Invite directly',
    copy:
      'Realtors can continue inviting preferred photographers directly for listings, portfolio review, and recurring luxury presentation work.'
  }
];

export default async function PhotographerRequestsPage() {
  const { profile } = await requireOnboardedProfile();
  const roles = profile.roles?.length ? profile.roles : [profile.role];
  const canManageRequests = roles.some((role) => ['realtor', 'admin', 'super_admin'].includes(role));

  if (!canManageRequests) {
    redirect(getPostLoginPath(profile) as any);
  }

  return (
    <ProtectedShell eyebrow="Realtor Collaboration" profile={profile} title="Photographer Requests">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(23,23,23,0.07)]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Curated Access
          </p>
          <h2 className="font-display text-3xl">Protect the visual standard through trusted partners.</h2>
          <p className="mt-5 text-sm leading-7 text-taupe">
            Photographer requests submitted from the public professional page appear here for Realtor review.
            This first version prepares the approval workflow, invitation generation, linked photographer
            relationships, and notification trail without opening photographer signup to the public.
          </p>
          <a
            className="mt-7 inline-flex border border-gold px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-black"
            href="/photography/invite"
          >
            Invite Photographer Directly
          </a>
        </section>

        <section className="grid gap-4">
          {requestSteps.map((step) => (
            <article className="border border-black/10 bg-white p-6 shadow-[0_16px_50px_rgba(23,23,23,0.06)]" key={step.title}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Workflow Placeholder
              </p>
              <h3 className="font-display text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-taupe">{step.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </ProtectedShell>
  );
}
