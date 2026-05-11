/** Luxary Realtor™ */
import { transactions } from '@/lib/mock/data';
export default function Tx(){const t=transactions[0];return <main className='space-y-4'><h2 className='text-2xl'>Transaction Status</h2><div className='card'>Progress: {t.progress}%</div><div className='space-y-2'>{t.stages.map(s=><div key={s.key} className='card'><h3>{s.key}</h3><p>Status: {s.status} · Responsible: {s.responsibleRole} · Deadline: {s.deadline}</p><p>Action: {s.requiredAction} · Risk: {s.risk} · Next: {s.nextAction}</p><p>AI: {s.aiExplanation}</p></div>)}</div></main>}
