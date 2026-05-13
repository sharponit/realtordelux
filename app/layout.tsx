import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Viyra.com',
  description: 'Global luxury real-estate operating system',
  applicationName: 'Viyra.com',
  creator: 'SaaSolutions SL',
  publisher: 'Paradox FZCO',
  keywords: ['luxury real estate', 'global property', 'AI concierge']
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
