/**
 * Viyra.com™
 * Developed by SaaSolutions SL
 * Intellectual Property owned by Paradox FZCO
 * © 2026 Paradox FZCO. All rights reserved.
 */
import { matchProperty } from '@/lib/ai/ai-client';

export default async function AI() {
  const rec = await matchProperty({ preferenceProfileId: 'pref-001', context: { market: 'ES', locale: 'en' } });
  const top = rec.data?.[0];

  return <main className='space-y-4'><h2 className='text-2xl'>AI Buyer Preference Intake</h2><div className='card'><p>Conversational intake placeholders for budget, lifestyle, family, privacy, security, airport distance, marina/golf/beach, school, religious/cultural/feng shui/superstition, sun/garden orientation, investment and rental goals.</p><p className='mt-2'>Recommendation: {top?.propertyId ?? 'p1'} score {top?.score ?? 90}% — {top?.reason ?? 'Fallback concierge recommendation.'}</p>{rec.degraded ? <p className='mt-2 text-sm'>AI service unavailable. Showing graceful mock fallback.</p> : null}</div></main>;
}
