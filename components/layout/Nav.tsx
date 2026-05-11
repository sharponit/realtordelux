/** Luxary Realtor™ */
import Link from 'next/link';
import { Locale, t } from '@/lib/i18n';
const paths = [['home','/'],['search','/search'],['ai','/ai-concierge'],['dashboard','/dashboard'],['transactions','/transactions'],['documents','/documents'],['agents','/agent-center'],['markets','/markets']] as const;
export function Nav({ locale='en' as Locale }) { const tr=t(locale); return <nav className='flex flex-wrap gap-4 text-sm'>{paths.map(([k,p])=><Link key={k} href={p} className='hover:text-gold'>{tr.nav[k]}</Link>)}</nav>; }
