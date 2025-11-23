import { handleCallback } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(req: NextRequest, ctx: any) {
  try {
    // Handle the Auth0 callback and establish session
    return handleCallback(req, ctx, {
      afterCallback: async (req: any, session: any) => {
        // Session established successfully
        // You can add custom logic here (e.g., sync user to Supabase)
        return session
      }
    })
  } catch (error) {
    console.error('Auth0 callback error:', error)
    // Redirect to home on error
    return NextResponse.redirect(new URL('/', req.url))
  }
}
