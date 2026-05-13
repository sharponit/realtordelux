import { PageShell, Panel } from '@/components/layout/SiteChrome';
import { agentActions } from '@/lib/mock/data';

export default function AgentCenter() {
  return (
    <PageShell
      eyebrow="AI Agent Center"
      title="Quiet operational intelligence for complex deals."
      description="A focused view of missing documents, risk signals, stuck tasks, and next-best actions for the humans managing the transaction."
    >
      <div className="grid gap-5">
        {agentActions.map((action) => (
          <Panel className="p-7" key={action.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {action.severity} Priority
                </p>
                <h2 className="font-display text-3xl">{action.message}</h2>
              </div>
              <span className="border border-gold px-4 py-3 text-xs font-bold uppercase tracking-[0.14em]">
                Review
              </span>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
