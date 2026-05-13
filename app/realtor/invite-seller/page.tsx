import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { InviteSellerForm } from '@/components/seller-invitations/InviteSellerForm';
import { requireOnboardedProfile } from '@/lib/auth/session';

export default async function InviteSellerPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <ProtectedShell eyebrow="Realtor Workspace" profile={profile} title="Invite seller to onboard a luxury property">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="border border-black/10 bg-[#171717] p-7 text-white">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Attribution Anchor
          </p>
          <h2 className="font-display text-4xl">Seller → property → listing → sale → commission.</h2>
          <p className="mt-5 text-sm leading-7 text-white/70">
            This secure invitation creates the legal and business trace for seller onboarding,
            realtor attribution, brokerage visibility, future offers, documents, legal workflows,
            and commission records.
          </p>
        </section>
        <InviteSellerForm />
      </div>
    </ProtectedShell>
  );
}
