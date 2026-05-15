'use client';

import { useState, type FormEvent } from 'react';

const neutralSuccess =
  "Your request has been sent. If the Realtor is already on Viyra, they can review it. Otherwise, they'll receive an invitation to join.";

export function PhotographerRealtorRequest() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      photographer_name: String(formData.get('photographer_name') || '').trim(),
      photographer_email: String(formData.get('photographer_email') || '').trim(),
      realtor_name: String(formData.get('realtor_name') || '').trim(),
      realtor_email: String(formData.get('realtor_email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      company: String(formData.get('company') || '').trim()
    };

    try {
      const response = await fetch('/api/photography/realtor-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Please check the details and try again.');
        return;
      }

      setMessage(neutralSuccess);
      event.currentTarget.reset();
    } catch {
      setError('We could not send the request right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        className="mt-10 inline-flex border border-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-gold transition hover:bg-gold hover:text-black"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Request Access Through a Realtor
      </button>

      {isOpen ? (
        <div aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8 backdrop-blur-sm" role="dialog">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-gold/25 bg-[#f8f4ec] p-6 text-[#17110d] shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Curated Photographer Access
                </p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">Ask your Realtor to invite you.</h2>
              </div>
              <button
                aria-label="Cancel"
                className="border border-black/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-white"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </div>

            <p className="mt-5 text-sm leading-7 text-taupe">
              Photographers join Viyra through trusted Realtor partnerships. Enter the Realtor you work with and we'll notify them about Viyra. If they are already a member, they can approve your request. If they are not yet a member, they'll receive an invitation to join and invite you as a photographer.
            </p>

            <form className="mt-7 grid gap-4 md:grid-cols-2" onSubmit={submit}>
              <input className="hidden" name="company" tabIndex={-1} autoComplete="off" />
              <Field label="Photographer name" name="photographer_name" required />
              <Field label="Photographer email" name="photographer_email" required type="email" />
              <Field label="Realtor name" name="realtor_name" />
              <Field label="Realtor email" name="realtor_email" required type="email" />
              <label className="md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Short message, optional</span>
                <textarea
                  className="mt-2 min-h-28 w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-gold"
                  maxLength={1000}
                  name="message"
                />
              </label>
              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#d3b777] disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Sending...' : 'Send Request to Realtor'}
                </button>
                <button
                  className="border border-black/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-white"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Cancel
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
