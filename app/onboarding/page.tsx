import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { getCurrentUserProfile } from '@/lib/auth/session';
import { SiteFooter, ViyraLogo } from '@/components/layout/SiteChrome';

export default async function OnboardingPage() {
  const { user, profile } = await getCurrentUserProfile();

  return (
    <main className="min-h-screen bg-porcelain text-black">
      <header className="mx-auto max-w-7xl px-6 py-7 lg:px-10">
        <ViyraLogo />
      </header>
      <section className="border-y border-black/10 bg-ivory/55">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Professional Onboarding
          </p>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-6xl">
            Set up your private Viyra profile.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-taupe">
            Choose your role, complete your profile, verify professional status, or attach yourself
            to a firm under license-seat governance.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        <OnboardingFlow userEmail={profile?.email || user?.email || ''} />
      </section>
      <SiteFooter />
    </main>
  );
}
