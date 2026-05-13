export function CommissionAttributionPanel() {
  return (
    <section className="border border-black/10 bg-white p-7">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Commission Attribution
      </p>
      <div className="grid gap-4 text-sm text-taupe md:grid-cols-2">
        <p>Listing realtor <strong className="block text-black">Anchored from invitation</strong></p>
        <p>Buyer-side realtor <strong className="block text-black">Prepared for offer workflow</strong></p>
        <p>Referral realtor <strong className="block text-black">Optional referral link</strong></p>
        <p>Brokerage share <strong className="block text-black">Firm-aware split metadata</strong></p>
        <p>Platform fee <strong className="block text-black">Stored separately</strong></p>
        <p>Status <strong className="block text-black">Draft, active, disputed, released, cancelled</strong></p>
      </div>
    </section>
  );
}
