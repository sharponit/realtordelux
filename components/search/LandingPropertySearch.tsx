'use client';

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
    <div className="grid gap-3 md:grid-cols-[repeat(6,minmax(0,1fr))_auto]">
      <LuxurySelect label="Transaction" onChange={setListingType} value={listingType}>
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
        <option value="">Any city</option>
        {cityOptions.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </LuxurySelect>

      <LuxurySelect label="Property" onChange={setPropertyType} value={propertyType}>
        <option value="">Any property</option>
        {propertyTypes.filter(Boolean).map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </LuxurySelect>

      <LuxurySelect label="Budget" onChange={(value) => setBudgetIndex(Number(value))} value={String(budgetIndex)}>
        {budgetRanges.map((range, index) => (
          <option key={range.label} value={index}>{range.label}</option>
        ))}
      </LuxurySelect>

      <LuxurySelect label="Lifestyle" onChange={setLifestyle} value={lifestyle}>
        <option value="">Any lifestyle</option>
        {lifestyles.filter(Boolean).map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </LuxurySelect>

      <button
        className="min-h-16 bg-gold px-7 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-[#b99655] disabled:opacity-70"
        disabled={isLoading}
        onClick={submit}
        type="button"
      >
        {isLoading ? 'Discovering...' : 'Discover Properties'}
      </button>
    </div>
  );
}

function LuxurySelect({
  children,
  label,
  onChange,
  value
}: {
  children: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/48">
        {label}
      </span>
      <select
        className="mt-2 w-full bg-transparent text-sm text-white outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}
