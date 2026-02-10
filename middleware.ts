import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 1. Initialize initial response (NextResponse.next)
  // We use this to capture cookies from Supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    // Keep public routes functional when env is misconfigured.
    return response;
  }

  // 2. Supabase Auth Logic
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // Update request for downstream
        request.cookies.set({
          name,
          value,
          ...options,
        });

        // Re-create response to include updated request headers/cookies
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });

        // Add cookie to response
        response.cookies.set({
          name,
          value,
          ...options,
          domain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });

        response.cookies.set({
          name,
          value: '',
          ...options,
          domain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
        });
      },
    },
  });

  // This triggers the 'set' callbacks if session refreshes
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Subdomain Logic (Rewrites)
  const isTherapistSubdomain = hostname.startsWith('therapist.');
  const isAdminSubdomain = hostname.startsWith('admin.');

  if (isTherapistSubdomain) {
    // Rewrite therapist subdomain requests to /therapist/* routes
    // Skip if already accessing /therapist path or static/api routes
    if (
      !pathname.startsWith('/therapist') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api')
    ) {
      const newPath = pathname === '/' ? '/therapist' : `/therapist${pathname}`;
      const url = request.nextUrl.clone();
      url.pathname = newPath;

      const rewriteResponse = NextResponse.rewrite(url);

      // Copy cookies from 'response' to 'rewriteResponse'
      response.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie);
      });

      return rewriteResponse;
    }
  } else if (isAdminSubdomain) {
    // Rewrite admin subdomain requests to /admin/* routes
    // Skip if already accessing /admin path or static/api routes
    if (
      !pathname.startsWith('/admin') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api')
    ) {
      const newPath = pathname === '/' ? '/admin' : `/admin${pathname}`;
      const url = request.nextUrl.clone();
      url.pathname = newPath;

      const rewriteResponse = NextResponse.rewrite(url);

      response.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie);
      });

      return rewriteResponse;
    }
  }

  // 4. Protected Routes Logic
  const protectedPrefixes = [
    '/dashboard',
    '/bookings',
    '/insights',
    '/settings',
    '/profile',
    '/admin',
    '/journal',
    '/wallet',
    '/therapist',
    '/console',
    '/features',
    '/resources',
    '/crisis',
    '/book',
    '/notifications',
    '/subscriptions',
    '/availability',
    '/progress-reports',
  ];

  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!user && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Auth Routes Logic (Redirect logged-in users away from auth pages)
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow access to marketing pages and other public routes
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
