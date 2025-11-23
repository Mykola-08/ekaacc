import { handleLogin } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  try {
    const handler = handleLogin((req) => {
      // Cast to NextRequest as we are in App Router
      const nextReq = req as NextRequest;
      
      // Extract returnTo from query parameters
      const returnTo = nextReq.nextUrl.searchParams.get('returnTo')
      
      // Initialize handler with returnTo option
      return {
        returnTo: returnTo || 'http://localhost:9002/auth-dispatch',
        authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: process.env.AUTH0_SCOPE || 'openid profile email',
        }
      }
    });

    return await handler(req, { params: {} });
  } catch (error: any) {
    console.error('Auth0 login error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}