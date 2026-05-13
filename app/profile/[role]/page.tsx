import { ProtectedShell, roleDisplayName } from '@/components/auth/ProtectedShell';
import { requireRoleRoute } from '@/lib/auth/session';

export default async function RoleProfile({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const { profile, routeRole } = await requireRoleRoute(role);

  return (
    <ProtectedShell
      eyebrow="Secure Profile"
      profile={profile}
      title={`${roleDisplayName(routeRole)} profile`}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Personal Information
          </p>
          <dl className="grid gap-4 text-sm text-taupe">
            <div><dt>Full name</dt><dd className="font-semibold text-black">{profile.full_name || 'Pending'}</dd></div>
            <div><dt>Email</dt><dd className="font-semibold text-black">{profile.email || 'Pending'}</dd></div>
            <div><dt>Phone</dt><dd className="font-semibold text-black">{profile.phone || 'Pending'}</dd></div>
            <div><dt>Preferred language</dt><dd className="font-semibold text-black">{profile.preferred_language}</dd></div>
            <div><dt>Country</dt><dd className="font-semibold text-black">{profile.country || 'Pending'}</dd></div>
          </dl>
        </section>
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Professional & Security
          </p>
          <dl className="grid gap-4 text-sm text-taupe">
            <div><dt>Role</dt><dd className="font-semibold text-black">{roleDisplayName(routeRole)}</dd></div>
            <div><dt>Firm association</dt><dd className="font-semibold text-black">Firm link placeholder</dd></div>
            <div><dt>Verification status</dt><dd className="font-semibold text-black">Pending verification</dd></div>
            <div><dt>Documents</dt><dd className="font-semibold text-black">Secure document section placeholder</dd></div>
            <div><dt>Subscription/license status</dt><dd className="font-semibold text-black">Available for firm owners/admins</dd></div>
            <div><dt>Security settings</dt><dd className="font-semibold text-black">MFA and trusted-device placeholders</dd></div>
          </dl>
        </section>
      </div>
    </ProtectedShell>
  );
}
