/** Viyra.com™ */
import en from '@/data/translations/en/common.json';
import es from '@/data/translations/es/common.json';
import ar from '@/data/translations/ar/common.json';
const bundles = { en, es, ar };
export type Locale = keyof typeof bundles;
export const detectLocale = (preferred?: string): Locale => (preferred && preferred in bundles ? preferred as Locale : 'en');
export const t = (locale: Locale) => bundles[locale] ?? bundles.en;
