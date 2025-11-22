// Export the proxy middleware function
export { proxy as middleware } from './proxy'

// Define the matcher configuration directly (can't be re-exported)
// Exclude all Auth0 authentication routes and static assets from middleware
export const config = {
	matcher: [
		'/((?!api/auth|favicon.ico|_next|static).*)'
	]
}
