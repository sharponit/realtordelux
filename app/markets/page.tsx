/** Luxary Realtor™ */
import { markets } from '@/lib/config/markets';
export default function Markets(){return <main><h2 className='text-2xl mb-4'>Global Market Architecture</h2><div className='grid md:grid-cols-3 gap-4'>{markets.map(m=><div key={m.code} className='card'><p>{m.country}</p><p>{m.currency}</p><p>Default: {m.defaultLanguage}</p><p>Localized legal workflow + tax/residency placeholders.</p></div>)}</div></main>}
