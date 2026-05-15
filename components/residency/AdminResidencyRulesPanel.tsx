'use client';

import { useMemo, useState } from 'react';
import { RESIDENCY_DISCLAIMER, defaultResidencyRules, type ResidencyRule } from '@/lib/residency/rules';

export function AdminResidencyRulesPanel({ initialRules }: { initialRules?: ResidencyRule[] }) {
  const rules = useMemo(() => initialRules?.length ? initialRules : defaultResidencyRules, [initialRules]);
  const [selectedRule, setSelectedRule] = useState<ResidencyRule>(rules[0]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function saveRule(formData: FormData) {
    setStatus('saving');
    setMessage('');

    const response = await fetch('/api/residency/rules', {
      method: 'POST',
      body: JSON.stringify({
        id: selectedRule.id,
        country: String(formData.get('country') || selectedRule.country),
        country_code: String(formData.get('country_code') || selectedRule.countryCode),
        pathway_key: selectedRule.pathwayKey,
        pathway_name: String(formData.get('pathway_name') || selectedRule.pathwayName),
        status: String(formData.get('status') || selectedRule.status),
        min_property_value: Number(formData.get('min_property_value') || selectedRule.minPropertyValue),
        currency: String(formData.get('currency') || selectedRule.currency),
        summary: String(formData.get('summary') || selectedRule.summary),
        disclaimer: RESIDENCY_DISCLAIMER,
        multilingual_content: selectedRule.multilingualContent,
        luxury_markets: selectedRule.luxuryMarkets
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus('error');
      setMessage(payload.error || 'Rule could not be saved.');
      return;
    }

    setStatus('saved');
    setMessage('Rule saved for admin/legal review management.');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="space-y-3">
        {rules.map((rule) => (
          <button
            className={`w-full border p-5 text-left transition ${
              selectedRule.id === rule.id
                ? 'border-gold bg-[#171717] text-white'
                : 'border-black/10 bg-white text-black hover:border-gold'
            }`}
            key={rule.id}
            onClick={() => {
              setSelectedRule(rule);
              setStatus('idle');
              setMessage('');
            }}
            type="button"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {rule.countryCode} / {rule.status}
            </p>
            <h2 className="mt-2 font-display text-2xl">{rule.country}</h2>
            <p className={`mt-2 text-sm leading-6 ${selectedRule.id === rule.id ? 'text-white/65' : 'text-taupe'}`}>
              {rule.pathwayName}
            </p>
          </button>
        ))}
      </div>

      <form
        className="border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(23,23,23,0.07)]"
        onSubmit={(event) => {
          event.preventDefault();
          saveRule(new FormData(event.currentTarget));
        }}
      >
        <div className="border-b border-black/10 pb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Rule management
          </p>
          <h2 className="mt-2 font-display text-3xl">{selectedRule.pathwayName}</h2>
          <p className="mt-3 text-sm leading-6 text-taupe">
            Admins and legal partners can tune country rules, thresholds, active status, and
            multilingual alert copy. Alerts remain informational and route review requests to
            immigration lawyer profiles.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black">
            Country
            <input className="border border-black/10 px-4 py-3 text-sm font-normal normal-case tracking-normal" defaultValue={selectedRule.country} name="country" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black">
            Country code
            <input className="border border-black/10 px-4 py-3 text-sm font-normal normal-case tracking-normal" defaultValue={selectedRule.countryCode} name="country_code" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black">
            Status
            <select className="border border-black/10 px-4 py-3 text-sm font-normal normal-case tracking-normal" defaultValue={selectedRule.status} name="status">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black">
            Currency
            <input className="border border-black/10 px-4 py-3 text-sm font-normal normal-case tracking-normal" defaultValue={selectedRule.currency} name="currency" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black md:col-span-2">
            Minimum property value
            <input className="border border-black/10 px-4 py-3 text-sm font-normal normal-case tracking-normal" defaultValue={selectedRule.minPropertyValue} min={0} name="min_property_value" type="number" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black md:col-span-2">
            Pathway name
            <input className="border border-black/10 px-4 py-3 text-sm font-normal normal-case tracking-normal" defaultValue={selectedRule.pathwayName} name="pathway_name" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black md:col-span-2">
            Informational summary
            <textarea className="min-h-28 border border-black/10 px-4 py-3 text-sm font-normal normal-case leading-6 tracking-normal" defaultValue={selectedRule.summary} name="summary" />
          </label>
        </div>

        <p className="mt-5 border border-gold/40 bg-porcelain p-4 text-xs leading-5 text-taupe">
          {RESIDENCY_DISCLAIMER}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-[#b99655]" disabled={status === 'saving'} type="submit">
            {status === 'saving' ? 'Saving rule' : 'Save rule'}
          </button>
          {message ? (
            <p className={`text-xs ${status === 'error' ? 'text-red-700' : 'text-taupe'}`}>{message}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
