/** Viyra.com™ */
import en from '@/data/translations/en/common.json';
import es from '@/data/translations/es/common.json';
import ar from '@/data/translations/ar/common.json';
import nl from '@/data/translations/nl/common.json';
import fr from '@/data/translations/fr/common.json';

const bundles = { en, es, nl, fr, ar };
export type Locale = keyof typeof bundles;
export const detectLocale = (preferred?: string): Locale => (preferred && preferred in bundles ? preferred as Locale : 'en');
export const t = (locale: Locale) => bundles[locale] ?? bundles.en;
