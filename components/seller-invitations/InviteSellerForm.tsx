'use client';

import { FormEvent, useState } from 'react';

const representationTypes = [
  ['exclusive_listing', 'Exclusive listing'],
  ['co_listing', 'Co-listing'],
  ['referral_introduction', 'Referral introduction'],
  ['buyer_side_introduction', 'Buyer-side introduction'],
  ['platform_assisted_listing', 'Platform-assisted listing']
] as const;

const privacyModes = [
  ['public', 'Public luxury listing'],
  ['qualified_buyers_only', 'Qualified buyers only'],
  ['off_market', 'Off-market / private listing']
] as const;

export function InviteSellerForm() {
  const [inviteLink, setInviteLink] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('Creating secure invitation...');
    setInviteLink('');

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch('/api/realtor/seller-invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        estimated_property_value: Number(payload.estimated_property_value || 0),
        commission_percentage: Number(payload.commission_percentage || 3),
        platform_fee_percentage: Number(payload.platform_fee_percentage || 0)
      })
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result.error || 'Invitation could not be created.');
      return;
    }

    setInviteLink(result.inviteLink);
    setMessage('Secure seller invitation created.');
  }

  return (
    <form className="grid gap-5 border border-black/10 bg-white p-7 md:grid-cols-2" onSubmit={submit}>
      {[
        ['seller_full_name', 'Seller full name', 'text'],
        ['seller_email', 'Seller email', 'email'],
        ['seller_phone', 'WhatsApp / phone', 'text'],
        ['property_address', 'Property address', 'text'],
        ['city', 'City', 'text'],
        ['country', 'Country', 'text'],
        ['estimated_property_value', 'Estimated property value', 'number'],
        ['property_type', 'Property type', 'text']
      ].map(([name, label, type]) => (
        <label key={name}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">{label}</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" name={name} required={name !== 'seller_phone'} type={type} />
        </label>
      ))}

      <label>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Preferred privacy mode</span>
        <select className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" name="preferred_privacy_mode">
          {privacyModes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>

      <label>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Representation type</span>
        <select className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" name="representation_type">
          {representationTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>

      <label>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Commission model</span>
        <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" defaultValue="percentage" name="commission_model" />
      </label>

      <label>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Commission percentage</span>
        <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" defaultValue={3} min={0} name="commission_percentage" step="0.01" type="number" />
      </label>

      <label className="md:col-span-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Optional personal message</span>
        <textarea className="mt-2 min-h-32 w-full border border-black/10 bg-porcelain px-4 py-3" name="personal_message" />
      </label>

      <div className="md:col-span-2 border border-gold/30 bg-gold/10 p-4 text-sm leading-7 text-black/70">
        The secure token is shown once after creation. The database stores only its SHA-256 hash and
        uses this invitation as the permanent attribution anchor.
      </div>

      <button className="bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black disabled:opacity-60" disabled={isSubmitting} type="submit">
        Create secure invite link
      </button>

      <div className="md:col-span-2 text-sm text-taupe">
        {message ? <p>{message}</p> : null}
        {inviteLink ? (
          <p className="mt-3 break-all border border-black/10 bg-porcelain p-4 font-semibold text-black">{inviteLink}</p>
        ) : null}
      </div>
    </form>
  );
}
