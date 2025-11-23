describe('rate-limit-redis', () => {
  let rateLimit: any
  let ipRateLimit: any
  let mockExec: jest.Mock

  beforeEach(() => {
    jest.resetModules()
    mockExec = jest.fn()
    
    jest.doMock('@upstash/redis', () => ({
      Redis: {
        fromEnv: () => ({
          pipeline: () => ({
            incr: jest.fn().mockReturnThis(),
            expire: jest.fn().mockReturnThis(),
            exec: mockExec
          })
        })
      }
    }))

    // Require the module after mocking
    const mod = require('@/lib/rate-limit-redis')
    rateLimit = mod.rateLimit
    ipRateLimit = mod.ipRateLimit
  })

  it('allows when under limit', async () => {
    mockExec.mockResolvedValue([5])
    const res = await rateLimit({ key: 'test', limit: 10, windowSeconds: 60 })
    expect(res.allowed).toBe(true)
    expect(res.count).toBe(5)
  })

  it('blocks when over limit', async () => {
    mockExec.mockResolvedValue([15])
    const res = await rateLimit({ key: 'test', limit: 10, windowSeconds: 60 })
    expect(res.allowed).toBe(false)
    expect(res.count).toBe(15)
  })

  it('ipRateLimit delegates correctly', async () => {
    mockExec.mockResolvedValue([2])
    const res = await ipRateLimit('1.2.3.4', 'scope', 3, 30)
    expect(res.allowed).toBe(true)
    expect(res.count).toBe(2)
  })
})
