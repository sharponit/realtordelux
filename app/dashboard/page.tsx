import { PageShell, Panel } from '@/components/layout/SiteChrome';

const cards = [
  ['Buyer', 'Saved homes, offers, AI recommendations, and transaction progress.'],
  ['Seller', 'Listing readiness, offer intelligence, document status, and advisor updates.'],
  ['Realtor', 'Lead quality, bottlenecks, AI alerts, and client next actions.'],
  ['Lawyer', 'Due diligence, risk alerts, residency workflows, and closing tasks.'],
  ['Notary', 'Signing readiness, final payment checkpoints, and deed milestones.'],
  ['Admin', 'Users, markets, AI logs, payment settings, and platform operations.']
];

export default function Dashboard() {
  return (
    <PageShell
      eyebrow="Operating Dashboard"
      title="One calm command center for every role in the transaction."
      description="Viyra organizes complex international property workflows into elegant, role-aware views with clear ownership and next actions."
    >
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(([role, copy]) => (
          <Panel className="p-7" key={role}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              {role}
            </p>
            <h2 className="font-display text-3xl">{role} View</h2>
            <p className="mt-4 text-sm leading-7 text-taupe">{copy}</p>
          </Panel>
        ))}
      </section>
      <Panel className="mt-6 p-6 text-sm leading-7 text-taupe">
        Platform attribution: v0.1.0. Developed by SaaSolutions SL. Intellectual property owned
        by Paradox FZCO.
      </Panel>
    </PageShell>
  );
}
