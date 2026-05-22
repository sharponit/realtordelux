import './globals.css';
import type { Metadata } from 'next';
import { dir } from '@/lib/i18n';
import { getRequestLocale } from '@/lib/i18n/request';

export const metadata: Metadata = {
  title: 'Viyra.com',
  description: 'Global luxury real-estate operating system',
  applicationName: 'Viyra.com',
  creator: 'SaaSolutions SL',
  publisher: 'Paradox FZCO',
  keywords: ['luxury real estate', 'global property', 'AI concierge'],
  icons: {
    icon: '/viyra/web/favicons/favicon-256.png'
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
