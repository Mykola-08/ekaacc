import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware protects server-side routes like /therapist and /admin.
// Behavior:
// - If the request targets a protected path and no session token cookie is present,
//   the middleware redirects the user to `/` (or login) and preserves the attempted path
//   in the `redirect` search param.
// - For full role-based protection you should verify the token server-side (for example
//   using the Firebase Admin SDK to verify an ID token and check custom claims).
//   That requires installing firebase-admin and securely providing credentials on the server.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect therapist and admin areas (app-router paths)
  if (pathname.startsWith('/therapist') || pathname.startsWith('/admin')) {
    // If running in mock/demo mode, skip server-side redirects and allow client-side guards to handle UX.
    // By default NEXT_PUBLIC_USE_MOCK_DATA is not 'false' in dev, so the middleware will allow paths.
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
    if (useMock) {
      return NextResponse.next();
    }

    // Production: require a session token cookie. Adjust cookie names to match your auth implementation.
    const token = req.cookies.get('session')?.value || req.cookies.get('__session')?.value || req.cookies.get('token')?.value;
    if (!token) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optional: verify token here using Firebase Admin or your auth provider.
    // Example (pseudo-code):
    // try {
    //   const decoded = await admin.auth().verifyIdToken(token);
    //   if (!decoded || !decoded.role || (decoded.role !== 'Therapist' && decoded.role !== 'Admin')) {
    //     const u = new URL('/', req.url); u.searchParams.set('redirect', pathname); return NextResponse.redirect(u);
    //   }
    // } catch (e) { return NextResponse.redirect(new URL('/', req.url)); }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to therapist and admin routes
  matcher: ['/therapist/:path*', '/admin/:path*'],
};
