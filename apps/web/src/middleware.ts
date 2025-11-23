import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  
  const user = session?.user;
  const roles = user?.['https://ekabalance.com/roles'] || user?.roles || [];
  
  if (roles.includes('Therapist')) {
    return NextResponse.redirect(new URL('http://localhost:9004', req.url));
  }
  if (roles.includes('Admin')) {
    return NextResponse.redirect(new URL('http://localhost:9003', req.url));
  }
  
  return res;
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/journal/:path*', '/sessions/:path*'],
};
