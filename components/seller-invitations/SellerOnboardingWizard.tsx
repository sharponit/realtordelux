'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SellerInvitationPreview } from '@/lib/seller-invitations/types';

const featureFields = [
  'pool',
  'spa_wellness_area',
  'cinema_room',
  'gym',
  'wine_cellar',
  'smart_home_system',
  'security_system',
  'sea_view',
  'mountain_view',
  'golf_access',
  'marina_access'
];

export function SellerOnboardingWizard({
  token,
  invitation
}: {
  token: string;
  invitation: SellerInvitationPreview;
}) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('Submitting property for realtor review...');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const amenity_flags = Object.fromEntries(featureFields.map((field) => [field, form.get(field) === 'on']));

    const response = await fetch(`/api/seller/invitations/${token}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        seller_type: payload.seller_type || 'individual',
        living_area_sqm: Number(payload.living_area_sqm || 0),
        plot_size_sqm: Number(payload.plot_size_sqm || 0),
        bedrooms: Number(payload.bedrooms || 0),
        bathrooms: Number(payload.bathrooms || 0),
        staff_rooms: Number(payload.staff_rooms || 0),
        garage_spaces: Number(payload.garage_spaces || 0),
        luxury_features: String(payload.luxury_features || '').split(',').map((item) => item.trim()).filter(Boolean),
        media_urls: String(payload.media_urls || '').split(',').map((item) => item.trim()).filter(Boolean),
        request_certified_photographer: payload.request_certified_photographer === 'on',
        seller_refuses_attribution: payload.seller_refuses_attribution === 'on',
        amenity_flags
      })
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result.error || 'The property could not be submitted.');
      return;
    }

    setMessage('Property submitted. Your realtor can now review the listing draft.');
    router.push('/dashboard/seller' as any);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <section className="border border-black/10 bg-white p-7">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          Private property onboarding
        </p>
        <h2 className="font-display text-3xl">{invitation.property_address}</h2>
        <p className="mt-3 text-sm text-taupe">{invitation.city}, {invitation.country}</p>
      </section>

      <section className="grid gap-4 border border-black/10 bg-white p-7 md:grid-cols-2">
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Ownership name</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" defaultValue={invitation.seller_full_name} name="ownership_name" required />
        </label>
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Seller type</span>
          <select className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" name="seller_type">
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </label>
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Title deed URL</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" name="title_deed_url" />
        </label>
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">ID / passport / company document URL</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" name="identity_document_url" />
        </label>
        <label className="md:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Privacy mode</span>
          <select className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" defaultValue={invitation.preferred_privacy_mode || 'qualified_buyers_only'} name="privacy_mode">
            <option value="public">Public luxury listing</option>
            <option value="qualified_buyers_only">Qualified buyers only</option>
            <option value="off_market">Off-market / private listing</option>
          </select>
        </label>
      </section>

      <section className="grid gap-4 border border-black/10 bg-white p-7 md:grid-cols-3">
        {[
          ['living_area_sqm', 'Living area sqm'],
          ['plot_size_sqm', 'Plot size sqm'],
          ['bedrooms', 'Bedrooms'],
          ['bathrooms', 'Bathrooms'],
          ['staff_rooms', 'Staff rooms'],
          ['garage_spaces', 'Garage spaces']
        ].map(([name, label]) => (
          <label key={name}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">{label}</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" min={0} name={name} type="number" />
          </label>
        ))}
      </section>

      <section className="border border-black/10 bg-white p-7">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          Mansion features
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {featureFields.map((field) => (
            <label className="flex items-center gap-3 bg-porcelain px-4 py-3 text-sm text-taupe" key={field}>
              <input name={field} type="checkbox" />
              {field.replaceAll('_', ' ')}
            </label>
          ))}
        </div>
        <label className="mt-5 block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Luxury features, comma separated</span>
          <textarea className="mt-2 min-h-28 w-full border border-black/10 bg-porcelain px-4 py-3" name="luxury_features" />
        </label>
        <label className="mt-5 block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Existing media URLs, comma separated</span>
          <textarea className="mt-2 min-h-24 w-full border border-black/10 bg-porcelain px-4 py-3" name="media_urls" />
        </label>
        <label className="mt-5 flex items-center gap-3 text-sm text-taupe">
          <input name="request_certified_photographer" type="checkbox" />
          Request certified VIYRA photographer
        </label>
      </section>

      <section className="border border-gold/30 bg-gold/10 p-5 text-sm leading-7 text-black/70">
        This invitation permanently anchors seller, property, listing, offer, sale, and commission
        attribution to the inviting realtor. Refusing attribution blocks this invitation flow.
        <label className="mt-4 flex items-center gap-3">
          <input name="seller_refuses_attribution" type="checkbox" />
          Seller refuses attribution
        </label>
      </section>

      <button className="bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black disabled:opacity-60" disabled={isSubmitting} type="submit">
        Submit for realtor review
      </button>
      {message ? <p className="text-sm text-taupe">{message}</p> : null}
    </form>
  );
}
