// Auth0 Client for Next.js App Router with Edge Runtime
// All Auth0 handlers now use @auth0/nextjs-auth0/edge directly
// This file is kept for backward compatibility but should be migrated away from

// Re-export commonly used functions from the edge runtime
export { getSession, getAccessToken, withApiAuthRequired, withPageAuthRequired } from '@auth0/nextjs-auth0/edge'
