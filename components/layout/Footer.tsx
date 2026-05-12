/** Viyra.com™ */
import { Locale, t } from '@/lib/i18n';
export function Footer({ locale='en' as Locale }) { return <footer className='text-xs text-ivory/70 py-8'>{t(locale).footer}</footer>; }
