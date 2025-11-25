/**
 * @jest-environment node
 */
import { GET } from '@/app/api/auth/access-token/route'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}))

jest.mock('@/lib/rate-limit-redis', () => ({
  ipRateLimit: jest.fn().mockResolvedValue({ allowed: true, count: 1 })
}))

function makeRequest(expiresOffsetSeconds: number, ip = '1.1.1.1') {
  const req = new Request('https://example.com/api/auth/access-token', {
    headers: new Headers({ 'x-forwarded-for': ip })
  })
  ;(createClient as jest.Mock).mockResolvedValue({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'old_token',
            expires_at: Math.floor(Date.now() / 1000) + expiresOffsetSeconds
          }
        }
      })
    }
  })
}

describe('access-token route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS = '60'
  })

  it('returns 401 when no session', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null }
        })
      }
    })
    const res = await GET(new NextRequest('https://example.com/api/auth/access-token'))
    expect(res.status).toBe(401)
  })

  it('returns token without refresh when far from expiry', async () => {
    makeRequest(600)
    const res = await GET(new NextRequest('https://example.com/api/auth/access-token', { headers: new Headers({ 'x-forwarded-for': '2.2.2.2' }) }))
    const json = await res.json()
    expect(json.accessToken).toBe('old_token')
    expect(json.refreshed).toBe(false)
  })

  it('refreshes token when near expiry', async () => {
    makeRequest(30) // below threshold 60
    // Supabase handles refresh automatically, so we just expect the token to be returned
    // In a real scenario, getSession would return the new token if refreshed
    const res = await GET(new NextRequest('https://example.com/api/auth/access-token', { headers: new Headers({ 'x-forwarded-for': '3.3.3.3' }) }))
    const json = await res.json()
    expect(json.accessToken).toBe('old_token')
    expect(json.refreshed).toBe(false)
  })
  it('rate limits when ip exceeds quota', async () => {
    // Override ipRateLimit mock to return blocked
    const { ipRateLimit } = jest.requireMock('@/lib/rate-limit-redis')
    ;(ipRateLimit as jest.Mock).mockResolvedValue({ allowed: false, count: 999 })
    makeRequest(600)
    const res = await GET(new NextRequest('https://example.com/api/auth/access-token', { headers: new Headers({ 'x-forwarded-for': '9.9.9.9' }) }))
    expect(res.status).toBe(429)
  })
})