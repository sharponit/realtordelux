export const VIYRA_PHOTOGRAPHY_SERVICE_FEE_RATE = 0.03;

export interface PhotographyPriceBreakdown {
  photographer_price: number;
  viyra_service_fee: number;
  customer_total: number;
}

export function calculatePhotographyPrice(
  photographerPrice: number,
  serviceFeeRate = VIYRA_PHOTOGRAPHY_SERVICE_FEE_RATE
): PhotographyPriceBreakdown {
  const photographer_price = Number(photographerPrice.toFixed(2));
  const viyra_service_fee = Number((photographer_price * serviceFeeRate).toFixed(2));
  const customer_total = Number((photographer_price + viyra_service_fee).toFixed(2));

  return { photographer_price, viyra_service_fee, customer_total };
}
