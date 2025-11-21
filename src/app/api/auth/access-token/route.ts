import { getSession, getAccessToken } from '@auth0/nextjs-auth0/edge'
import { ipRateLimit } from '@/lib/rate-limit-redis'

const ACCESS_RATE_LIMIT = parseInt(process.env.ACCESS_TOKEN_RATE_LIMIT || '80', 10)
const ACCESS_RATE_WINDOW_SECONDS = 60

export const runtime = 'edge'

export async function GET(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const rl = await ipRateLimit(ip, 'access-token', ACCESS_RATE_LIMIT, ACCESS_RATE_WINDOW_SECONDS)
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 })
  }
  const session = await getSession(request as any)
  if (!session) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  }
  const nowSec = Math.floor(Date.now() / 1000)
  const expiresAt = session.accessTokenExpiresAt || nowSec + 30
  const threshold = parseInt(process.env.ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS || '60', 10)
  let accessToken = session.accessToken
  let refreshed = false
  if (expiresAt - nowSec < threshold) {
    try {
      const { accessToken: newToken, accessTokenExpiresAt: newExp } = await getAccessToken(request as any, { refresh: true })
      if (newToken) {
        accessToken = newToken
        refreshed = true
      }
      if (newExp) {
        // override expiresAt for response
        return new Response(JSON.stringify({ accessToken, expiresAt: newExp, refreshed }), { headers: { 'Content-Type': 'application/json' } })
      }
    } catch (e: any) {
      return new Response(JSON.stringify({ error: 'refresh_failed', detail: e.message, accessToken, expiresAt, refreshed }), { status: 200 })
    }
  }
  return new Response(JSON.stringify({ accessToken, expiresAt, refreshed }), { headers: { 'Content-Type': 'application/json' } })
}