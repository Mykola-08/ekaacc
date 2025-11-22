import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

const AUTH_DOMAIN = process.env.AUTH_DOMAIN || 'auth.ekabalance.com'

// Public paths that don't require authentication
const PUBLIC_PATHS = [
	'/privacy',
	'/terms',
	'/cookies',
	'/manifest.json',
	'/favicon.ico'
]

export async function proxy(req: NextRequest) {
	const pathname = req.nextUrl.pathname

	// Skip Next.js internals, static assets, and Auth0 callback routes
	if (pathname.startsWith('/_next') || 
	    pathname.startsWith('/static') ||
	    pathname.startsWith('/api/auth/') ||
	    pathname === '/favicon.ico' ||
	    pathname === '/robots.txt' ||
	    pathname === '/manifest.webmanifest' ||
	    pathname === '/sw.js') {
		return NextResponse.next()
	}

	// Allow access to public paths
	if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
		const res = NextResponse.next()
		addSecurityHeaders(res)
		return res
	}

	// Check for Auth0 session
	let session = null
	try {
		session = await getSession(req, NextResponse.next())
	} catch (err) {
		console.error('Auth0 edge session retrieval failed:', (err as Error)?.message)
	}

	if (!session) {
		// Redirect to Auth0 domain with return URL
		const returnTo = encodeURIComponent(`${req.nextUrl.origin}${pathname}`)
		const redirectUrl = `https://${AUTH_DOMAIN}/login?returnTo=${returnTo}`
		const redirect = NextResponse.redirect(redirectUrl)
		addSecurityHeaders(redirect)
		return redirect
	}

	// Apply security headers to authenticated requests
	const res = NextResponse.next()
	addSecurityHeaders(res)
	return res
}

export const config = {
	matcher: ['/((?!_next|static).*)']
}

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
