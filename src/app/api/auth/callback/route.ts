import { handleCallback } from '@auth0/nextjs-auth0/edge'

export const runtime = 'edge'

export async function GET(request: Request) {
  // Use afterCallback to maintain temporary compatibility cookie until middleware updated.
  return handleCallback(request, {
    afterCallback: async (_req, session) => {
      // session.user available; we could sync additional data here if needed.
      return session
    }
  })
}
