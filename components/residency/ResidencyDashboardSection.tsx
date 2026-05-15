import { Panel } from '@/components/layout/SiteChrome';
import {
  RESIDENCY_DISCLAIMER,
  defaultResidencyRules,
  evaluateResidencyOpportunity,
  type ResidencyOpportunity
} from '@/lib/residency/rules';
import { properties } from '@/lib/mock/data';
import type { ProfileRow } from '@/lib/supabase/types';

export function ResidencyDashboardSection({
  profile,
  opportunities
}: {
  profile: ProfileRow;
  opportunities?: ResidencyOpportunity[];
}) {
  const visibleOpportunities =
    opportunities?.length
      ? opportunities
      : properties
          .map((property) =>
            evaluateResidencyOpportunity({
              property,
              buyerProfile: {
                nationality: profile.country,
                preferredLanguage: profile.preferred_language,
                investmentIntent: 'relocation'
              },
              actionSource: 'view',
              rules: defaultResidencyRules,
              language: profile.preferred_language
            })
          )
          .filter(Boolean)
          .slice(0, 3) as ResidencyOpportunity[];

  return (
    <Panel className="p-7">
      <div className="flex flex-col gap-3 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Buyer Intelligence
          </p>
          <h2 className="mt-2 font-display text-3xl">Residency & Relocation Opportunities</h2>
        </div>
        <span className="w-fit border border-gold/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
          Informational alerts
        </span>
      </div>

      <div className="mt-5 grid gap-4">
        {visibleOpportunities.length ? (
          visibleOpportunities.map((opportunity) => (
            <div className="border border-black/10 bg-porcelain p-5" key={`${opportunity.ruleId}-${opportunity.actionSource}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                    {opportunity.country}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">{opportunity.pathwayName}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-taupe">{opportunity.summary}</p>
                </div>
                <p className="text-sm font-semibold text-black">
                  {opportunity.currency} {opportunity.minPropertyValue.toLocaleString()}+
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-black/10 bg-porcelain p-5">
            <h3 className="font-display text-2xl">No current alerts</h3>
            <p className="mt-3 text-sm leading-6 text-taupe">
              Viyra will surface residency, visa, relocation, and tax residency prompts when a
              property and buyer profile indicate a possible review path.
            </p>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs leading-5 text-taupe">{RESIDENCY_DISCLAIMER}</p>
    </Panel>
  );
}
