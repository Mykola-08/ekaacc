import { createClient } from '@/lib/supabase/server'
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
  
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  }
  
  return new Response(JSON.stringify({ 
    accessToken: session.access_token, 
    expiresAt: session.expires_at, 
    refreshed: false 
  }), { headers: { 'Content-Type': 'application/json' } })
}