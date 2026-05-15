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
    <div className="space-y-5">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        <LuxurySelect label="Transaction Type" onChange={setListingType} value={listingType}>
          {transactionTypes.map(([label, value]) => (
            <option key={label} value={value}>{label}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect label="Country" onChange={updateCountry} value={country}>
          <option value="">Any country</option>
          {Object.keys(countryCities).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect label="City / Region" onChange={setCity} value={city}>
          <option value="">Any city or region</option>
          {cityOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        <LuxurySelect label="Property Type" onChange={setPropertyType} value={propertyType}>
          <option value="">Any property</option>
          {propertyTypes.filter(Boolean).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect label="Budget Range" onChange={(value) => setBudgetIndex(Number(value))} value={String(budgetIndex)}>
          {budgetRanges.map((range, index) => (
            <option key={range.label} value={index}>{range.label}</option>
          ))}
        </LuxurySelect>

        <LuxurySelect label="Lifestyle Preference" onChange={setLifestyle} value={lifestyle}>
          <option value="">Any lifestyle</option>
          {lifestyles.filter(Boolean).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </LuxurySelect>
      </div>

      <div className="flex justify-stretch pt-1 md:justify-end">
        <button
          className="min-h-12 w-full bg-gold/92 px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_10px_28px_rgba(200,169,107,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d3b777] focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-[#11100e] disabled:opacity-70 md:w-auto"
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
  label,
  onChange,
  value
}: {
  children: ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="group block border-b border-white/14 bg-white/[0.025] px-4 py-3 transition duration-300 hover:bg-white/[0.055] focus-within:border-gold/60 focus-within:bg-white/[0.06]">
      <span className="block text-[9px] font-medium uppercase tracking-[0.22em] text-ivory/48">
        {label}
      </span>
      <span className="relative mt-1.5 block">
        <select
          className="min-h-8 w-full cursor-pointer appearance-none bg-transparent pr-8 text-[15px] font-normal text-ivory outline-none transition"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-r border-gold/70 transition duration-300 group-hover:border-gold"
        />
      </span>
    </label>
  );
}
