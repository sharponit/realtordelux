import { PhotographerCards } from '@/components/photography/PhotographerCards';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireRoleRoute } from '@/lib/auth/session';

export default async function AdminPhotographersPage() {
  const { profile } = await requireRoleRoute('admin');

  return (
    <ProtectedShell eyebrow="Platform Operations" profile={profile} title="Photographer management">
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {['Verify photographers', 'Suspend profiles', 'Override pricing', 'Approve deliveries'].map((item) => (
          <div className="border border-black/10 bg-white p-5" key={item}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Admin control</p>
            <h2 className="font-display mt-3 text-2xl">{item}</h2>
          </div>
        ))}
      </div>
      <PhotographerCards search={{ country: 'Spain', city: 'Marbella', radiusKm: 100 }} />
    </ProtectedShell>
  );
}
