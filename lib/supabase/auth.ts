import type { Provider } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from './client';

const authRedirect = () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  return `${appUrl}/auth/callback`;
};

export const signInWithPassword = (email: string, password: string) =>
  createSupabaseBrowserClient().auth.signInWithPassword({ email, password });

export const signInWithMagicLink = (email: string) =>
  createSupabaseBrowserClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: authRedirect() }
  });

export const signInWithOAuth = (provider: Extract<Provider, 'google' | 'apple' | 'azure'>) =>
  createSupabaseBrowserClient().auth.signInWithOAuth({
    provider,
    options: { redirectTo: authRedirect() }
  });

export const mfaPlaceholder = async () => ({ ok: true, message: 'MFA provider integration placeholder' });
