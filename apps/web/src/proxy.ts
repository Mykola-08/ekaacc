import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { createClient } from '@/lib/supabase-middleware'

const DEFAULT_PUBLIC_PATHS = [
	'/signup',
	'/privacy',
	'/terms',
	'/cookies',
	'/unsubscribe',
	'/manifest.json',
	'/favicon.ico',
    '/api/status',
    '/status'
]

function loadPublicPaths(): string[] {
	const envList = process.env.PUBLIC_ROUTES
	if (!envList) return DEFAULT_PUBLIC_PATHS
	return [...new Set([...DEFAULT_PUBLIC_PATHS, ...envList.split(',').map(p => p.trim()).filter(Boolean)])]
}

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // 1. Handle Status Subdomain
  if (hostname === 'status.ekabalance.com' || hostname.startsWith('status.localhost')) {
    // Allow API requests to pass through
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
    }
    
    // Allow static files to pass through
    if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
      return NextResponse.next()
    }

    // Rewrite root to /status
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/status', request.url))
    }
    
    // Rewrite any other path to /status (SPA behavior)
    return NextResponse.rewrite(new URL('/status', request.url))
  }

  // 2. Handle Supabase Auth (Refresh Session)
  // We do this first to ensure cookies are set on the response we build up
  let { response } = createClient(request)

  // 3. Handle Auth0 Protection
  const publicPaths = loadPublicPaths()
  if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return response
  }

  const isPublic = publicPaths.some(p => pathname.startsWith(p))
  if (isPublic) {
    return response
  }

  // Check Auth0 Session
  const session = await getSession(request, response)

  if (!session?.user) {
     const returnTo = request.nextUrl.pathname + request.nextUrl.search;
     const loginUrl = new URL('/api/auth/login', request.url);
     loginUrl.searchParams.set('returnTo', returnTo);
     return NextResponse.redirect(loginUrl);
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
