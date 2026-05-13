import { LoginPanel } from '@/components/auth/LoginPanel';
import { ViyraLogo } from '@/components/layout/SiteChrome';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-porcelain text-black lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex flex-col justify-between px-6 py-8 lg:px-12">
        <ViyraLogo />
        <div className="my-14 max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Secure Professional Access
          </p>
          <h2 className="font-display text-5xl leading-[1.05] md:text-6xl">
            Private client dashboard. Verified professional network.
          </h2>
          <p className="mt-6 text-base leading-8 text-taupe">
            Access Viyra as a buyer, seller, independent professional, firm team member, firm
            owner, or platform administrator.
          </p>
        </div>
        <p className="text-xs text-black/45">
          Developed by SaaSolutions SL | © 2026 Paradox FZCO. All rights reserved.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[#171717] px-6 py-10">
        <div className="w-full max-w-md">
          <LoginPanel />
        </div>
      </section>
    </main>
  );
}
