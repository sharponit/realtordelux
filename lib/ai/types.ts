/**
 * Viyra.com™
 * Developed by SaaSolutions SL
 * Intellectual Property owned by Paradox FZCO
 * © 2026 Paradox FZCO. All rights reserved.
 */
export interface AIRequestContext { userId?: string; market?: string; locale?: string }
export interface MatchPropertyInput { preferenceProfileId: string; context?: AIRequestContext }
export interface AIResult<T> { ok: boolean; data?: T; error?: string; degraded?: boolean }
export interface PropertyMatch { propertyId: string; score: number; reason: string }
