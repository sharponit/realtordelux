import { headers } from 'next/headers';
import { defaultLocale, detectLocale, isLocale, type Locale } from '@/lib/i18n';

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const headerLocale = headerStore.get('x-viyra-locale');

  if (isLocale(headerLocale)) {
    return headerLocale;
  }

  return detectLocale(headerStore.get('accept-language')) || defaultLocale;
}
