import { PublicFeatureGrid, PublicPage } from '@/components/marketing/PublicPage';

export default function NewDevelopmentsPage() {
  return (
    <PublicPage
      eyebrow="New Construction"
      title="Position exceptional developments for international luxury demand."
      description="Viyra presents new construction with restraint, then moves serious buyers into secure private workflows."
      cta="Explore New Developments"
    >
      <PublicFeatureGrid
        items={[
          ['Development discovery', 'Public visitors see curated positioning, not operational dashboards.'],
          ['Buyer qualification', 'Budget, region, asset type, and timeline are collected in onboarding.'],
          ['Investor relevance', 'Investment strategy and ROI expectations can route users into an investor role.'],
          ['Professional coordination', 'Realtor, legal, notary, and concierge workflows remain login-gated.']
        ]}
      />
    </PublicPage>
  );
}
