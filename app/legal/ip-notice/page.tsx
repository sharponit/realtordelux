import { PageShell, Panel } from '@/components/layout/SiteChrome';

export default function IpNoticePage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Intellectual Property Notice"
      description="Brand, platform, workflow, and content ownership placeholder for the Viyra operating system."
    >
      <Panel className="p-8 text-sm leading-8 text-taupe">
        Viyra platform concepts, product architecture, brand assets, and operating workflows are
        presented as protected intellectual property of the owning entity.
      </Panel>
    </PageShell>
  );
}
