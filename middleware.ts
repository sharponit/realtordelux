import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/types';
import { defaultLocale, isLocale, localeCookieName, type Locale } from '@/lib/i18n';

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

const countryLocaleMap: Record<string, Locale> = {
  AE: 'ar',
  AR: 'es',
  AT: 'de',
  BE: 'nl',
  CH: 'de',
  CL: 'es',
  CO: 'es',
  DE: 'de',
  ES: 'es',
  MX: 'es',
  NL: 'nl',
  PE: 'es',
  RU: 'ru',
  SA: 'ar'
};

function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;

  for (const language of header.split(',')) {
    const code = language.trim().split(';')[0]?.toLowerCase().split('-')[0];
    if (isLocale(code)) return code;
  }

  return null;
}

function localeFromDomain(hostname: string): Locale {
  const normalized = hostname.toLowerCase().split(':')[0];
  if (normalized.endsWith('.es')) return 'es';
  if (normalized.endsWith('.com')) return 'en';
  return defaultLocale;
}

function detectRequestLocale(request: NextRequest): Locale {
  const selectedLocale = request.nextUrl.searchParams.get('locale');
  if (isLocale(selectedLocale)) return selectedLocale;

  const savedLocale = request.cookies.get(localeCookieName)?.value;
  if (isLocale(savedLocale)) return savedLocale;

  const deviceLocale = localeFromAcceptLanguage(request.headers.get('accept-language'));
  if (deviceLocale) return deviceLocale;

  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code');
  if (country) {
    const geoLocale = countryLocaleMap[country.toUpperCase()];
    if (geoLocale) return geoLocale;
  }

  return localeFromDomain(request.nextUrl.hostname);
}

function withLocale(request: NextRequest) {
  const locale = detectRequestLocale(request);
  const headers = new Headers(request.headers);
  headers.set('x-viyra-locale', locale);

  let response = NextResponse.next({ request: { headers } });
  response.cookies.set(localeCookieName, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax'
  });

  return { locale, response };
}

function redirectWithLocale(request: NextRequest, pathname: string, locale: Locale, params?: Record<string, string>) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';

  Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = NextResponse.redirect(url);
  response.cookies.set(localeCookieName, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax'
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const selectedLocale = request.nextUrl.searchParams.get('locale');
  const { locale, response: localizedResponse } = withLocale(request);

  if (isLocale(selectedLocale)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('locale');
    const response = NextResponse.redirect(url);
    response.cookies.set(localeCookieName, locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax'
    });
    return response;
  }

  let response = localizedResponse;
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
      return redirectWithLocale(request, '/login', locale, { auth_config: 'missing' });
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
            const headers = new Headers(request.headers);
            headers.set('x-viyra-locale', locale);
            response = NextResponse.next({ request: { headers } });
            response.cookies.set(localeCookieName, locale, {
              maxAge: 60 * 60 * 24 * 365,
              path: '/',
              sameSite: 'lax'
            });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          }
        }
      }
    );

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (shouldProtect && !user) {
      return redirectWithLocale(request, '/login', locale, {
        next: `${request.nextUrl.pathname}${request.nextUrl.search}`
      });
    }

    if (user) {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('role,onboarding_status')
        .eq('user_id', user.id)
        .single();

      if (pathname === '/login') {
        return redirectWithLocale(
          request,
          profile?.onboarding_status === 'complete' ? '/dashboard' : '/onboarding',
          locale
        );
      }

      if (shouldProtect && pathname !== '/onboarding' && profile?.onboarding_status !== 'complete') {
        return redirectWithLocale(request, '/onboarding', locale);
      }
    }
  } catch {
    if (shouldProtect) {
      return redirectWithLocale(request, '/login', locale, { auth_error: 'middleware' });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|viyra/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
