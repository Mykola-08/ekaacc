import { handleCallback } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Validate returnTo URL to prevent open redirect attacks
function isValidReturnToUrl(returnTo: string | null): string {
  if (!returnTo) {
    return '/dashboard'
  }
  
  // Only allow relative URLs or URLs from the same origin
  try {
    // If it starts with /, it's a relative URL - safe
    if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
      return returnTo
    }
    
    // If it's an absolute URL, verify it's from our domain
    const url = new URL(returnTo)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH0_BASE_URL
    
    if (appUrl) {
      const allowedUrl = new URL(appUrl)
      if (url.origin === allowedUrl.origin) {
        return returnTo
      }
    }
  } catch {
    // Invalid URL, use default
  }
  
  // Default to dashboard if validation fails
  return '/dashboard'
}

export async function GET(req: NextRequest) {
  try {
    // Get returnTo from query params if provided
    const returnToParam = req.nextUrl.searchParams.get('returnTo')
    const validReturnTo = isValidReturnToUrl(returnToParam)
    
    // Handle the Auth0 callback and establish session
    return handleCallback(req, {
      afterCallback: async (req, session) => {
        // Session established successfully
        // You can add custom logic here (e.g., sync user to Supabase)
        return session
      },
      // Redirect to the validated returnTo URL
      redirectUri: validReturnTo
    })
  } catch (error) {
    console.error('Auth0 callback error:', error)
    // Redirect to home with error parameter on failure
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url))
  }
}
