import { PublicFeatureGrid, PublicPage } from '@/components/marketing/PublicPage';

export default function BuyingPage() {
  return (
    <PublicPage
      eyebrow="Buying"
      title="Find exceptional homes with structured private guidance."
      description="Viyra helps buyers express preferences, save properties, coordinate offers, and request concierge support after login."
      cta="Buy with Viyra"
    >
      <PublicFeatureGrid
        items={[
          ['Curated discovery', 'Highlighted properties offer a glimpse without exposing internal workflows publicly.'],
          ['Private preferences', 'Budget, regions, property type, timeline, language, and financing needs are gathered in onboarding.'],
          ['Concierge coordination', 'Buyers can be assigned concierge support as the private workflow matures.'],
          ['Cross-border confidence', 'Legal, notary, and professional relationships can be introduced by invitation.']
        ]}
      />
    </PublicPage>
  );
}
