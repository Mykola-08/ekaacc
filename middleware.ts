import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  // 1. Initialize initial response (NextResponse.next)
  // We use this to capture cookies from Supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Supabase Auth Logic
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dopkncrqutxnchwqxloa.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcGtuY3JxdXR4bmNod3F4bG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTUwNzksImV4cCI6MjA4MzM3MTA3OX0.ctJPZcBYTfxPlQN_winPMB6wVZm8CoNOWcMKZW7FYl0',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request for downstream
          request.cookies.set({
            name,
            value,
            ...options,
          })

          // Re-create response to include updated request headers/cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          // Add cookie to response
          response.cookies.set({
            name,
            value,
            ...options,
            domain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          response.cookies.set({
            name,
            value: '',
            ...options,
            domain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
          })
        },
      },
    }
  )

  // This triggers the 'set' callbacks if session refreshes
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Subdomain Logic (Rewrites)
  const isTherapistSubdomain = hostname.startsWith('therapist.')
  const isAdminSubdomain = hostname.startsWith('admin.')

  if (isTherapistSubdomain) {
    // Rewrite therapist subdomain requests to /therapist/* routes
    // Skip if already accessing /therapist path or static/api routes
    if (!pathname.startsWith('/therapist') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      const newPath = pathname === '/' ? '/therapist' : `/therapist${pathname}`
      const url = request.nextUrl.clone()
      url.pathname = newPath

      const rewriteResponse = NextResponse.rewrite(url)

      // Copy cookies from 'response' to 'rewriteResponse'
      response.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie)
      })

      return rewriteResponse
    }
  } else if (isAdminSubdomain) {
    // Rewrite admin subdomain requests to /admin/* routes
    // Skip if already accessing /admin path or static/api routes
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      const newPath = pathname === '/' ? '/admin' : `/admin${pathname}`
      const url = request.nextUrl.clone()
      url.pathname = newPath

      const rewriteResponse = NextResponse.rewrite(url)

      response.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie)
      })

      return rewriteResponse
    }
  }

  // 4. Redirect Logic for Auth Users (Main Site)
  // Redirect logged-in users from landing page to insights
  if (user && pathname === '/' && !isTherapistSubdomain && !isAdminSubdomain) {
    const redirectResponse = NextResponse.redirect(new URL('/insights', request.url))

    // Copy cookies from 'response' to 'redirectResponse'
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })

    return redirectResponse
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
