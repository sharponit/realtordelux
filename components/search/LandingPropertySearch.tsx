'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';

export function LandingPropertySearch() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  function search(query: string) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setMessage('Enter a location, property type, or lifestyle feature.');
      return;
    }

    setMessage('');
    setIsLoading(true);
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <SearchBar
      buttonLabel="Search"
      isLoading={isLoading}
      onSearch={search}
      validationMessage={message}
    />
  );
}
