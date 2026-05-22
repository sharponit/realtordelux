'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { localeLabels, locales, type Locale } from '@/lib/i18n';

const localeCodes: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  nl: 'NL',
  de: 'DE',
  ru: 'RU',
  ar: 'AR'
};

export function LocaleSwitcher({ activeLocale, light = false }: { activeLocale: Locale; light?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function hrefFor(locale: Locale) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('locale', locale);
    return `${pathname}?${params.toString()}`;
  }

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={wrapperRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Language"
        className={`inline-flex h-10 min-w-16 items-center justify-between gap-2 border px-3 text-[11px] font-semibold uppercase tracking-[0.16em] outline-none transition focus:ring-2 focus:ring-gold/60 ${
          light
            ? 'border-white/25 bg-[#11100e]/75 text-white'
            : 'border-black/15 bg-white text-black'
        }`}
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span>{localeCodes[activeLocale]}</span>
        <span aria-hidden="true" className="text-gold">
          v
        </span>
      </button>

      {isOpen ? (
        <div
          className={`absolute right-0 top-full z-50 mt-2 w-44 border py-1 shadow-[0_18px_50px_rgba(0,0,0,0.22)] ${
            light ? 'border-white/15 bg-[#11100e] text-white' : 'border-black/10 bg-white text-black'
          }`}
          role="listbox"
        >
          {locales.map((locale) => (
            <button
              aria-selected={locale === activeLocale}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.12em] transition hover:bg-gold/15 ${
                locale === activeLocale ? 'text-gold' : ''
              }`}
              key={locale}
              onClick={() => {
                window.location.href = hrefFor(locale);
              }}
              role="option"
              type="button"
            >
              <span>{localeLabels[locale]}</span>
              <span className="text-[10px] opacity-60">{localeCodes[locale]}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
