import { PageShell, Panel } from '@/components/layout/SiteChrome';

export default function DmcaPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="DMCA"
      description="Rights-management placeholder for imagery, listings, reports, and branded property material."
    >
      <Panel className="p-8 text-sm leading-8 text-taupe">
        Submit rights concerns for property photography, listing copy, market reports, or platform
        content through the appropriate compliance workflow.
      </Panel>
    </PageShell>
  );
}
