import { AdminResidencyRulesPanel } from '@/components/residency/AdminResidencyRulesPanel';
import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireRoleRoute } from '@/lib/auth/session';
import { defaultResidencyRules, type ResidencyRule } from '@/lib/residency/rules';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ResidencyRuleRow } from '@/lib/supabase/types';

export default async function AdminResidencyRulesPage() {
  const { profile } = await requireRoleRoute('admin');
  const rules = await loadResidencyRules();

  return (
    <ProtectedShell eyebrow="Legal Intelligence" profile={profile} title="Residency rules">
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {['Country thresholds', 'Buyer profile rules', 'Legal partner workflow', 'Multilingual alerts'].map((item) => (
          <div className="border border-black/10 bg-white p-5" key={item}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Residency control
            </p>
            <h2 className="font-display mt-3 text-2xl">{item}</h2>
          </div>
        ))}
      </div>
      <AdminResidencyRulesPanel initialRules={rules} />
    </ProtectedShell>
  );
}

async function loadResidencyRules(): Promise<ResidencyRule[]> {
  try {
    const supabase = (await createSupabaseServerClient()) as any;
    const { data, error } = await supabase
      .from('residency_rules')
      .select('*')
      .order('country', { ascending: true });

    if (error || !data?.length) {
      return defaultResidencyRules;
    }

    return data.map(fromRow);
  } catch {
    return defaultResidencyRules;
  }
}

function fromRow(row: ResidencyRuleRow): ResidencyRule {
  return {
    id: row.id,
    country: row.country,
    countryCode: row.country_code,
    pathwayKey: row.pathway_key,
    pathwayName: row.pathway_name,
    status: row.status,
    minPropertyValue: Number(row.min_property_value || 0),
    currency: row.currency,
    eligibleNationalities: row.eligible_nationalities || [],
    excludedNationalities: row.excluded_nationalities || [],
    buyerProfileRequirements: typeof row.buyer_profile_requirements === 'object' && row.buyer_profile_requirements && !Array.isArray(row.buyer_profile_requirements)
      ? row.buyer_profile_requirements as ResidencyRule['buyerProfileRequirements']
      : {},
    summary: row.summary,
    multilingualContent: typeof row.multilingual_content === 'object' && row.multilingual_content && !Array.isArray(row.multilingual_content)
      ? row.multilingual_content as ResidencyRule['multilingualContent']
      : {},
    disclaimer: row.disclaimer,
    reviewRecommended: true,
    luxuryMarkets: row.luxury_markets || []
  };
}
