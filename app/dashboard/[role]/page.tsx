import { redirect } from 'next/navigation';
import { ProtectedShell, ProfileSummary, roleDisplayName } from '@/components/auth/ProtectedShell';
import { roleDashboardPath, type UserRole } from '@/lib/auth/roles';
import { requireRoleRoute } from '@/lib/auth/session';

const dashboardCards: Record<UserRole, string[]> = {
  buyer: ['Saved properties', 'AI match preferences', 'Offers', 'Documents'],
  seller: ['My properties', 'Offers received', 'Documents', 'Messages'],
  realtor: ['Invite Seller', 'Seller onboarding progress', 'Listings pending review', 'Leads', 'Clients', 'Commission attribution'],
  photographer: ['Incoming job requests', 'Accepted jobs', 'Scheduled shoots', 'Photo uploads', 'Pricing settings', 'Portfolio management', 'Verification status', 'Earnings overview'],
  lawyer: ['Cases', 'Clients', 'Documents', 'Compliance'],
  notary: ['Transactions', 'Appointments', 'Documents', 'Verification'],
  firm_owner: ['Company profile', 'Users', 'Licenses', 'Billing', 'Seller invitations', 'Compliance verification'],
  firm_admin: ['Company profile', 'Users', 'Licenses', 'Seller invitations', 'Documents'],
  admin: ['Platform users', 'Firms', 'Subscriptions', 'Verification queue', 'Attribution audit', 'Support'],
  super_admin: ['Full platform access', 'Users', 'Firms', 'Subscriptions', 'Attribution audit', 'Settings']
};

export default async function RoleDashboard({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const { profile, routeRole } = await requireRoleRoute(role);

  if (roleDashboardPath[routeRole] !== `/dashboard/${role}`) {
    redirect(roleDashboardPath[routeRole] as any);
  }

  return (
    <ProtectedShell
      eyebrow="Private Dashboard"
      profile={profile}
      title={`${roleDisplayName(routeRole)} dashboard`}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ProfileSummary profile={profile} />
        <div className="grid gap-4 md:grid-cols-2">
          {dashboardCards[routeRole].map((item) => (
            <div className="border border-black/10 bg-white p-6 shadow-[0_16px_50px_rgba(23,23,23,0.06)]" key={item}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Workspace
              </p>
              <h2 className="font-display text-2xl">{item}</h2>
              <p className="mt-3 text-sm leading-6 text-taupe">
                Professional workflow placeholder ready for future AI, KYC, signing, payment, and
                legal modules.
              </p>
            </div>
          ))}
        </div>
      </div>
    </ProtectedShell>
  );
}
