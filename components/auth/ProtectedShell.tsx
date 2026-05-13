import Link from 'next/link';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import { getMenuForRole } from '@/lib/auth/menu';
import { roleLabels, type UserRole } from '@/lib/auth/roles';
import { SiteFooter, ViyraLogo } from '@/components/layout/SiteChrome';
import type { ProfileRow } from '@/lib/supabase/types';

export function ProtectedShell({
  profile,
  title,
  eyebrow,
  children
}: {
  profile: ProfileRow;
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const menu = getMenuForRole(profile.role);

  return (
    <main className="min-h-screen bg-porcelain text-black">
      <header className="border-b border-black/10 bg-porcelain">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 lg:px-10">
          <div className="flex items-center justify-between gap-6">
            <ViyraLogo />
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                {roleLabels[profile.role]}
              </p>
              <p className="mt-1 text-sm text-taupe">{profile.email}</p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {menu.map((item) => (
              <Link
                className="shrink-0 border border-black/10 bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition hover:border-gold hover:text-gold"
                href={item.href as Route}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="border-b border-black/10 bg-ivory/55">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-6xl">{title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</section>
      <SiteFooter />
    </main>
  );
}

export function ProfileSummary({ profile }: { profile: ProfileRow }) {
  return (
    <div className="border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(23,23,23,0.07)]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Profile</p>
      <h2 className="font-display text-3xl">{profile.full_name || 'Complete your personal profile'}</h2>
      <div className="mt-6 grid gap-3 text-sm text-taupe md:grid-cols-2">
        <p>Email: <span className="font-semibold text-black">{profile.email || 'Pending'}</span></p>
        <p>Role: <span className="font-semibold text-black">{roleLabels[profile.role]}</span></p>
        <p>Country: <span className="font-semibold text-black">{profile.country || 'Not set'}</span></p>
        <p>Language: <span className="font-semibold text-black">{profile.preferred_language}</span></p>
        <p>Onboarding: <span className="font-semibold text-black">{profile.onboarding_status}</span></p>
      </div>
    </div>
  );
}

export function roleDisplayName(role: UserRole) {
  return roleLabels[role];
}
