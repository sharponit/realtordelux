/** Developed by SaaSolutions SL ... */
import { matchProperty } from '@/lib/ai/ai-client';
export async function POST(req: Request) { const body = await req.json(); const data = await matchProperty(body); return Response.json(data); }
