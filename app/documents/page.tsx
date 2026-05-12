/** Viyra.com™ */
import { docs } from '@/lib/mock/data';
export default function Documents(){return <main><h2 className='text-2xl mb-4'>Secure Document Center</h2><div className='space-y-3'>{docs.map(d=><div key={d.id} className='card'><p>{d.type}</p><p>Status: {d.status} · Responsible: {d.responsibleParty}</p><p>Upload: {d.uploadDate} · Expiry: {d.expiryDate}</p></div>)}</div></main>}
