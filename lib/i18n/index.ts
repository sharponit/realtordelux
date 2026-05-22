import ar from '@/data/translations/ar/common.json';
import de from '@/data/translations/de/common.json';
import en from '@/data/translations/en/common.json';
import es from '@/data/translations/es/common.json';
import nl from '@/data/translations/nl/common.json';
import ru from '@/data/translations/ru/common.json';

export const locales = ['en', 'es', 'nl', 'de', 'ru', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const localeCookieName = 'NEXT_LOCALE';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  nl: 'Nederlands',
  de: 'Deutsch',
  ru: 'Русский',
  ar: 'العربية'
};

const bundles = { en, es, nl, de, ru, ar };

export function isLocale(value?: string | null): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function detectLocale(preferred?: string | null): Locale {
  if (!preferred) return defaultLocale;

  const normalized = preferred.toLowerCase();
  const exact = normalized.split('-')[0];
  return isLocale(exact) ? exact : defaultLocale;
}

export function t(locale: Locale) {
  return bundles[locale] ?? bundles[defaultLocale];
}

export function dir(locale: Locale) {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
