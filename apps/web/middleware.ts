// Export the proxy middleware function
export { proxy as middleware } from './proxy'

// Define the matcher configuration directly (can't be re-exported)
export const config = {
	matcher: [
		'/((?!api/auth/callback|api/auth/logout|favicon.ico|_next|static).*)'
	]
}
