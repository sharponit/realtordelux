/** Luxary Realtor™ */
import { AIResult, MatchPropertyInput, PropertyMatch } from './types';
export const mockMatchProperty = async (_: MatchPropertyInput): Promise<AIResult<PropertyMatch[]>> => ({ ok: true, degraded: true, data: [{ propertyId: 'p1', score: 94, reason: 'High alignment for privacy and remote purchase readiness.' }] });
