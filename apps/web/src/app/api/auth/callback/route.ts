import { handleCallback } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Get returnTo from query params if provided
    const returnTo = req.nextUrl.searchParams.get('returnTo')
    
    // Handle the Auth0 callback and establish session
    return handleCallback(req, {
      afterCallback: async (req, session) => {
        // Session established successfully
        // You can add custom logic here (e.g., sync user to Supabase)
        return session
      },
      // Redirect to the returnTo URL if provided, otherwise to dashboard
      redirectUri: returnTo || '/dashboard'
    })
  } catch (error) {
    console.error('Auth0 callback error:', error)
    // Redirect to home with error parameter on failure
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url))
  }
}
