import { NextResponse, NextRequest } from 'next/server'

// Global enforcement: if user lacks Auth0 session cookie, redirect to external auth domain.
// The requirement: ANY URL in the app should force authentication.
// We still exclude Next.js internals and Auth0 callback/login/logout endpoints to avoid loops.

// Cookie name used by @auth0/nextjs-auth0 (default): 'appSession'. Allow override via env.
const SESSION_COOKIE = process.env.AUTH0_SESSION_COOKIE || 'appSession'
const AUTH_DOMAIN = process.env.AUTH_DOMAIN || 'auth.ekabalance.com'

// Paths to skip (callback/logout needed for flows; static/build assets; service worker)
const EXCLUDED_PREFIXES = [
  '/api/auth/', // allow library auth routes
  '/_next',
  '/static',
  '/favicon.ico',
  '/robots.txt',
  '/manifest.webmanifest',
  '/sw.js'
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip excluded paths
  if (EXCLUDED_PREFIXES.some(p => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Detect existing session
  const hasSession = !!req.cookies.get(SESSION_COOKIE)
  if (!hasSession) {
    // Build returnTo param (original full URL) for post-login redirect
    const returnTo = encodeURIComponent(`${req.nextUrl.origin}${pathname}`)
    const redirectUrl = `https://${AUTH_DOMAIN}/login?returnTo=${returnTo}`
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static).*)']
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
