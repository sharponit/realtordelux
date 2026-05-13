import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';

export default async function InvitePhotographerPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <ProtectedShell eyebrow="External Photographer Invitation" profile={profile} title="Invite a trusted photographer">
      <form className="grid gap-5 border border-black/10 bg-white p-7 md:grid-cols-2">
        {['Photographer name', 'Email', 'Phone number', 'Linked property ID'].map((label) => (
          <label key={label}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">{label}</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" type={label === 'Email' ? 'email' : 'text'} />
          </label>
        ))}
        <label className="md:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Optional notes</span>
          <textarea className="mt-2 min-h-32 w-full border border-black/10 bg-porcelain px-4 py-3" />
        </label>
        <div className="md:col-span-2 border border-gold/30 bg-gold/10 p-4 text-sm leading-7 text-black/70">
          Invitation records are stored in photography_job_invites and linked to the property/job.
          Email delivery can be connected to Resend, Supabase Auth invites, or a CRM workflow later.
        </div>
        <button className="bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black" type="button">
          Send invitation placeholder
        </button>
      </form>
    </ProtectedShell>
  );
}
