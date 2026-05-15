import { RESIDENCY_DISCLAIMER, type ResidencyOpportunity } from '@/lib/residency/rules';

export function ResidencyOpportunityBadge({ opportunity }: { opportunity: ResidencyOpportunity | null }) {
  if (!opportunity) {
    return null;
  }

  return (
    <div className="border border-gold/70 bg-[#171717] p-5 text-white shadow-[0_20px_70px_rgba(23,23,23,0.14)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Residency Opportunity Available
      </p>
      <h2 className="mt-3 font-display text-2xl text-white">{opportunity.pathwayName}</h2>
      <p className="mt-3 text-sm leading-6 text-white/72">{opportunity.summary}</p>
      <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-white/58">
        {opportunity.disclaimer || RESIDENCY_DISCLAIMER}
      </p>
    </div>
  );
}
