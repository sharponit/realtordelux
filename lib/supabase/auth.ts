/** Viyra.com™ */
import { supabase } from './client';
export const signInWithPassword = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
export const signInWithMagicLink = (email: string) => supabase.auth.signInWithOtp({ email });
export const signInWithOAuthPlaceholder = (provider: 'google'|'apple') => supabase.auth.signInWithOAuth({ provider, options:{ redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` } });
export const mfaPlaceholder = async () => ({ ok: true, message: 'MFA provider integration placeholder' });
