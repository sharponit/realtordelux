'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { roleDashboardPath, type UserRole } from '@/lib/auth/roles';

const roleOptions: Array<{ role: UserRole; label: string; path: string }> = [
  { role: 'buyer', label: 'Individual buyer', path: 'buyer_seller' },
  { role: 'seller', label: 'Individual seller', path: 'buyer_seller' },
  { role: 'realtor', label: 'Realtor', path: 'professional' },
  { role: 'photographer', label: 'Photographer', path: 'photographer' },
  { role: 'lawyer', label: 'Lawyer', path: 'professional' },
  { role: 'notary', label: 'Notary', path: 'professional' },
  { role: 'firm_owner', label: 'Firm owner', path: 'firm_owner' },
  { role: 'firm_admin', label: 'Invited firm user', path: 'invited_user' }
];

export function OnboardingFlow({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('buyer');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Spain');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [phone, setPhone] = useState('');
  const [intent, setIntent] = useState('Private client dashboard');
  const [firmName, setFirmName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [licenseSeats, setLicenseSeats] = useState(1);
  const [city, setCity] = useState('');
  const [operatingRadius, setOperatingRadius] = useState(50);
  const [basePrice, setBasePrice] = useState(500);
  const [droneAvailable, setDroneAvailable] = useState(false);
  const [message, setMessage] = useState('');
  const selectedPath = useMemo(() => roleOptions.find((item) => item.role === role)?.path, [role]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Completing secure onboarding...');
    const supabase = createSupabaseBrowserClient() as any;
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage('Session expired. Please sign in again.');
      router.push('/login');
      return;
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: user.id,
      email: user.email || userEmail,
      full_name: fullName,
      phone,
      role,
      country,
      preferred_language: preferredLanguage,
      onboarding_status: selectedPath === 'firm_owner' || selectedPath === 'professional' || selectedPath === 'photographer' ? 'pending_verification' : 'complete'
    });

    if (profileError) {
      setMessage(profileError.message);
      return;
    }

    if (selectedPath === 'firm_owner') {
      const { data: firm, error: firmError } = await supabase
        .from('firms')
        .insert({
          name: firmName || `${fullName} Firm`,
          legal_name: firmName,
          chamber_of_commerce_country: country,
          registration_number: registrationNumber,
          vat_number: vatNumber,
          firm_type: 'mixed_services',
          country,
          license_seats: licenseSeats,
          verification_status: 'pending',
          subscription_status: 'trial'
        })
        .select('id')
        .single();

      if (firmError) {
        setMessage(firmError.message);
        return;
      }

      await supabase.from('firm_users').insert({
        firm_id: firm.id,
        user_id: user.id,
        role_in_firm: 'owner',
        platform_role: role,
        status: 'active'
      });

      await fetch('/api/verification/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          firmId: firm.id,
          country,
          registrationNumber,
          vatNumber,
          firmName,
          professionType: 'firm'
        })
      });
    }

    if (selectedPath === 'photographer') {
      const photographerPrice = Number(basePrice) || 0;
      const viyraServiceFee = Number((photographerPrice * 0.03).toFixed(2));

      const { error: photographerError } = await supabase.from('photographer_profiles').upsert({
        user_id: user.id,
        display_name: fullName,
        email: user.email || userEmail,
        phone,
        country,
        city,
        operating_radius_km: operatingRadius,
        languages: [preferredLanguage],
        drone_available: droneAvailable,
        real_estate_experience: intent,
        base_price: photographerPrice,
        viyra_service_fee_rate: 0.03,
        verification_status: 'pending',
        active_status: 'active'
      });

      if (photographerError) {
        setMessage(photographerError.message);
        return;
      }

      await supabase.from('photographer_pricing').upsert({
        user_id: user.id,
        interior_price: photographerPrice,
        exterior_price: photographerPrice,
        drone_price: droneAvailable ? 250 : 0,
        twilight_price: 180,
        video_walkthrough_price: 350,
        tour_360_price: 300,
        floorplan_scan_price: 200,
        viyra_service_fee_rate: 0.03,
        calculated_service_fee: viyraServiceFee,
        calculated_customer_total: photographerPrice + viyraServiceFee
      });
    }

    setMessage('Onboarding saved. Opening your private dashboard...');
    router.push(roleDashboardPath[role] as any);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <section className="border border-black/10 bg-white p-7">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          Account Type
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {roleOptions.map((option) => (
            <button
              className={`border px-4 py-4 text-left text-sm transition ${
                role === option.role ? 'border-gold bg-ivory' : 'border-black/10 bg-white'
              }`}
              key={option.role}
              onClick={() => setRole(option.role)}
              type="button"
            >
              <span className="font-semibold">{option.label}</span>
              <span className="mt-1 block text-xs text-taupe">{option.path.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 border border-black/10 bg-white p-7 md:grid-cols-2">
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Full name</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setFullName(e.target.value)} required value={fullName} />
        </label>
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Phone</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setPhone(e.target.value)} value={phone} />
        </label>
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Country</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setCountry(e.target.value)} required value={country} />
        </label>
        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Preferred language</span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setPreferredLanguage(e.target.value)} required value={preferredLanguage} />
        </label>
        <label className="md:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
            Buying/selling intent or professional focus
          </span>
          <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setIntent(e.target.value)} value={intent} />
        </label>
      </section>

      {selectedPath === 'professional' || selectedPath === 'firm_owner' ? (
        <section className="grid gap-4 border border-black/10 bg-white p-7 md:grid-cols-2">
          <p className="md:col-span-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Verify professional status
          </p>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Firm name</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setFirmName(e.target.value)} value={firmName} />
          </label>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Professional registry / Chamber number</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setRegistrationNumber(e.target.value)} value={registrationNumber} />
          </label>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">VAT number</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setVatNumber(e.target.value)} value={vatNumber} />
          </label>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">License seats</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" min={1} onChange={(e) => setLicenseSeats(Number(e.target.value))} type="number" value={licenseSeats} />
          </label>
        </section>
      ) : null}

      {selectedPath === 'photographer' ? (
        <section className="grid gap-4 border border-black/10 bg-white p-7 md:grid-cols-2">
          <p className="md:col-span-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Photographer profile setup
          </p>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">City / operating base</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" onChange={(e) => setCity(e.target.value)} required value={city} />
          </label>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Operating radius in km</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" min={1} onChange={(e) => setOperatingRadius(Number(e.target.value))} type="number" value={operatingRadius} />
          </label>
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">Base price</span>
            <input className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-3" min={0} onChange={(e) => setBasePrice(Number(e.target.value))} type="number" value={basePrice} />
          </label>
          <label className="flex items-center gap-3 pt-7 text-sm text-taupe">
            <input checked={droneAvailable} onChange={(e) => setDroneAvailable(e.target.checked)} type="checkbox" />
            Drone photography available with certification upload later
          </label>
          <div className="md:col-span-2 border border-gold/30 bg-gold/10 p-4 text-sm leading-7 text-black/70">
            Customer total preview: photographer fee €{basePrice.toLocaleString()} + VIYRA service fee
            €{(basePrice * 0.03).toFixed(2)} = €{(basePrice * 1.03).toFixed(2)}.
          </div>
        </section>
      ) : null}

      <button className="bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black" type="submit">
        Complete onboarding
      </button>
      {message ? <p className="text-sm text-taupe">{message}</p> : null}
    </form>
  );
}
