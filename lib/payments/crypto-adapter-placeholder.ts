/** Developed by SaaSolutions SL ... */
import { CheckoutInput, PaymentProvider, PaymentResult } from './types';
export class CryptoAdapterPlaceholder implements PaymentProvider {
  async createCheckout(_: CheckoutInput): Promise<PaymentResult> { return { ok:false, provider:'coinbase', error:'Crypto adapter not enabled yet' }; }
  async createCustomerPortal(_: string): Promise<PaymentResult> { return { ok:false, provider:'coinbase', error:'Not supported' }; }
}
