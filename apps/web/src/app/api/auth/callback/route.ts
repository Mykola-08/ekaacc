import { handleCallback, type AppRouteHandlerFnContext } from '@auth0/nextjs-auth0/edge'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest, context: { params: Promise<{}> }) {
  const params = await context.params
  const ctx: AppRouteHandlerFnContext = { params }
  
  try {
    // Handle the Auth0 callback and establish session
    const handler = handleCallback({
      afterCallback: async (req, session) => {
        // Session established successfully
        // You can add custom logic here (e.g., sync user to Supabase)
        return session
      }
    })
    
    return await handler(req, ctx)
  } catch (error) {
    console.error('Auth0 callback error:', error)
    // Redirect to home on error
    return NextResponse.redirect(new URL('/', req.url))
  }
}
