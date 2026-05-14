'use client';

import { FormEvent, useState } from 'react';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';

export function SearchBar({
  initialQuery,
  onSearch
}: {
  initialQuery?: string;
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery || '');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form className="relative" onSubmit={submit}>
      <div className="grid gap-3 bg-[#101010] p-3 shadow-[0_24px_90px_rgba(0,0,0,0.22)] md:grid-cols-[1fr_auto]">
        <div className="relative">
          <input
            className="h-14 w-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/38 focus:border-gold"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search villas, penthouses, regions or lifestyle features..."
            value={query}
          />
          <SearchAutocomplete query={query} onSelect={(value) => setQuery(value)} />
        </div>
        <button
          className="h-14 bg-gold px-8 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#b99655]"
          type="submit"
        >
          Search
        </button>
      </div>
      <p className="mt-3 text-xs leading-6 text-white/52">
        Example: beachfront villa in Marbella or privacy-focused mansion near golf
      </p>
    </form>
  );
}
