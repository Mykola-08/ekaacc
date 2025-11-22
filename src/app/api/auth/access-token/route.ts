import { getSession, getAccessToken } from '@auth0/nextjs-auth0/edge'
import { ipRateLimit } from '@/lib/rate-limit-redis'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const ACCESS_RATE_LIMIT = parseInt(process.env.ACCESS_TOKEN_RATE_LIMIT || '80', 10)
const ACCESS_RATE_WINDOW_SECONDS = 60

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const rl = await ipRateLimit(ip, 'access-token', ACCESS_RATE_LIMIT, ACCESS_RATE_WINDOW_SECONDS)
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 })
  }
  const session = await getSession(request, NextResponse.next())
  if (!session) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  }
  const nowSec = Math.floor(Date.now() / 1000)
  const expiresAt = (session as any).accessTokenExpiresAt || nowSec + 30
  const threshold = parseInt(process.env.ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS || '60', 10)
  let accessToken = session.accessToken
  let refreshed = false
  if (expiresAt - nowSec < threshold) {
    try {
      const result = await getAccessToken(request, NextResponse.next(), { refresh: true })
      const newToken = result?.accessToken
      const newExp = (result as any)?.accessTokenExpiresAt
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