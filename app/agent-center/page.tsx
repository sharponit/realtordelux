/** Viyra.com™ */
import { agentActions } from '@/lib/mock/data';
export default function AgentCenter(){return <main><h2 className='text-2xl mb-4'>AI Agent Center</h2>{agentActions.map(a=><div key={a.id} className='card mb-3'>{a.message} ({a.severity})</div>)}</main>}
