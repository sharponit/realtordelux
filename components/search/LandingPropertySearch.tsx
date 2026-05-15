'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const transactionTypes = [
  ['Any purpose', ''],
  ['Buy', 'sale'],
  ['Rent', 'rent'],
  ['New Developments', 'new_development']
] as const;

const countryCities: Record<string, string[]> = {
  Spain: ['Marbella', 'Benahavis', 'Estepona', 'Ibiza', 'Madrid', 'Barcelona'],
  UAE: ['Dubai', 'Abu Dhabi', 'Palm Jumeirah', 'Dubai Hills', 'Emirates Hills'],
  Morocco: ['Dakhla', 'Casablanca', 'Rabat', 'Marrakech', 'Tangier'],
  Portugal: ['Lisbon', 'Algarve', 'Porto'],
  France: ['Cannes', 'Monaco Region', 'Saint-Tropez']
};

const propertyTypes = [
  '',
  'Villa',
  'Mansion',
  'Penthouse',
  'Apartment',
  'Beachfront Home',
  'Golf Estate',
  'New Development',
  'Private Compound',
  'Investment Property'
];

const budgetRanges = [
  { label: 'Any budget', min: '', max: '' },
  { label: 'Up to €500K', min: '', max: '500000' },
  { label: '€500K - €1M', min: '500000', max: '1000000' },
  { label: '€1M - €3M', min: '1000000', max: '3000000' },
  { label: '€3M - €5M', min: '3000000', max: '5000000' },
  { label: '€5M - €10M', min: '5000000', max: '10000000' },
  { label: '€10M+', min: '10000000', max: '' }
];

const lifestyles = [
  '',
  'Sea View',
  'Beachfront',
  'Golf Front',
  'Gated Community',
  'Private Pool',
  'Smart Home',
  'Golden Visa Eligible',
  'Crypto Accepted',
  'High Rental Yield',
  'Privacy Focused'
];

export function LandingPropertySearch() {
  const router = useRouter();
  const [listingType, setListingType] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budgetIndex, setBudgetIndex] = useState(0);
  const [lifestyle, setLifestyle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const cityOptions = useMemo(() => (country ? countryCities[country] || [] : []), [country]);

  function updateCountry(value: string) {
    setCountry(value);
    setCity('');
  }

  function submit() {
    const params = new URLSearchParams();
    const budget = budgetRanges[budgetIndex];

    if (listingType) params.set('listing_type', listingType);
    if (country) params.set('country', country);
    if (city) {
      if (city === 'Monaco Region') {
        params.set('region', city);
      } else {
        params.set('city', city);
      }
    }
    if (propertyType) params.set('property_type', propertyType);
    if (budget.min) params.set('min_price', budget.min);
    if (budget.max) params.set('max_price', budget.max);
    if (lifestyle) params.set('lifestyle', lifestyle);

    setIsLoading(true);
    router.push(params.toString() ? `/search?${params.toString()}` : '/search');
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      <div className="grid max-w-4xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        <LuxurySelect isPlaceholder={!listingType} label="Transaction Type" onChange={setListingType} value={listingType}>
          {transactionTypes.map(([label, value]) => (
            <option key={label} value={value}>{label}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect isPlaceholder={!country} label="Country" onChange={updateCountry} value={country}>
          <option value="">Any country</option>
          {Object.keys(countryCities).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect isPlaceholder={!city} label="City / Region" onChange={setCity} value={city}>
          <option value="">Any city or region</option>
          {cityOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect isPlaceholder={!propertyType} label="Property Type" onChange={setPropertyType} value={propertyType}>
          <option value="">Any property</option>
          {propertyTypes.filter(Boolean).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect isPlaceholder={budgetIndex === 0} label="Budget Range" onChange={(value) => setBudgetIndex(Number(value))} value={String(budgetIndex)}>
          {budgetRanges.map((range, index) => (
            <option key={range.label} value={index}>{range.label}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect isPlaceholder={!lifestyle} label="Lifestyle Preference" onChange={setLifestyle} value={lifestyle}>
          <option value="">Any lifestyle</option>
          {lifestyles.filter(Boolean).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>
      </div>

      <div className="flex justify-stretch md:justify-end xl:self-stretch">
        <button
          className="min-h-12 w-full bg-gold/92 px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_12px_34px_rgba(200,169,107,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d3b777] focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-[#11100e] disabled:opacity-70 md:w-auto xl:min-h-full xl:px-9"
          disabled={isLoading}
          onClick={submit}
          type="button"
        >
          {isLoading ? 'Discovering...' : 'Discover Properties'}
        </button>
      </div>
    </div>
  );
}

function LuxurySelect({
  children,
  isPlaceholder = false,
  label,
  onChange,
  value
}: {
  children: ReactNode;
  isPlaceholder?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="group block border border-ivory/18 bg-ivory/[0.105] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 hover:bg-ivory/[0.145] focus-within:border-gold/65 focus-within:bg-ivory/[0.155] focus-within:shadow-[0_0_0_1px_rgba(200,169,107,0.2),0_12px_34px_rgba(0,0,0,0.12)]">
      <span className="block text-[9px] font-medium uppercase tracking-[0.22em] text-ivory/78">
        {label}
      </span>
      <span className="relative mt-1.5 block">
        <select
          className={`luxury-landing-select min-h-8 w-full cursor-pointer appearance-none bg-transparent pr-9 text-[15px] font-normal outline-none transition ${isPlaceholder ? 'text-[#eadfc9]' : 'text-[#fff8ea]'}`}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/32 transition duration-300 group-hover:bg-black/40"
        >
          <span className="h-2 w-2 rotate-45 border-b border-r border-gold transition duration-300" />
        </span>
      </span>
    </label>
  );
}
