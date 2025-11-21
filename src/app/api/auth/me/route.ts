import { getSession } from '@auth0/nextjs-auth0/edge'

export const runtime = 'edge'

export async function GET(request: Request) {
  const session = await getSession(request as any)
  if (!session) {
    return new Response(JSON.stringify({ user: null }), { status: 200 })
  }
  // Strip tokens, return claims only
  const { user } = session
  return new Response(JSON.stringify({ user }), { headers: { 'Content-Type': 'application/json' } })
}