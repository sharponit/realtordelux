import { PageShell, Panel } from '@/components/layout/SiteChrome';

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="Platform terms placeholder for AI-assisted discovery, transaction coordination, and advisor collaboration."
    >
      <Panel className="p-8 text-sm leading-8 text-taupe">
        These terms frame Viyra as a premium operating layer for property discovery, buyer intake,
        document workflows, and transaction progress management.
      </Panel>
    </PageShell>
  );
}
