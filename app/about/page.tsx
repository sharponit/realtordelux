import { PublicFeatureGrid, PublicPage } from '@/components/marketing/PublicPage';

export default function AboutPage() {
  return (
    <PublicPage
      eyebrow="About Viyra"
      title="A private operating layer for international luxury real estate."
      description="Viyra connects discerning clients with verified professionals, structured workflows, and concierge-level coordination."
    >
      <PublicFeatureGrid
        items={[
          ['Discreet by design', 'Public pages create trust and curiosity. Private workflows stay behind secure access.'],
          ['Built for cross-border property', 'Buyers, sellers, advisors, and transaction professionals can coordinate across markets.'],
          ['Verified ecosystem', 'Professional profiles, invitations, and role-based access create a more trustworthy network.'],
          ['Concierge-driven', 'The experience is calm, guided, and premium from first visit to private dashboard.']
        ]}
      />
    </PublicPage>
  );
}
