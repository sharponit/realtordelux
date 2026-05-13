import { PricingBreakdown } from '@/components/photography/PricingBreakdown';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';

export default async function AssignPhotographerPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <ProtectedShell eyebrow="Property Listing Workflow" profile={profile} title="Assign photographer">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Option A
          </p>
          <h2 className="font-display text-3xl">Choose from top 10 nearby photographers</h2>
          <p className="mt-4 text-sm leading-7 text-taupe">
            VIYRA ranks verified photographers by rating, distance, completed luxury jobs, delivery
            time, availability, and drone capability when required.
          </p>
          <a className="mt-6 inline-block bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white" href="/photographers">
            View regional photographers
          </a>
        </section>
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Option B
          </p>
          <h2 className="font-display text-3xl">Invite a photographer you know</h2>
          <p className="mt-4 text-sm leading-7 text-taupe">
            Link a private invitation to this property project. Once the photographer registers,
            they can accept the assignment and complete their VIYRA profile.
          </p>
          <a className="mt-6 inline-block border border-gold px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-gold" href="/photography/invite">
            Invite photographer
          </a>
        </section>
        <section className="border border-black/10 bg-white p-7 lg:col-span-2">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Pricing model
          </p>
          <PricingBreakdown photographerPrice={500} />
        </section>
      </div>
    </ProtectedShell>
  );
}
