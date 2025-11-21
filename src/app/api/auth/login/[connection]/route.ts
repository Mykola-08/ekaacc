import { handleLogin } from '@auth0/nextjs-auth0/edge'

export const runtime = 'edge'

export async function GET(request: Request, context: { params: Promise<{ connection: string }> }) {
  const resolvedParams = await context.params
  const { connection } = resolvedParams
  const url = new URL(request.url)
  const returnTo = url.searchParams.get('returnTo') || '/'
  const audience = process.env.PROD_AUTH0_AUDIENCE || process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
  const scope = process.env.AUTH0_SCOPE || 'openid profile email offline_access'
  return handleLogin(request, {
    returnTo,
    authorizationParams: {
      audience,
      scope,
      connection,
    }
  })
}