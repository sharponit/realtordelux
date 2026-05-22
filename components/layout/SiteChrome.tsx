import Link from 'next/link';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import { SocialProfileButtons } from '@/components/common/SocialProfileButtons';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { t, type Locale } from '@/lib/i18n';

const navItems = [
  ['buying', '/buying'],
  ['renting', '/renting'],
  ['selling', '/selling'],
  ['newDevelopments', '/new-developments'],
  ['about', '/about'],
  ['contact', '/contact']
] satisfies ReadonlyArray<readonly [keyof ReturnType<typeof t>['nav'], Route]>;

export function ViyraLogo({ light = false }: { light?: boolean }) {
  if (light) {
    return (
      <Link href="/" className="inline-flex items-center gap-3">
        <img src="/viyra/icons/svg/viyra-icon.svg" alt="" className="h-10 w-10 object-contain" />
        <span className="leading-none">
          <span className="block font-display text-3xl uppercase tracking-[0.2em] text-white">
            Viyra
          </span>
          <span className="mt-1 block text-[8px] uppercase tracking-[0.28em] text-gold">
            Luxury Real Estate
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className="inline-flex items-center">
      <img
        src="/viyra/logos/png/viyra-transparent-dark.png"
        alt="Viyra"
        className="block object-contain"
        style={{ width: 132, height: 'auto', maxWidth: '100%' }}
      />
    </Link>
  );
}

export function SiteHeader({ light = false, locale = 'en' }: { light?: boolean; locale?: Locale }) {
  const copy = t(locale);

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 lg:px-10">
      <ViyraLogo light={light} />
      <nav
        className={`hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.18em] lg:flex ${
          light ? 'text-white/85' : 'text-black/75'
        }`}
      >
        {navItems.map(([key, href]) => (
          <Link className="transition hover:text-gold" href={href} key={href}>
            {copy.nav[key]}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <LocaleSwitcher activeLocale={locale} light={light} />
        <Link
          href="/login"
          className={`hidden border px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition md:inline-flex ${
            light
              ? 'border-gold text-gold hover:bg-gold hover:text-black'
              : 'border-gold text-black hover:bg-gold hover:text-black'
          }`}
        >
          {copy.actions.login}
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter({ locale = 'en' }: { locale?: Locale }) {
  const copy = t(locale);

  return (
    <footer className="border-t border-black/10 bg-[#171717] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[auto_1fr_auto] md:items-center lg:px-10">
        <ViyraLogo light />
        <div className="max-w-xl text-sm leading-6 text-white/65">
          <p>{copy.footerSummary}</p>
          <p className="mt-4 pl-10 text-xs tracking-[0.03em] text-white/50 md:pl-0">
            {copy.footer}
          </p>
        </div>
        <SocialProfileButtons
          variant="footer"
          showLabels={false}
          locale={locale}
          className="text-white md:justify-end"
        />
      </div>
    </footer>
  );
}

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  locale = 'en'
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  locale?: Locale;
}) {
  return (
    <main className="min-h-screen bg-porcelain text-black">
      <SiteHeader locale={locale} />
      <section className="border-y border-black/10 bg-ivory/55">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            {eyebrow}
          </p>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-taupe">{description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</section>
      <SiteFooter locale={locale} />
    </main>
  );
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-black/10 bg-white shadow-[0_20px_70px_rgba(23,23,23,0.07)] ${className}`}>
      {children}
    </div>
  );
}

export function GoldButton({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-[#b99655]"
    >
      {children}
    </Link>
  );
}
