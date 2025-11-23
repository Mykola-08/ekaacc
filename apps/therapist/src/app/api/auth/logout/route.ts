import { handleLogout } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  try {
    const handler = handleLogout({
      returnTo: '/logout'
    });
    return await handler(req, { params: {} });
  } catch (error: any) {
    console.error('Auth0 logout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
