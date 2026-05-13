import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/types';

const protectedPrefixes = [
  '/dashboard',
  '/profile',
  '/onboarding',
  '/firm',
  '/admin',
  '/settings',
  '/realtor',
  '/brokerage',
  '/seller/onboarding/invite'
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  const isPublicSellerInviteLanding =
    request.nextUrl.pathname.startsWith('/seller/onboarding/invite/') &&
    !request.nextUrl.pathname.endsWith('/start');
  const shouldProtect = isProtected && !isPublicSellerInviteLanding;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

  if (!hasSupabaseConfig) {
    if (shouldProtect) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('auth_config', 'missing');
      return NextResponse.redirect(url);
    }

    return response;
  }

  try {
    const supabase = createServerClient<Database>(
      supabaseUrl as string,
      supabaseAnonKey as string,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          }
        }
      }
    );

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (shouldProtect && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (request.nextUrl.pathname === '/login' && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  } catch {
    if (shouldProtect) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('auth_error', 'middleware');
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|viyra/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
