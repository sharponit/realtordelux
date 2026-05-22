import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageShell, Panel } from '@/components/layout/SiteChrome';

export function PublicPage({
  eyebrow,
  title,
  description,
  children,
  cta = 'Get Started',
  ctaSlot
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  cta?: string;
  ctaSlot?: ReactNode;
}) {
  return (
    <PageShell eyebrow={eyebrow} title={title} description={description}>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
        <div>{children}</div>
        <Panel className="h-fit p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Private Access
          </p>
          <h2 className="font-display mt-4 text-3xl">Enter Viyra with a guided profile.</h2>
          <p className="mt-4 text-sm leading-7 text-taupe">
            Your profile evolves based on your preferences, activity, and verified information.
          </p>
          {ctaSlot || (
            <Link
              href="/login"
              className="mt-7 inline-flex bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#b99655]"
            >
              {cta}
            </Link>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}

export function PublicFeatureGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(([title, copy]) => (
        <Panel className="p-7" key={title}>
          <div className="mb-5 h-px w-12 bg-gold" />
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-taupe">{copy}</p>
        </Panel>
      ))}
    </div>
  );
}
