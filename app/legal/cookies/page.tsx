import { PageShell, Panel } from '@/components/layout/SiteChrome';

export default function CookiesPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Cookie Policy"
      description="Cookie and preference placeholder for analytics, personalization, and secure session workflows."
    >
      <Panel className="p-8 text-sm leading-8 text-taupe">
        Viyra uses a restrained consent model for product analytics, saved preferences, and secure
        account sessions across the property journey.
      </Panel>
    </PageShell>
  );
}
