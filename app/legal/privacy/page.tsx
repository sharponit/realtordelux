import { PageShell, Panel } from '@/components/layout/SiteChrome';

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="Enterprise-grade privacy placeholder for buyer, seller, advisor, document, and transaction data workflows."
    >
      <Panel className="p-8 text-sm leading-8 text-taupe">
        Viyra privacy workflows are designed around discreet data handling, secure document
        review, and role-based access for international luxury property transactions.
      </Panel>
    </PageShell>
  );
}
