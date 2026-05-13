import { redirect } from 'next/navigation';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { SellerOnboardingWizard } from '@/components/seller-invitations/SellerOnboardingWizard';
import { getCurrentUserProfile } from '@/lib/auth/session';
import { getInvitationPreviewByToken } from '@/lib/seller-invitations/service';

export default async function SellerInviteStartPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { user, profile } = await getCurrentUserProfile();

  if (!user || !profile) {
    redirect(`/login?next=/seller/onboarding/invite/${token}/start` as any);
  }

  const invitation = await getInvitationPreviewByToken(token);
  if (['invalid', 'expired', 'accepted', 'revoked'].includes(invitation.status)) {
    redirect(`/seller/onboarding/invite/${token}` as any);
  }

  return (
    <ProtectedShell eyebrow="Seller Onboarding" profile={profile} title="Complete mansion intake">
      <SellerOnboardingWizard invitation={invitation} token={token} />
    </ProtectedShell>
  );
}
