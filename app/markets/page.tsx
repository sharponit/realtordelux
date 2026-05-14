import { PageShell, Panel } from '@/components/layout/SiteChrome';
import { markets } from '@/lib/config/markets';

export default function Markets() {
  return (
    <PageShell
      eyebrow="Global Markets"
      title="Local legal nuance, presented with a consistent global standard."
      description="Viyra frames each country around currency, language, transaction workflow, tax, residency, and advisor coordination."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {markets.map((market) => (
          <Panel className="p-7" key={market.code}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              {market.code}
            </p>
            <h2 className="font-display text-3xl">{market.country}</h2>
            <div className="mt-6 space-y-3 text-sm leading-6 text-taupe">
              <p>Currency: <span className="font-semibold text-black">{market.currency}</span></p>
              <p>Default language: <span className="font-semibold text-black">{market.defaultLanguage}</span></p>
              <p>Localized legal workflow, tax, residency, and notary placeholders.</p>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
