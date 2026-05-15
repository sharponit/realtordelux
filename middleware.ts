import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/types';

const publicPaths = [
  '/',
  '/about',
  '/contact',
  '/buying',
  '/renting',
  '/selling',
  '/new-developments',
  '/highlighted-properties',
  '/professionals',
  '/search',
  '/login',
  '/auth/callback'
];

const publicPrefixes = ['/api/health', '/api/buyer-requests', '/api/photography/realtor-requests', '/join', '/property'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const isPublicPath = publicPaths.includes(pathname) || publicPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isPublicSellerInviteLanding =
    pathname.startsWith('/seller/onboarding/invite/') && !pathname.endsWith('/start');
  const shouldProtect = !isPublicPath && !isPublicSellerInviteLanding;
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
      url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }

    if (user) {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('role,onboarding_status')
        .eq('user_id', user.id)
        .single();

      if (pathname === '/login') {
        const url = request.nextUrl.clone();
        url.pathname = profile?.onboarding_status === 'complete' ? '/dashboard' : '/onboarding';
        url.search = '';
        return NextResponse.redirect(url);
      }

      if (shouldProtect && pathname !== '/onboarding' && profile?.onboarding_status !== 'complete') {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        url.search = '';
        return NextResponse.redirect(url);
      }
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
