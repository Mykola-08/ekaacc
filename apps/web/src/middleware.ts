import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/therapist/:path*',
  ],
};
