/** Luxary Realtor™ */
import './globals.css';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title:'Luxary Realtor™', description:'Global luxury real-estate operating system', applicationName:'Luxary Realtor™', creator:'SaaSolutions SL', publisher:'Paradox FZCO', keywords:['luxury real estate','global property','AI concierge'] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang='en'><body className='min-h-screen'><div className='max-w-7xl mx-auto p-6'><header className='py-4 flex justify-between items-center'><h1 className='text-2xl font-semibold'>Luxary Realtor™</h1><Nav /></header>{children}<Footer /></div></body></html>;
}
