import { PhotographerCards } from '@/components/photography/PhotographerCards';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';

export default async function PhotographerSearchPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <ProtectedShell eyebrow="Assign Photographer" profile={profile} title="Top regional luxury photographers">
      <div className="mb-8 grid gap-4 border border-black/10 bg-white p-6 md:grid-cols-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Country</p>
          <p className="mt-2 text-sm text-taupe">Spain</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Region</p>
          <p className="mt-2 text-sm text-taupe">Marbella / Costa del Sol</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Radius</p>
          <p className="mt-2 text-sm text-taupe">Top 10 within service region</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Priority</p>
          <p className="mt-2 text-sm text-taupe">Verified, rated, nearby, luxury-ready</p>
        </div>
      </div>
      <PhotographerCards search={{ country: 'Spain', city: 'Marbella', radiusKm: 100 }} />
    </ProtectedShell>
  );
}
