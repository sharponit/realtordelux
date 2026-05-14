import { PublicFeatureGrid, PublicPage } from '@/components/marketing/PublicPage';

export default function RentingPage() {
  return (
    <PublicPage
      eyebrow="Renting"
      title="Explore luxury rentals with the same discretion as a purchase."
      description="Renters can onboard with preferred regions, budget, property type, timeline, and language preferences."
      cta="Rent with Viyra"
    >
      <PublicFeatureGrid
        items={[
          ['Premium rental intent', 'Capture lifestyle, location, and timeline requirements in a simple guided flow.'],
          ['Saved residences', 'Logged-in renters can keep shortlists private and organized.'],
          ['Concierge readiness', 'Relocation and lifestyle support can be added as a guided placeholder workflow.'],
          ['Private by default', 'Rental workflows are not exposed to public visitors.']
        ]}
      />
    </PublicPage>
  );
}
