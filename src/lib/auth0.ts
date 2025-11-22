import { Auth0Client } from '@auth0/nextjs-auth0/server'

/**
 * Auth0 SDK client for Next.js App Router
 * Handles authentication, session management, and token operations
 * 
 * Required environment variables:
 * - AUTH0_SECRET: Random secret for cookie encryption (generate with: openssl rand -base64 32)
 * - AUTH0_BASE_URL: Your app URL (e.g., https://app.ekabalance.com)
 * - AUTH0_ISSUER_BASE_URL: Your Auth0 domain (e.g., https://auth.ekabalance.com)
 * - AUTH0_CLIENT_ID: Your Auth0 application client ID
 * - AUTH0_CLIENT_SECRET: Your Auth0 application client secret
 * - AUTH0_AUDIENCE: Your Auth0 API identifier (optional, e.g., https://api.ekabalance.com)
 * - AUTH0_SCOPE: OAuth scopes (default: openid profile email offline_access)
 */
export const auth0 = new Auth0Client({
  // Auth0 automatically reads from environment variables:
  // - domain from AUTH0_DOMAIN or AUTH0_ISSUER_BASE_URL
  // - clientId from AUTH0_CLIENT_ID
  // - clientSecret from AUTH0_CLIENT_SECRET
  // - secret from AUTH0_SECRET
  // - appBaseUrl from AUTH0_BASE_URL
})
