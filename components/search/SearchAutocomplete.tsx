'use client';

import { useEffect, useState } from 'react';
import { getSearchSuggestions } from '@/lib/search/propertySearch';
import type { SearchSuggestion } from '@/types/search';

export function SearchAutocomplete({
  query,
  onSelect
}: {
  query: string;
  onSelect: (value: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setSuggestions(await getSearchSuggestions(query, 'browser'));
    }, 220);

    return () => window.clearTimeout(handle);
  }, [query]);

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 border border-white/10 bg-[#171717] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
      {suggestions.map((suggestion) => (
        <button
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-white/82 transition hover:bg-white/5 hover:text-gold"
          key={`${suggestion.type}-${suggestion.value}`}
          onClick={() => {
            onSelect(suggestion.value);
            setSuggestions([]);
          }}
          type="button"
        >
          <span>{suggestion.label}</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">
            {suggestion.type.replace('_', ' ')}
          </span>
        </button>
      ))}
    </div>
  );
}
