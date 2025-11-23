import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  
  const user = session?.user;
  const roles = user?.['https://ekabalance.com/roles'] || user?.roles || [];
  
  if (!roles.includes('Admin')) {
    // Redirect non-admins to the main app
    return NextResponse.redirect(new URL('http://localhost:9002/dashboard', req.url));
  }
  
  return res;
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
