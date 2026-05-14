import { PageShell, Panel } from '@/components/layout/SiteChrome';

export default function TrademarkPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Trademark Notice"
      description="Trademark placeholder for Viyra brand usage, partner applications, and public references."
    >
      <Panel className="p-8 text-sm leading-8 text-taupe">
        Viyra names, marks, logos, and related brand expressions should be used only with approved
        guidelines and proper attribution.
      </Panel>
    </PageShell>
  );
}
