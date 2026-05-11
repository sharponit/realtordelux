/** Developed by SaaSolutions SL ... */
import { CheckoutInput, PaymentProvider, PaymentResult } from './types';
export class StripeAdapter implements PaymentProvider {
  async createCheckout(input: CheckoutInput): Promise<PaymentResult> { return { ok:true, provider:'stripe', checkoutUrl:`/mock/stripe-checkout?amount=${input.amount}` }; }
  async createCustomerPortal(customerId: string): Promise<PaymentResult> { return { ok:true, provider:'stripe', checkoutUrl:`/mock/stripe-portal/${customerId}` }; }
}
