/**
 * Developed by SaaSolutions SL
 * Intellectual Property owned by Paradox FZCO
 * © 2026 Paradox FZCO. All rights reserved.
 */
import { getPaymentProvider } from '@/lib/payments/provider-factory';
import { isStripeConfigured } from '@/lib/payments/stripe-config';

export async function POST(req: Request) {
  const body = await req.json();
  const providerName = body.provider ?? 'stripe';
  if (providerName === 'stripe' && !isStripeConfigured()) {
    return Response.json({ ok: false, provider: 'stripe', error: 'Stripe publishable key is not configured' }, { status: 400 });
  }
  const provider = getPaymentProvider(providerName);
  const result = await provider.createCheckout(body);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
