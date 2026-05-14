'use client';

import { useEffect, useMemo, useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { saveSearch, searchProperties, trackSearchEvent } from '@/lib/search/propertySearch';
import type { PropertySearchFilters, PropertySearchResult, PropertySearchSort } from '@/types/search';

export function PropertySearchExperience() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [sort, setSort] = useState<PropertySearchSort>('relevance');
  const [pageNumber, setPageNumber] = useState(1);
  const [results, setResults] = useState<PropertySearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const input = useMemo(
    () => ({ query, filters, pagination: { pageNumber, pageSize: 24 }, sort }),
    [filters, pageNumber, query, sort]
  );

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await searchProperties(input, 'browser');
        setResults(response.results);
        setTotalCount(response.totalCount);
        await trackSearchEvent(input, response.totalCount);
      } catch (searchError) {
        setError(searchError instanceof Error ? searchError.message : 'Search is temporarily unavailable.');
      } finally {
        setIsLoading(false);
      }
    }, 260);

    return () => window.clearTimeout(handle);
  }, [input]);

  async function handleSaveSearch() {
    const result = await saveSearch(input, query || 'Viyra property search');

    if (result.requiresLogin) {
      window.location.href = `/login?next=${encodeURIComponent('/search')}`;
    }
  }

  return (
    <main className="min-h-screen bg-porcelain text-black">
      <section className="bg-[#080b0f] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Private Property Search
          </p>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-6xl">
            Search luxury residences by place, lifestyle, and investment intent.
          </h1>
          <div className="mt-9">
            <SearchBar initialQuery={query} onSearch={(value) => { setQuery(value); setPageNumber(1); }} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-6 py-10 lg:grid-cols-[320px_1fr] lg:px-10">
        <SearchFilters
          filters={filters}
          onChange={(nextFilters) => { setFilters(nextFilters); setPageNumber(1); }}
          onSortChange={(nextSort) => { setSort(nextSort); setPageNumber(1); }}
          sort={sort}
        />
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-taupe">
              {isLoading ? 'Refining results...' : `${totalCount.toLocaleString()} matching residences`}
            </p>
            <button
              className="w-fit border border-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-gold"
              onClick={handleSaveSearch}
              type="button"
            >
              Save Search
            </button>
          </div>
          <SearchResults
            error={error}
            isLoading={isLoading}
            onPropertyClick={(id) => trackSearchEvent(input, totalCount, id)}
            results={results}
          />
          {totalCount > pageNumber * 24 ? (
            <div className="mt-8 flex justify-center">
              <button
                className="border border-black/10 bg-white px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:border-gold"
                onClick={() => setPageNumber((current) => current + 1)}
                type="button"
              >
                Next Page
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
