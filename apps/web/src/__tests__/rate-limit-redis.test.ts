import { rateLimit, ipRateLimit } from '@/lib/rate-limit-redis'

// Mock @upstash/redis
jest.mock('@upstash/redis', () => {
  class MockPipeline {
    private ops: string[] = []
    incr(_key: string) { this.ops.push('incr'); return this }
    expire(_key: string, _seconds: number) { this.ops.push('expire'); return this }
    async exec() {
      // Return count based on how many times incr was called relative to test scenario
      const count = (global as any).__TEST_COUNT__ ?? 0
      return [count]
    }
  }
  return {
    Redis: {
      fromEnv: () => ({ pipeline: () => new MockPipeline() })
    }
  }
})

describe('rate-limit-redis', () => {
  beforeEach(() => { (global as any).__TEST_COUNT__ = 0 })

  it('allows when under limit', async () => {
    ;(global as any).__TEST_COUNT__ = 5
    const res = await rateLimit({ key: 'test', limit: 10, windowSeconds: 60 })
    expect(res.allowed).toBe(true)
    expect(res.count).toBe(5)
  })

  it('blocks when over limit', async () => {
    ;(global as any).__TEST_COUNT__ = 15
    const res = await rateLimit({ key: 'test', limit: 10, windowSeconds: 60 })
    expect(res.allowed).toBe(false)
    expect(res.count).toBe(15)
  })

  it('ipRateLimit delegates correctly', async () => {
    ;(global as any).__TEST_COUNT__ = 2
    const res = await ipRateLimit('1.2.3.4', 'scope', 3, 30)
    expect(res.allowed).toBe(true)
    expect(res.count).toBe(2)
  })
})
