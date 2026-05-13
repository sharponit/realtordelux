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
        {routeRole === 'photographer' ? (
          <section className="border border-black/10 bg-white p-7 lg:col-span-2">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Photographer Profile
            </p>
            <div className="grid gap-4 text-sm text-taupe md:grid-cols-3">
              <div><dt>Portfolio</dt><dd className="font-semibold text-black">Portfolio images placeholder</dd></div>
              <div><dt>Drone certification</dt><dd className="font-semibold text-black">Upload required when drone is available</dd></div>
              <div><dt>Equipment list</dt><dd className="font-semibold text-black">Camera, lenses, lighting, drone</dd></div>
              <div><dt>Available services</dt><dd className="font-semibold text-black">Interior, exterior, drone, twilight, video, 360, floorplan</dd></div>
              <div><dt>Base price</dt><dd className="font-semibold text-black">Set by photographer</dd></div>
              <div><dt>VIYRA service fee</dt><dd className="font-semibold text-black">3% added to customer total</dd></div>
            </div>
          </section>
        ) : null}
      </div>
    </ProtectedShell>
  );
}
