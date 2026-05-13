import { GoldButton, PageShell, Panel } from '@/components/layout/SiteChrome';
import { matchProperty } from '@/lib/ai/ai-client';

const prompts = [
  'Lifestyle and privacy expectations',
  'Family, schooling, and airport proximity',
  'Sea, marina, golf, and wellness preferences',
  'Cultural, legal, financing, and remote purchase requirements'
];

export default async function AIConcierge() {
  const rec = await matchProperty({ preferenceProfileId: 'pref-001', context: { market: 'ES', locale: 'en' } });
  const top = rec.data?.[0];

  return (
    <PageShell
      eyebrow="AI Concierge"
      title="A discreet buyer intake designed for real human priorities."
      description="Capture budget, lifestyle, privacy, cultural fit, legal readiness, and investment intent before a buyer ever needs to browse hundreds of listings."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="p-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Guided Intake
          </p>
          <h2 className="font-display text-4xl">Preference profile</h2>
          <div className="mt-7 grid gap-3">
            {prompts.map((prompt) => (
              <div className="flex items-center justify-between border-b border-black/10 py-4" key={prompt}>
                <span className="text-sm text-taupe">{prompt}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Ready</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <GoldButton href="/search">Explore Matches</GoldButton>
          </div>
        </Panel>

        <Panel className="bg-[#171717] p-8 text-white">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Current Recommendation
          </p>
          <h2 className="font-display text-4xl">{top?.propertyId ?? 'p1'}</h2>
          <p className="mt-4 text-6xl text-gold">{top?.score ?? 90}%</p>
          <p className="mt-6 leading-8 text-white/75">
            {top?.reason ?? 'Fallback concierge recommendation for a private international buyer.'}
          </p>
          {rec.degraded ? (
            <p className="mt-6 border border-gold/40 p-4 text-sm text-white/70">
              AI service unavailable. Showing graceful mock fallback.
            </p>
          ) : null}
        </Panel>
      </div>
    </PageShell>
  );
}
