import { calculatePhotographyPrice } from '@/lib/photography/pricing';

export function PricingBreakdown({ photographerPrice }: { photographerPrice: number }) {
  const pricing = calculatePhotographyPrice(photographerPrice);

  return (
    <div className="grid gap-3 border border-gold/30 bg-gold/10 p-5 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-taupe">Photographer fee</span>
        <strong>€{pricing.photographer_price.toLocaleString()}</strong>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-taupe">VIYRA service fee 3%</span>
        <strong>€{pricing.viyra_service_fee.toLocaleString()}</strong>
      </div>
      <div className="flex justify-between gap-4 border-t border-gold/30 pt-3 text-base">
        <span>Total customer price</span>
        <strong>€{pricing.customer_total.toLocaleString()}</strong>
      </div>
    </div>
  );
}
