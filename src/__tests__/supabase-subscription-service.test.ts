import { SupabaseSubscriptionService } from '@/services/supabase-subscription-service'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: [{ id: 'sub1', user_id: 'u1', type: 'vip', status: 'active', interval: 'monthly', price: 100, currency: 'usd', start_date: '2024', end_date: '2024', current_period_start: '2024', current_period_end: '2024', cancel_at_period_end: false }], error: null }),
    single: jest.fn().mockResolvedValue({ data: null, error: new Error('not found') })
  },
  supabaseAdmin: {}
}))

// Mock utils used in createSubscription path
jest.mock('@/lib/supabase-utils', () => ({
  safeSupabaseAdminInsert: jest.fn().mockResolvedValue({ data: { id: 'new-sub' }, error: null }),
  safeSupabaseAdminUpdate: jest.fn()
}))

describe('SupabaseSubscriptionService', () => {
  const service = new SupabaseSubscriptionService()

  it('returns mapped subscriptions list', async () => {
    const subs = await service.getUserSubscriptions('u1')
    expect(subs.length).toBe(1)
    expect(subs[0].id).toBe('sub1')
  })

  it('handles error fetching active subscription', async () => {
    const active = await service.getActiveSubscription('u1', 'vip' as any)
    expect(active).toBeNull()
  })

  it('hasActiveSubscription false when none active', async () => {
    expect(await service.hasActiveSubscription('u1', 'loyalty' as any)).toBe(false)
  })
})
