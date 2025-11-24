import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

// Internal login page disabled; we no longer serve a local /login route.
// Any attempt to access /login or unauthenticated protected content will redirect
// to the external authentication domain (e.g. auth.ekabalance.com).
const DEFAULT_PUBLIC_PATHS = [
	// '/login' intentionally omitted
	'/signup',
	'/privacy',
	'/terms',
	'/cookies',
	'/unsubscribe',
	'/manifest.json',
	'/favicon.ico'
]

function loadPublicPaths(): string[] {
	const envList = process.env.PUBLIC_ROUTES
	if (!envList) return DEFAULT_PUBLIC_PATHS
	return [...new Set([...DEFAULT_PUBLIC_PATHS, ...envList.split(',').map(p => p.trim()).filter(Boolean)])]
}

export async function proxy(req: NextRequest) {
	const pathname = req.nextUrl.pathname
	const publicPaths = loadPublicPaths()

	if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
		return NextResponse.next()
	}

	const isPublic = publicPaths.some(p => pathname.startsWith(p))
	if (isPublic) {
		return NextResponse.next()
	}

	const res = NextResponse.next()
	const session = await getSession(req, res)

	if (!session?.user) {
		return redirectToAuth0Login(req)
	}

	return res
}

function redirectToAuth0Login(req: NextRequest) {
    const returnTo = req.nextUrl.pathname + req.nextUrl.search;
    const loginUrl = new URL('/api/auth/login', req.url);
    loginUrl.searchParams.set('returnTo', returnTo);
    return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
