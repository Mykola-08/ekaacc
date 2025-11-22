import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from './lib/auth0'

/**
 * Next.js 16 Proxy Layer (Authentication Boundary)
 * 
 * This proxy layer:
 * 1. Runs Auth0 middleware to handle all /auth/* routes (login, callback, logout, profile)
 * 2. Enforces authentication for all non-public routes
 * 3. Redirects unauthenticated users to /auth/login with returnTo parameter
 * 
 * The Auth0 SDK automatically:
 * - Manages session cookies (appSession)
 * - Handles OAuth flows
 * - Refreshes tokens
 * - Protects against CSRF
 */
export async function proxy(request: Request) {
  const req = request instanceof NextRequest ? request : new NextRequest(request)
  const { pathname } = req.nextUrl

  // Let Auth0 middleware handle all requests (it will manage /auth/* routes)
  const authRes = await auth0.middleware(req)

  // If this is an Auth0 route, return the middleware response as-is
  if (pathname.startsWith('/auth')) {
    return authRes
  }

  // Skip authentication checks for static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/sw.js'
  ) {
    return authRes
  }

  // Check if user has a valid session
  const session = await auth0.getSession(req)

  // If no session and accessing a protected route, redirect to login
  if (!session) {
    const loginUrl = new URL('/auth/login', req.nextUrl.origin)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // User is authenticated, return the middleware response
  return authRes
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
}
