'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { roleDashboardPath, roleLabels, type UserRole } from '@/lib/auth/roles';
import {
  assignRolesFromOnboarding,
  type OnboardingAnswers,
  type OnboardingIntent
} from '@/lib/onboarding/roleAssignment';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Question = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
};

const intentOptions: Array<{ id: OnboardingIntent; label: string; roles: UserRole[] }> = [
  { id: 'buy_property', label: 'Buy property', roles: ['buyer'] },
  { id: 'sell_property', label: 'Sell property', roles: ['seller'] },
  { id: 'rent_property', label: 'Rent property', roles: ['renter'] },
  { id: 'invest_real_estate', label: 'Invest in real estate', roles: ['investor'] },
  { id: 'represent_clients', label: 'Represent clients', roles: ['realtor'] },
  { id: 'legal_services', label: 'Offer legal services', roles: ['lawyer'] },
  { id: 'notary_services', label: 'Provide notary services', roles: ['notary'] },
  { id: 'photography_services', label: 'Offer photography services', roles: ['photographer'] },
  { id: 'explore_opportunities', label: 'Explore opportunities', roles: ['general'] }
];

const roleQuestions: Record<UserRole, Question[]> = {
  buyer: [
    { key: 'buyer_locations', label: 'Preferred countries, cities, or regions' },
    { key: 'buyer_budget', label: 'Budget range' },
    { key: 'buyer_property_type', label: 'Property type' },
    { key: 'buyer_bedrooms', label: 'Number of bedrooms', type: 'number' },
    { key: 'buyer_use', label: 'Personal use or investment', type: 'select', options: ['Personal use', 'Investment', 'Both'] },
    { key: 'buyer_timeline', label: 'Timeline' },
    { key: 'buyer_financing', label: 'Financing needed?', type: 'select', options: ['Yes', 'No', 'Not sure'] }
  ],
  renter: [
    { key: 'renter_locations', label: 'Preferred countries, cities, or regions' },
    { key: 'renter_budget', label: 'Monthly budget range' },
    { key: 'renter_property_type', label: 'Property type' },
    { key: 'renter_bedrooms', label: 'Number of bedrooms', type: 'number' },
    { key: 'renter_use', label: 'Personal use or investment', type: 'select', options: ['Personal use', 'Investment', 'Both'] },
    { key: 'renter_timeline', label: 'Timeline' },
    { key: 'renter_financing', label: 'Financing needed?', type: 'select', options: ['Yes', 'No', 'Not sure'] }
  ],
  seller: [
    { key: 'seller_location', label: 'Property location' },
    { key: 'seller_property_type', label: 'Property type' },
    { key: 'seller_estimated_value', label: 'Estimated value' },
    { key: 'seller_ownership_status', label: 'Ownership status' },
    { key: 'seller_has_realtor', label: 'Do you already have a realtor?', type: 'select', options: ['Yes', 'No'] },
    { key: 'seller_invite_realtor', label: 'Do you want to invite your realtor?', type: 'select', options: ['Yes', 'No', 'Later'] }
  ],
  investor: [
    { key: 'investor_regions', label: 'Preferred investment regions' },
    { key: 'investor_budget', label: 'Budget range' },
    { key: 'investor_roi', label: 'Expected ROI range' },
    { key: 'investor_strategy', label: 'Investment strategy', type: 'select', options: ['Short-term rental', 'Long-term rental', 'Capital appreciation', 'Mixed'] },
    { key: 'investor_risk', label: 'Risk profile', type: 'select', options: ['Conservative', 'Balanced', 'Opportunistic'] },
    { key: 'investor_asset_type', label: 'Preferred asset type' }
  ],
  realtor: [
    { key: 'realtor_type', label: 'Individual realtor or agency', type: 'select', options: ['Individual realtor', 'Agency'] },
    { key: 'realtor_company', label: 'Company name' },
    { key: 'realtor_registration', label: 'Chamber of Commerce / company registration number' },
    { key: 'realtor_regions', label: 'Operating countries / regions' },
    { key: 'realtor_team_size', label: 'Team size', type: 'number' },
    { key: 'realtor_specialization', label: 'Specialization' },
    { key: 'realtor_subscription', label: 'Subscription setup placeholder', type: 'select', options: ['Trial', 'Agency setup later'] }
  ],
  lawyer: [
    { key: 'lawyer_firm', label: 'Law firm name' },
    { key: 'lawyer_jurisdiction', label: 'Jurisdiction' },
    { key: 'lawyer_bar_number', label: 'Bar registration number' },
    { key: 'lawyer_specialization', label: 'Specialization' },
    { key: 'lawyer_countries', label: 'Countries served' }
  ],
  notary: [
    { key: 'notary_office', label: 'Notary office name' },
    { key: 'notary_jurisdiction', label: 'Jurisdiction' },
    { key: 'notary_registration', label: 'Registration number' },
    { key: 'notary_regions', label: 'Countries / regions served' }
  ],
  photographer: [
    { key: 'photographer_portfolio', label: 'Portfolio URL' },
    { key: 'photographer_regions', label: 'Service regions' },
    { key: 'photographer_pricing', label: 'Pricing model' },
    { key: 'photographer_drone', label: 'Drone availability', type: 'select', options: ['Yes', 'No'] },
    { key: 'photographer_equipment', label: 'Equipment level' },
    { key: 'photographer_luxury_experience', label: 'Luxury property experience', type: 'textarea' }
  ],
  general: [
    { key: 'general_interest', label: 'What are you interested in?', type: 'textarea' },
    { key: 'general_countries', label: 'Preferred countries' },
    { key: 'general_updates', label: 'Would you like to receive updates?', type: 'select', options: ['Yes', 'No'] }
  ],
  firm_owner: [],
  firm_admin: [],
  admin: [],
  super_admin: []
};

