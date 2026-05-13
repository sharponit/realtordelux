import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { CommissionAttributionPanel } from '@/components/seller-invitations/CommissionAttributionPanel';
import { requireRoleRoute } from '@/lib/auth/session';

export default async function AdminAttributionAuditPage() {
  const { profile } = await requireRoleRoute('admin');

  return (
    <ProtectedShell eyebrow="Platform Audit" profile={profile} title="Seller invitation attribution audit">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Audit Trail
          </p>
          {[
            'invitation_created',
            'invite_opened',
            'invite_accepted',
            'seller_account_linked',
            'property_created',
            'documents_uploaded',
            'listing_submitted',
            'realtor_reviewed',
            'commission_attribution_created',
            'status_changed'
          ].map((event) => (
            <p className="border-b border-black/10 py-3 text-sm text-taupe" key={event}>{event}</p>
          ))}
        </section>
        <CommissionAttributionPanel />
      </div>
    </ProtectedShell>
  );
}
