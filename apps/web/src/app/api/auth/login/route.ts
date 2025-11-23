import { handleLogin } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const handler = handleLogin((req) => {
    // Cast to NextRequest as we are in App Router
    const nextReq = req as NextRequest;
    
    // Extract returnTo from query parameters
    const returnTo = nextReq.nextUrl.searchParams.get('returnTo')
    
    // Initialize handler with returnTo option
    return {
      returnTo: returnTo || undefined,
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE,
        scope: process.env.AUTH0_SCOPE || 'openid profile email',
      }
    }
  });

  return handler(req, { params: {} });
}