export function OnboardingFlow({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedIntents, setSelectedIntents] = useState<OnboardingIntent[]>([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguages, setPreferredLanguages] = useState('English');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedRoles = useMemo(
    () => assignRolesFromOnboarding({
      intents: selectedIntents,
      profile: { fullName, phone, preferredLanguages: preferredLanguages.split(',').map((item) => item.trim()) },
      details: answers
    }).roles,
    [answers, fullName, phone, preferredLanguages, selectedIntents]
  );

  const questions = selectedRoles.flatMap((role) => roleQuestions[role] || []);
  const progress = Math.round(((step + 1) / 3) * 100);

  function toggleIntent(intent: OnboardingIntent) {
    setSelectedIntents((current) =>
      current.includes(intent) ? current.filter((item) => item !== intent) : [...current, intent]
    );
  }

  async function save(status: 'in_progress' | 'complete') {
    setIsSaving(true);
    setMessage(status === 'complete' ? 'Creating your private Viyra workspace...' : 'Progress saved.');

    const payload: OnboardingAnswers = {
      intents: selectedIntents,
      profile: {
        fullName,
        phone,
        preferredLanguages: preferredLanguages.split(',').map((item) => item.trim()).filter(Boolean)
      },
      details: answers
    };
    const assignment = assignRolesFromOnboarding(payload);
    const supabase = createSupabaseBrowserClient() as any;
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: user.id,
      email: user.email || userEmail,
      full_name: fullName,
      phone,
      role: assignment.primaryRole,
      country: answers.buyer_locations || answers.seller_location || answers.general_countries || null,
      preferred_language: payload.profile.preferredLanguages[0] || 'English',
      onboarding_status: status
    });

    if (profileError) {
      setMessage(profileError.message);
      setIsSaving(false);
      return;
    }

    await supabase.from('user_roles').delete().eq('user_id', user.id);
    await supabase.from('user_roles').insert(
      assignment.roles.map((role) => ({
        user_id: user.id,
        role,
        is_primary: role === assignment.primaryRole,
        status: 'active'
      }))
    );

    await supabase.from('onboarding_answers').upsert({
      user_id: user.id,
      answers: payload,
      assigned_roles: assignment.roles,
      status
    });

    setIsSaving(false);

    if (status === 'complete') {
      router.push(roleDashboardPath[assignment.primaryRole] as any);
      return;
    }

    setMessage('Your onboarding progress is saved. You can continue when ready.');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }
    await save('complete');
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <div className="border border-black/10 bg-white p-6">
        <div className="mb-3 h-1 bg-black/10">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-taupe">
          Step {step + 1} of 3
        </p>
      </div>

      {step === 0 ? (
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Your Intent
          </p>
          <h2 className="font-display mb-6 text-3xl">What would you like to do on Viyra?</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {intentOptions.map((option) => (
              <button
                className={`border px-4 py-4 text-left text-sm transition ${
                  selectedIntents.includes(option.id)
                    ? 'border-gold bg-ivory text-black'
                    : 'border-black/10 bg-white text-black hover:border-gold'
                }`}
                key={option.id}
                onClick={() => toggleIntent(option.id)}
                type="button"
              >
                <span className="font-semibold">{option.label}</span>
                <span className="mt-2 block text-xs text-taupe">
                  {option.roles.map((role) => roleLabels[role]).join(', ')}
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="grid gap-4 border border-black/10 bg-white p-7 md:grid-cols-2">
          <p className="md:col-span-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Private Profile
          </p>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Full name</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(event) => setFullName(event.target.value)} required value={fullName} />
          </label>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Phone</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(event) => setPhone(event.target.value)} value={phone} />
          </label>
          <label className="md:col-span-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Preferred languages</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(event) => setPreferredLanguages(event.target.value)} value={preferredLanguages} />
          </label>
          <p className="md:col-span-2 text-sm leading-7 text-taupe">
            Your profile evolves based on your preferences, activity, and verified information.
          </p>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="grid gap-4 border border-black/10 bg-white p-7 md:grid-cols-2">
          <p className="md:col-span-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Preferences And Verification
          </p>
          {questions.map((question) => (
            <label className={question.type === 'textarea' ? 'md:col-span-2' : ''} key={question.key}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">{question.label}</span>
              {question.type === 'select' ? (
                <select className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: event.target.value }))} value={answers[question.key] || ''}>
                  <option value="">Select</option>
                  {question.options?.map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : question.type === 'textarea' ? (
                <textarea className="mt-2 min-h-28 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: event.target.value }))} value={answers[question.key] || ''} />
              ) : (
                <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: event.target.value }))} type={question.type || 'text'} value={answers[question.key] || ''} />
              )}
            </label>
          ))}
        </section>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button className="border border-black/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black disabled:opacity-40" disabled={step === 0 || isSaving} onClick={() => setStep((current) => Math.max(0, current - 1))} type="button">
          Back
        </button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="border border-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black disabled:opacity-40" disabled={isSaving || selectedIntents.length === 0} onClick={() => save('in_progress')} type="button">
            Save and continue later
          </button>
          <button className="bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black disabled:opacity-40" disabled={isSaving || selectedIntents.length === 0} type="submit">
            {step === 2 ? 'Complete onboarding' : 'Continue'}
          </button>
        </div>
      </div>
      {message ? <p className="text-sm text-taupe">{message}</p> : null}
    </form>
  );
}
