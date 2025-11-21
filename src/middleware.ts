import { NextResponse, NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

// Global enforcement: redirects unauthenticated requests except whitelisted public/legal pages.
// Uses server-side Auth0 session via @auth0/nextjs-auth0

const DEFAULT_PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/privacy',
  '/terms',
  '/cookies',
  '/unsubscribe',
  '/manifest.json',
  '/favicon.ico'
]

function loadPublicPaths(): string[] {
  const envList = process.env.PUBLIC_ROUTES
  if (!envList) return DEFAULT_PUBLIC_PATHS
  return [...new Set([...DEFAULT_PUBLIC_PATHS, ...envList.split(',').map(p => p.trim()).filter(Boolean)])]
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const publicPaths = loadPublicPaths()

  // Allow Next.js static assets & _next paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next()
  }

  // Public paths pass through
  if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    const res = NextResponse.next()
    addSecurityHeaders(res)
    return res
  }

  // Server-side Auth0 session check with resilience: swallow errors & treat as unauthenticated
  let session: any = null
  try {
    session = await getSession(req as any)
  } catch (err) {
    // Avoid failing the entire request due to middleware exception
    console.error('Auth0 edge session retrieval failed in middleware:', (err as Error)?.message)
  }
  if (!session) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('returnTo', pathname)
    const redirect = NextResponse.redirect(loginUrl)
    addSecurityHeaders(redirect)
    return redirect
  }

  const res = NextResponse.next()
  addSecurityHeaders(res)
  return res
}

export const config = {
  matcher: [
    '/((?!api/auth/callback|api/auth/logout|favicon.ico|_next|static).*)'
  ]
}

function addSecurityHeaders(res: NextResponse) {
  const cspNonce = generateNonce()
  // Build connect-src dynamically & safely filter undefined/empty segments
  const auth0Domain = (process.env.PROD_AUTH0_DOMAIN || process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '').trim()
  const supabaseHost = (process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '').trim()
  const connectSrcParts = ["'self'", auth0Domain && `https://${auth0Domain}`, supabaseHost && `https://${supabaseHost}`].filter(Boolean)
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${cspNonce}' https://cdn.auth0.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://cdn.auth0.com",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src ${connectSrcParts.join(' ')}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ]
  res.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  res.headers.set('X-XSS-Protection', '0')
  res.cookies.set({ name: 'csp-nonce', value: cspNonce, path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 300 })
}

function generateNonce() {
  return Math.random().toString(36).substring(2, 12)
}
