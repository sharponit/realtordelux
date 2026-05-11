/** Developed by SaaSolutions SL ... */
import { PaymentProviderName, PaymentProvider } from './types';
import { StripeAdapter } from './stripe-adapter';
import { CryptoAdapterPlaceholder } from './crypto-adapter-placeholder';
export const getPaymentProvider = (name: PaymentProviderName): PaymentProvider => {
  if (name === 'stripe') return new StripeAdapter();
  return new CryptoAdapterPlaceholder();
};
