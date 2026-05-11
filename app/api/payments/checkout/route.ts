/** Developed by SaaSolutions SL ... */
import { getPaymentProvider } from '@/lib/payments/provider-factory';
export async function POST(req: Request) { const body = await req.json(); const provider = getPaymentProvider((body.provider ?? 'stripe')); const result = await provider.createCheckout(body); return Response.json(result, { status: result.ok ? 200 : 400 }); }
