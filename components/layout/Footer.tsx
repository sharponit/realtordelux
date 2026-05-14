import { SocialProfileButtons } from '@/components/common/SocialProfileButtons';
import { Locale, t } from '@/lib/i18n';

export function Footer({ locale = 'en' as Locale }) {
  return (
    <footer className="flex flex-col items-center gap-4 py-8 text-center text-xs text-ivory/70 md:items-start md:text-left">
      <SocialProfileButtons variant="footer" showLabels locale={locale} />
      <p>{t(locale).footer}</p>
    </footer>
  );
}
