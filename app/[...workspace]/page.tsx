import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';

function titleFromSegments(segments: string[]) {
  return segments
    .join(' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function WorkspacePlaceholder({ params }: { params: Promise<{ workspace: string[] }> }) {
  const { profile } = await requireOnboardedProfile();
  const { workspace } = await params;
  const title = titleFromSegments(workspace);

  return (
    <ProtectedShell eyebrow="Workspace" profile={profile} title={title}>
      <section className="border border-black/10 bg-white p-8 shadow-[0_20px_70px_rgba(23,23,23,0.07)]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          Foundation Ready
        </p>
        <h2 className="font-display text-4xl">{title}</h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-taupe">
          This protected workspace is connected to the role-based navigation foundation. The next
          implementation phase can attach live AI matching, document signing, KYC, payments,
          registry providers, and legal transaction workflows here.
        </p>
      </section>
    </ProtectedShell>
  );
}
