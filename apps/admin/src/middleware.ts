import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

function addSecurityHeaders(res: NextResponse) {
  const cspNonce = Math.random().toString(36).substring(2, 12)
  const auth0Domain = (process.env.PROD_AUTH0_DOMAIN || process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '').trim()
  const supabaseHost = (process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '').trim()
  const connectSrcParts = ["'self'", auth0Domain && `https://${auth0Domain}`, supabaseHost && `https://${supabaseHost}`].filter(Boolean)
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${cspNonce}' https://cdn.auth0.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://cdn.auth0.com",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src ${connectSrcParts.join(' ')}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ]
  res.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  res.headers.set('X-XSS-Protection', '0')
  res.cookies.set({ name: 'csp-nonce', value: cspNonce, path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 300 })
}

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  
  const user = session?.user;
  const roles = user?.['https://ekabalance.com/roles'] || user?.roles || [];
  
  if (!roles.includes('Admin')) {
    // Redirect non-admins to the main app
    return NextResponse.redirect(new URL('http://localhost:9002/dashboard', req.url));
  }
  
  addSecurityHeaders(res);
  return res;
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
