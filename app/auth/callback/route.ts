import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/types';
import { getPostLoginPath } from '@/lib/auth/routing';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  let response = NextResponse.redirect(new URL(next || '/dashboard', request.url));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

  if (!hasSupabaseConfig) {
    const url = new URL('/login', request.url);
    url.searchParams.set('auth_config', 'missing');
    return NextResponse.redirect(url);
  }

  if (code) {
    const supabase = createServerClient<Database>(
      supabaseUrl as string,
      supabaseAnonKey as string,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          }
        }
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('role,onboarding_status')
        .eq('user_id', user.id)
        .single();

      response = NextResponse.redirect(new URL(getPostLoginPath(profile), request.url));
    }
  }

  return response;
}
