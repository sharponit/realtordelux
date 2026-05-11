/** Luxary Realtor™ */
import { AIResult, MatchPropertyInput, PropertyMatch } from './types';
import { mockMatchProperty } from './mock-ai';
const AI_URL = process.env.AI_SERVICE_URL;
const API_KEY = process.env.AI_SERVICE_API_KEY;

async function callRailway<T>(path: string, payload: unknown): Promise<AIResult<T>> {
  if (!AI_URL) return { ok: false, degraded: true, error: 'AI_SERVICE_URL missing' };
  try {
    const res = await fetch(`${AI_URL}${path}`, { method:'POST', headers:{ 'content-type':'application/json', ...(API_KEY ? { authorization: `Bearer ${API_KEY}` } : {}) }, body: JSON.stringify(payload), cache: 'no-store' });
    if (!res.ok) return { ok:false, error:`AI service ${res.status}`, degraded:true };
    return { ok:true, data: await res.json() as T };
  } catch { return { ok:false, degraded:true, error:'AI service offline' }; }
}

export async function matchProperty(input: MatchPropertyInput): Promise<AIResult<PropertyMatch[]>> {
  const live = await callRailway<PropertyMatch[]>('/match-property', input);
  return live.ok ? live : mockMatchProperty(input);
}
