import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = {
      get(name: string) {
        return request.headers.get('cookie')?.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1]
      },
      set(name: string, value: string, options: CookieOptions) {
        // This is a route handler, we can't set cookies on the request
        // We need to set them on the response
      },
      remove(name: string, options: CookieOptions) {
        // Same here
      },
    }

    // We need to create a response to set cookies on
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.headers.get('cookie')?.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1]
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
              domain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
            })
          },
          remove(name: string, options: CookieOptions) {
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
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
