import Link from 'next/link';
import type { Route } from 'next';
import { ViyraLogo } from '@/components/layout/SiteChrome';
import { getInvitationPreviewByToken } from '@/lib/seller-invitations/service';

export default async function SellerInviteLanding({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await getInvitationPreviewByToken(token);
  const unavailable = ['invalid', 'expired', 'accepted', 'revoked'].includes(invitation.status);

  return (
    <main className="min-h-screen bg-porcelain text-black">
      <section className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="flex flex-col justify-between">
          <ViyraLogo />
          <div className="my-14">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              Private Seller Invitation
            </p>
            <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
              Start private property onboarding.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-taupe">
              VIYRA prepares your property for a premium listing workflow with document readiness,
              realtor review, photographer coordination, and future AI-powered presentation.
            </p>
          </div>
          <p className="text-xs text-black/45">
            Developed by SaaSolutions SL | © 2026 Paradox FZCO. All rights reserved.
          </p>
        </div>

        <section className="self-center border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(23,23,23,0.09)] md:p-9">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Realtor Introduction
          </p>
          {unavailable ? (
            <>
              <h2 className="font-display text-4xl">Invitation unavailable</h2>
              <p className="mt-5 text-sm leading-7 text-taupe">
                This invitation is {invitation.status}. Please ask your realtor for a new secure
                invite link if you need to continue.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-4xl">{invitation.realtor_name}</h2>
              <p className="mt-2 text-sm text-taupe">{invitation.brokerage_name || 'VIYRA realtor network'}</p>
              {invitation.personal_message ? (
                <blockquote className="mt-6 border-l-2 border-gold pl-5 text-sm leading-7 text-taupe">
                  {invitation.personal_message}
                </blockquote>
              ) : null}
              <div className="mt-7 grid gap-3 text-sm text-taupe">
                <p>Property: <strong className="text-black">{invitation.property_address}</strong></p>
                <p>Location: <strong className="text-black">{invitation.city}, {invitation.country}</strong></p>
                <p>Privacy: <strong className="text-black">{invitation.preferred_privacy_mode?.replaceAll('_', ' ')}</strong></p>
                <p>Representation: <strong className="text-black">{invitation.representation_type?.replaceAll('_', ' ')}</strong></p>
              </div>
              <Link
                className="mt-8 block bg-gold px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-black"
                href={`/seller/onboarding/invite/${token}/start` as Route}
              >
                Start private property onboarding
              </Link>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
