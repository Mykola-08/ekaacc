import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

// Public paths that don't require authentication
// /login and /signup are allowed to support Auth0 authentication flow
const DEFAULT_PUBLIC_PATHS = [
	'/',
	'/login',
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

	// Allow Next.js internals and static assets to pass through
	if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
		return NextResponse.next()
	}

	// Allow all Auth0 authentication routes to pass through
	// (handled by @auth0/nextjs-auth0)
	if (pathname.startsWith('/api/auth')) {
		return NextResponse.next()
	}

	// Allow configured public paths without authentication
	if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
		const res = NextResponse.next()
		addSecurityHeaders(res)
		return res
	}

	// Check for valid Auth0 session
	let session = null
	try {
		session = await getSession(req, NextResponse.next())
	} catch (err) {
		console.error('Auth0 edge session retrieval failed in proxy:', (err as Error)?.message)
	}
	
	// Redirect to Auth0 login if no valid session
	if (!session) {
		return redirectToAuth0Login(req, pathname)
	}

	// Session exists, allow request to proceed
	const res = NextResponse.next()
	addSecurityHeaders(res)
	return res
}

export function addSecurityHeaders(res: NextResponse) {
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

/**
 * Redirect to Auth0 login via the API route
 * This triggers the Auth0 Universal Login flow automatically
 */
function redirectToAuth0Login(req: NextRequest, returnTo: string) {
	const loginUrl = new URL('/api/auth/login', req.url)
	if (returnTo && returnTo !== '/login') {
		loginUrl.searchParams.set('returnTo', returnTo)
	}
	const redirect = NextResponse.redirect(loginUrl)
	addSecurityHeaders(redirect)
	return redirect
}