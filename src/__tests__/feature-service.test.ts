import { FeatureService } from '@/services/feature-service'

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: jest.fn().mockImplementation((_fn: string, args: any) => {
      if (args.feature_key === 'enabled_feature') return Promise.resolve({ data: true, error: null })
      if (args.feature_key === 'disabled_feature') return Promise.resolve({ data: false, error: null })
      return Promise.resolve({ data: null, error: new Error('RPC Error') })
    }),
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ error: null }),
    delete: jest.fn().mockReturnThis(),
    match: jest.fn().mockResolvedValue({ error: null })
  })
}))

describe('FeatureService', () => {
  const service = new FeatureService()

  it('returns true for enabled feature', async () => {
    expect(await service.isFeatureEnabled('user1', 'enabled_feature')).toBe(true)
  })

  it('returns false for disabled feature', async () => {
    expect(await service.isFeatureEnabled('user1', 'disabled_feature')).toBe(false)
  })

  it('returns false on error', async () => {
    expect(await service.isFeatureEnabled('user1', 'unknown_feature')).toBe(false)
  })

  it('enrolls in program', async () => {
    expect(await service.enrollInProgram('user1', 'alpha')).toBe(true)
  })

  it('unenrolls from program', async () => {
    expect(await service.unenrollFromProgram('user1', 'alpha')).toBe(true)
  })
})
