import type { Provider } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from './client';

const authRedirect = (next?: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const url = new URL('/auth/callback', appUrl);

  if (next) {
    url.searchParams.set('next', next);
  }

  return url.toString();
};

export const signInWithPassword = (email: string, password: string) =>
  createSupabaseBrowserClient().auth.signInWithPassword({ email, password });

export const signInWithSecureLink = (email: string, next?: string) =>
  createSupabaseBrowserClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: authRedirect(next) }
  });

export const signInWithMagicLink = signInWithSecureLink;

export const signInWithOAuth = (
  provider: Extract<Provider, 'google' | 'apple' | 'linkedin_oidc'>,
  next?: string
) =>
  createSupabaseBrowserClient().auth.signInWithOAuth({
    provider,
    options: { redirectTo: authRedirect(next) }
  });

export const mfaPlaceholder = async () => ({ ok: true, message: 'MFA provider integration placeholder' });
