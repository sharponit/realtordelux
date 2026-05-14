'use client';

import type { PropertySearchFilters, PropertySearchSort } from '@/types/search';

const lifestyleTags = [
  'Sea view',
  'Golf front',
  'Beachfront',
  'Marina nearby',
  'Privacy focused',
  'Family compound',
  'Smart home',
  'Wellness spa',
  'Home cinema',
  'Crypto accepted',
  'Golden visa eligible',
  'Islamic finance compatible',
  'High rental yield',
  'Remote work friendly',
  'Gated community',
  'New construction',
  'Staff quarters',
  'Designer furnished',
  'Rooftop terrace',
  'Investment opportunity'
];

const amenities = ['Pool', 'Spa', 'Gym', 'Cinema', 'Garage', 'Security', 'Elevator', 'Private dock'];

export function SearchFilters({
  filters,
  sort,
  onChange,
  onSortChange
}: {
  filters: PropertySearchFilters;
  sort: PropertySearchSort;
  onChange: (filters: PropertySearchFilters) => void;
  onSortChange: (sort: PropertySearchSort) => void;
}) {
  function setValue(key: keyof PropertySearchFilters, value: string | number | boolean | string[] | undefined) {
    onChange({ ...filters, [key]: value || undefined });
  }

  function toggleArray(key: 'amenities' | 'lifestyleTags', value: string) {
    const current = filters[key] || [];
    setValue(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <aside className="border border-black/10 bg-white p-5 shadow-[0_18px_55px_rgba(23,23,23,0.06)]">
      <div className="grid gap-4">
        <label>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">Purpose</span>
          <select className="mt-2 w-full border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue('listingType', event.target.value)} value={filters.listingType || ''}>
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
            <option value="new_development">New Developments</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {[
            ['country', 'Country'],
            ['region', 'Region'],
            ['city', 'City'],
            ['propertyType', 'Property type']
          ].map(([key, label]) => (
            <label key={key}>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">{label}</span>
              <input className="mt-2 w-full border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue(key as keyof PropertySearchFilters, event.target.value)} value={(filters[key as keyof PropertySearchFilters] as string) || ''} />
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue('minPrice', Number(event.target.value))} placeholder="Min price" type="number" value={filters.minPrice || ''} />
          <input className="border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue('maxPrice', Number(event.target.value))} placeholder="Max price" type="number" value={filters.maxPrice || ''} />
          <input className="border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue('minBedrooms', Number(event.target.value))} placeholder="Bedrooms" type="number" value={filters.minBedrooms || ''} />
          <input className="border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue('minBathrooms', Number(event.target.value))} placeholder="Bathrooms" type="number" value={filters.minBathrooms || ''} />
          <input className="border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue('minSizeM2', Number(event.target.value))} placeholder="Min m2" type="number" value={filters.minSizeM2 || ''} />
          <input className="border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => setValue('maxSizeM2', Number(event.target.value))} placeholder="Max m2" type="number" value={filters.maxSizeM2 || ''} />
        </div>
        <select className="border border-black/10 bg-porcelain px-3 py-3 text-sm" onChange={(event) => onSortChange(event.target.value as PropertySearchSort)} value={sort}>
          <option value="relevance">Sort by relevance</option>
          <option value="newest">Newest</option>
          <option value="price_low_high">Price low to high</option>
          <option value="price_high_low">Price high to low</option>
          <option value="size_high_low">Size high to low</option>
          <option value="distance">Distance</option>
        </select>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 text-sm text-taupe">
            <input checked={Boolean(filters.verifiedOnly)} onChange={(event) => setValue('verifiedOnly', event.target.checked)} type="checkbox" />
            Verified only
          </label>
          <label className="flex items-center gap-2 text-sm text-taupe">
            <input checked={Boolean(filters.highlightedOnly)} onChange={(event) => setValue('highlightedOnly', event.target.checked)} type="checkbox" />
            Highlighted only
          </label>
        </div>
        <TagGroup active={filters.amenities || []} items={amenities} label="Amenities" onToggle={(value) => toggleArray('amenities', value)} />
        <TagGroup active={filters.lifestyleTags || []} items={lifestyleTags} label="Lifestyle" onToggle={(value) => toggleArray('lifestyleTags', value)} />
      </div>
    </aside>
  );
}

function TagGroup({
  active,
  items,
  label,
  onToggle
}: {
  active: string[];
  items: string[];
  label: string;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            className={`border px-3 py-2 text-xs transition ${
              active.includes(item) ? 'border-gold bg-gold/10 text-black' : 'border-black/10 text-taupe hover:border-gold'
            }`}
            key={item}
            onClick={() => onToggle(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
