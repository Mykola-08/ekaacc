import { GET } from '@/app/api/auth/access-token/route'

jest.mock('@auth0/nextjs-auth0/edge', () => ({
  getSession: jest.fn(),
  getAccessToken: jest.fn()
}))

const { getSession, getAccessToken } = jest.requireMock('@auth0/nextjs-auth0/edge')

function makeRequest(expiresOffsetSeconds: number, ip = '1.1.1.1') {
  const req = new Request('https://example.com/api/auth/access-token', {
    headers: new Headers({ 'x-forwarded-for': ip })
  })
  ;(getSession as jest.Mock).mockResolvedValue({
    accessToken: 'old_token',
    accessTokenExpiresAt: Math.floor(Date.now() / 1000) + expiresOffsetSeconds
  })
}

describe('access-token route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS = '60'
  })

  it('returns 401 when no session', async () => {
    (getSession as jest.Mock).mockResolvedValue(null)
    const res = await GET(new Request('https://example.com/api/auth/access-token'))
    expect(res.status).toBe(401)
  })

  it('returns token without refresh when far from expiry', async () => {
    makeRequest(600)
    const res = await GET(new Request('https://example.com/api/auth/access-token', { headers: new Headers({ 'x-forwarded-for': '2.2.2.2' }) }))
    const json = await res.json()
    expect(json.accessToken).toBe('old_token')
    expect(json.refreshed).toBe(false)
    expect(getAccessToken).not.toHaveBeenCalled()
  })

  it('refreshes token when near expiry', async () => {
    makeRequest(10)
    ;(getAccessToken as jest.Mock).mockResolvedValue({ accessToken: 'new_token', accessTokenExpiresAt: Math.floor(Date.now() / 1000) + 300 })
    const res = await GET(new Request('https://example.com/api/auth/access-token', { headers: new Headers({ 'x-forwarded-for': '3.3.3.3' }) }))
    const json = await res.json()
    expect(json.accessToken).toBe('new_token')
    expect(json.refreshed).toBe(true)
    expect(getAccessToken).toHaveBeenCalled()
  })
})