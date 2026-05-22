'use client';

import { useMemo, useState, type FormEvent } from 'react';

const successMessage =
  'Your request has been shared with selected Viyra Realtors in your chosen region. Qualified professionals can now respond with tailored service proposals. You stay in control of who you choose to continue with.';

const countryCities: Record<string, string[]> = {
  France: ['Cannes', 'Monaco Region', 'Saint-Tropez'],
  Morocco: ['Casablanca', 'Dakhla', 'Marrakech', 'Rabat', 'Tangier'],
  Portugal: ['Algarve', 'Lisbon', 'Porto'],
  Spain: ['Barcelona', 'Benahavis', 'Estepona', 'Ibiza', 'Madrid', 'Marbella'],
  UAE: ['Abu Dhabi', 'Dubai', 'Dubai Hills', 'Emirates Hills', 'Palm Jumeirah']
};

const propertyTypes = [
  'Apartment',
  'Beachfront Home',
  'Golf Estate',
  'Investment Property',
  'Mansion',
  'New Development',
  'Penthouse',
  'Private Compound',
  'Villa'
];

const budgetRanges = [
  { label: 'Undecided', min: '', max: '' },
  { label: 'Up to EUR 500K', min: '', max: '500000' },
  { label: 'EUR 500K - EUR 1M', min: '500000', max: '1000000' },
  { label: 'EUR 1M - EUR 3M', min: '1000000', max: '3000000' },
  { label: 'EUR 3M - EUR 5M', min: '3000000', max: '5000000' },
  { label: 'EUR 5M - EUR 10M', min: '5000000', max: '10000000' },
  { label: 'EUR 10M+', min: '10000000', max: '' }
];

const specialRequirements = [
  'Beachfront',
  'Crypto accepted',
  'Family-friendly',
  'Gated community',
  'Golden visa eligible',
  'Golf front',
  'High rental yield',
  'Islamic finance compatible',
  'Near international schools',
  'New construction',
  'Privacy focused',
  'Sea view'
];

export function BuyerRequestForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const cityOptions = useMemo(() => (country ? countryCities[country] || [] : []), [country]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    const formData = new FormData(event.currentTarget);
    const budget = budgetRanges.find((range) => range.label === formData.get('budget_range'));
    const payload = {
      full_name: String(formData.get('full_name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      preferred_contact_method: String(formData.get('preferred_contact_method') || '').trim(),
      preferred_language: String(formData.get('preferred_language') || '').trim(),
      country: String(formData.get('country') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      region: String(formData.get('region') || '').trim(),
      property_type: String(formData.get('property_type') || '').trim(),
      budget_min: budget?.min || null,
      budget_max: budget?.max || null,
      budget_label: budget?.label || '',
      timeline: String(formData.get('timeline') || '').trim(),
      buying_purpose: String(formData.get('buying_purpose') || '').trim(),
      financing_needed: String(formData.get('financing_needed') || '').trim(),
      special_requirements: formData.getAll('special_requirements').map(String),
      message: String(formData.get('message') || '').trim(),
      company: String(formData.get('company') || '').trim()
    };

    try {
      const response = await fetch('/api/buyer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Please check the brief and try again.');
        return;
      }

      setMessage(successMessage);
      event.currentTarget.reset();
      setCountry('');
    } catch {
      setError('We could not submit your buying brief right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        className="mt-7 inline-flex bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#b99655] focus:outline-none focus:ring-2 focus:ring-gold/60"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Buy with Viyra
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          role="dialog"
        >
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-gold/25 bg-[#f8f4ec] px-6 pb-7 pt-9 text-[#17110d] shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:px-9 md:pb-9 md:pt-11">
            <button
              aria-label="Close buyer request form"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-black/10 text-lg leading-none text-black transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-gold/60"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                Share Your Buying Brief
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-5xl">Let selected Viyra Realtors respond.</h2>
              <p className="mt-5 text-sm leading-7 text-taupe">
                Tell us what and where you want to buy. We prepare a controlled lead summary for qualified regional
                Realtors while keeping your contact details private until there is a selected next step.
              </p>
            </div>

            <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={submit}>
              <input className="hidden" name="company" tabIndex={-1} autoComplete="off" />
              <Field label="Full name" name="full_name" required />
              <Field label="Email" name="email" required type="email" />
              <Field label="Phone number, optional" name="phone" type="tel" />
              <Select label="Preferred contact method" name="preferred_contact_method" required options={['Email', 'Phone', 'WhatsApp']} />
              <Select label="Preferred language" name="preferred_language" required options={['English', 'Spanish', 'Dutch', 'French', 'Arabic']} />
              <Select label="Country" name="country" onChange={setCountry} required options={Object.keys(countryCities)} />
              <Select label="City / region" name="city" required options={cityOptions} placeholder={country ? 'Select city or region' : 'Select country first'} />
              <Field label="Region, optional" name="region" />
              <Select label="Property type" name="property_type" required options={propertyTypes} />
              <Select label="Budget range" name="budget_range" required options={budgetRanges.map((range) => range.label)} />
              <Select label="Timeline" name="timeline" required options={['As soon as possible', '1 - 3 months', '3 - 6 months', '6 - 12 months', 'Exploring quietly']} />
              <Select label="Buying purpose" name="buying_purpose" required options={['Personal use', 'Investment', 'Relocation', 'Second home']} />
              <Select label="Financing needed?" name="financing_needed" required options={['Yes', 'No', 'Undecided']} />

              <fieldset className="md:col-span-2">
                <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
                  Special requirements, optional
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {specialRequirements.map((item) => (
                    <label className="flex items-center gap-3 border border-black/10 bg-white px-3 py-3 text-sm text-black" key={item}>
                      <input className="accent-[#b99655]" name="special_requirements" type="checkbox" value={item} />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
                  Tell us what your ideal property looks like
                </span>
                <textarea
                  className="mt-2 min-h-28 w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-gold"
                  maxLength={1200}
                  name="message"
                />
              </label>

              <div className="flex justify-center pt-2 md:col-span-2">
                <button
                  className="w-full bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#b99655] focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:opacity-60 sm:w-auto sm:min-w-80"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Sharing Brief...' : 'Share Buying Brief'}
                </button>
              </div>
            </form>

            {message ? <p className="mt-5 border border-gold/30 bg-gold/10 p-4 text-sm leading-7 text-black/70">{message}</p> : null}
            {error ? <p className="mt-5 border border-red-900/20 bg-red-50 p-4 text-sm leading-7 text-red-900">{error}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Field({
  label,
  name,
  required = false,
  type = 'text'
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">{label}</span>
      <input
        className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-gold"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  placeholder = 'Select one',
  required = false,
  onChange
}: {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">{label}</span>
      <select
        className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-gold"
        name={name}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
