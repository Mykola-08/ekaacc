import { handleLogin } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  // Extract returnTo from query parameters
  const returnTo = req.nextUrl.searchParams.get('returnTo')
  
  // Initialize handler with returnTo option
  return handleLogin(req, {
    returnTo: returnTo || undefined,
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: process.env.AUTH0_SCOPE || 'openid profile email',
    }
  })
}