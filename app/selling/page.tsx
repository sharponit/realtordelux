import { PublicFeatureGrid, PublicPage } from '@/components/marketing/PublicPage';

export default function SellingPage() {
  return (
    <PublicPage
      eyebrow="Selling"
      title="Prepare a luxury property for market with controlled professional access."
      description="Sellers can provide property details, invite a realtor, and coordinate professional support after onboarding."
      cta="Sell with Viyra"
    >
      <PublicFeatureGrid
        items={[
          ['Guided seller intake', 'Location, property type, ownership status, estimated value, and realtor preference are captured without AI dependency.'],
          ['Realtor invitations', 'Sellers can accept realtor invitations or invite their own preferred advisor.'],
          ['Professional network', 'Lawyers, notaries, and photographers can be introduced through relationship placeholders.'],
          ['Controlled visibility', 'Listing progress and offers remain private.']
        ]}
      />
    </PublicPage>
  );
}
