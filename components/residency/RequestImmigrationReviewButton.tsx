'use client';

import { useState } from 'react';
import type { ResidencyOpportunity } from '@/lib/residency/rules';

export function RequestImmigrationReviewButton({
  propertyId,
  buyerNationality,
  opportunity
}: {
  propertyId: string;
  buyerNationality?: string | null;
  opportunity: ResidencyOpportunity;
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function requestReview() {
    setStatus('sending');
    setMessage('');

    const response = await fetch('/api/residency/review-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: propertyId,
        country: opportunity.country,
        residency_pathway: opportunity.pathwayKey,
        pathway_name: opportunity.pathwayName,
        rule_id: opportunity.ruleId,
        action_source: 'manual_review',
        buyer_nationality: buyerNationality || null,
        buyer_profile: { preferred_review_language: 'en' }
      })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus('error');
      setMessage(payload.error || 'We could not request a review right now.');
      return;
    }

    setStatus('sent');
    setMessage(payload.message || 'Your request has been sent to the immigration lawyer review workflow.');
  }

  return (
    <div className="space-y-3">
      <button
        className="inline-flex border border-gold bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-[#b99655] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === 'sending' || status === 'sent'}
        onClick={requestReview}
        type="button"
      >
        {status === 'sending' ? 'Requesting review' : 'Request Immigration Lawyer Review'}
      </button>
      {message ? (
        <p className={`text-xs leading-5 ${status === 'error' ? 'text-red-700' : 'text-taupe'}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
