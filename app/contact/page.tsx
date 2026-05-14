import { PublicFeatureGrid, PublicPage } from '@/components/marketing/PublicPage';

export default function ContactPage() {
  return (
    <PublicPage
      eyebrow="Contact"
      title="Speak with Viyra about private property goals or professional access."
      description="Start with a secure profile and we will route your request to the right private workspace."
    >
      <PublicFeatureGrid
        items={[
          ['Private clients', 'Share buying, renting, selling, or investment intent through onboarding.'],
          ['Professionals', 'Realtors, lawyers, notaries, and photographers can create verified profiles.'],
          ['Developers', 'Introduce highlighted residences and new construction opportunities for review.'],
          ['Concierge', 'Request premium guidance for relocation, viewings, and transaction coordination.']
        ]}
      />
    </PublicPage>
  );
}
