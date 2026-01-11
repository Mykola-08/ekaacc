import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Handle subdomain routing for therapist portal
  // Supports: therapist.ekabalance.com, therapist.localhost:9002
  const isTherapistSubdomain = hostname.startsWith('therapist.')
  
  // Handle subdomain routing for admin portal
  // Supports: admin.ekabalance.com, admin.localhost:9002
  const isAdminSubdomain = hostname.startsWith('admin.')
  
  if (isTherapistSubdomain) {
    // Rewrite therapist subdomain requests to /therapist/* routes
    // Skip if already accessing /therapist path or static/api routes
    if (!pathname.startsWith('/therapist') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      const newPath = pathname === '/' ? '/therapist' : `/therapist${pathname}`
      const url = request.nextUrl.clone()
      url.pathname = newPath
      response = NextResponse.rewrite(url)
    }
  } else if (isAdminSubdomain) {
    // Rewrite admin subdomain requests to /admin/* routes
    // Skip if already accessing /admin path or static/api routes
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      const newPath = pathname === '/' ? '/admin' : `/admin${pathname}`
      const url = request.nextUrl.clone()
      url.pathname = newPath
      response = NextResponse.rewrite(url)
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
            domain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
          } as any)
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
          } as any)
        },
      },
    }
  )

  await (supabase.auth as any).getUser()

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
