import { PageShell, Panel } from '@/components/layout/SiteChrome';
import { transactions } from '@/lib/mock/data';

export default function Transactions() {
  const transaction = transactions[0];

  return (
    <PageShell
      eyebrow="Transaction Room"
      title="Every milestone, owner, risk, and next action in one place."
      description="A refined transaction timeline for international purchases, from offer and KYC through due diligence, notary signing, transfer, and keys."
    >
      <Panel className="mb-7 p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Active Purchase
            </p>
            <h2 className="font-display text-4xl">Progress {transaction.progress}%</h2>
          </div>
          <div className="h-3 w-full bg-ivory md:max-w-md">
            <div className="h-full bg-gold" style={{ width: `${transaction.progress}%` }} />
          </div>
        </div>
      </Panel>

      <div className="grid gap-4">
        {transaction.stages.map((stage, index) => (
          <Panel className="p-6" key={stage.key}>
            <div className="grid gap-4 md:grid-cols-[80px_1fr_180px] md:items-center">
              <div className="font-display text-4xl text-gold">{String(index + 1).padStart(2, '0')}</div>
              <div>
                <h2 className="font-display text-2xl">{stage.key}</h2>
                <p className="mt-2 text-sm leading-6 text-taupe">
                  {stage.requiredAction}. {stage.aiExplanation}
                </p>
              </div>
              <div className="space-y-2 text-sm text-taupe">
                <p>Status: <span className="font-semibold text-black">{stage.status}</span></p>
                <p>Owner: <span className="font-semibold text-black">{stage.responsibleRole}</span></p>
                <p>Risk: <span className="font-semibold text-black">{stage.risk}</span></p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
