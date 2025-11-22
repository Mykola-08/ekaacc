import { handleLogin, type AppRouteHandlerFnContext } from '@auth0/nextjs-auth0/edge'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest, context: { params: Promise<{}> }) {
  const params = await context.params
  const ctx: AppRouteHandlerFnContext = { params }
  
  // Extract returnTo from query parameters
  const returnTo = req.nextUrl.searchParams.get('returnTo')
  
  // Initialize handler with returnTo option
  const handler = handleLogin({
    returnTo: returnTo || undefined,
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: process.env.AUTH0_SCOPE || 'openid profile email',
    }
  })
  
  return handler(req, ctx)
}