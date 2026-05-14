import { PageShell, Panel } from '@/components/layout/SiteChrome';
import { docs } from '@/lib/mock/data';

export default function Documents() {
  return (
    <PageShell
      eyebrow="Secure Documents"
      title="A polished document center for sensitive property workflows."
      description="Track ownership, expiry dates, review status, and readiness without burying critical compliance details inside email threads."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {docs.map((doc) => (
          <Panel className="p-7" key={doc.id}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              {doc.status}
            </p>
            <h2 className="font-display text-3xl">{doc.type}</h2>
            <div className="mt-6 grid gap-3 text-sm text-taupe">
              <p>Responsible party: <span className="font-semibold text-black">{doc.responsibleParty}</span></p>
              <p>Upload date: <span className="font-semibold text-black">{doc.uploadDate}</span></p>
              <p>Expiry date: <span className="font-semibold text-black">{doc.expiryDate}</span></p>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
