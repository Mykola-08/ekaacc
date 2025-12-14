import { fxBilling } from '@/lib/fx-billing';
import { safeSupabaseInsert } from '@/lib/supabase-utils';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
jest.mock('@/lib/supabase', () => {
  const mockChain = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  };
  return {
    supabase: mockChain,
  };
});

jest.mock('@/lib/supabase-utils', () => ({
  safeSupabaseInsert: jest.fn(),
  safeSupabaseUpdate: jest.fn(),
  safeSupabaseQuery: jest.fn(),
}));

describe('fxBilling', () => {
  const mockSupabaseChain = supabase as any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset chain mocks
    mockSupabaseChain.from.mockReturnThis();
    mockSupabaseChain.select.mockReturnThis();
    mockSupabaseChain.eq.mockReturnThis();
  });

  describe('getBalanceForClient', () => {
    it('should calculate balance correctly', async () => {
      const clientId = 'client-1';
      const mockTransactions = [
        { amount_eur: 100 },
        { amount_eur: -50 },
        { amount_eur: 25 }
      ];
      
      // Mock the chain: from -> select -> eq -> order -> Promise resolving to { data, error }
      mockSupabaseChain.order.mockResolvedValue({ data: mockTransactions, error: null });

      const result = await fxBilling.getBalanceForClient(clientId);

      expect(result.balance).toBe(75);
      expect(result.transactions).toEqual(mockTransactions);
      expect(mockSupabaseChain.from).toHaveBeenCalledWith('billing_transactions');
      expect(mockSupabaseChain.eq).toHaveBeenCalledWith('client_id', clientId);
    });

    it('should throw error when fetch fails', async () => {
      mockSupabaseChain.order.mockResolvedValue({ data: null, error: new Error('DB Error') });

      await expect(fxBilling.getBalanceForClient('client-1')).rejects.toThrow('Failed to fetch client balance');
    });
  });

  describe('applyAdjustment', () => {
    it('should apply adjustment successfully', async () => {
      const clientId = 'client-1';
      const amount = 50;
      const note = 'Refund';
      const mockData = { id: 'tx-1', amount_eur: amount };

      (safeSupabaseInsert as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      const result = await fxBilling.applyAdjustment(clientId, amount, note);

      expect(result).toEqual(mockData);
      expect(safeSupabaseInsert).toHaveBeenCalledWith(
        'billing_transactions',
        expect.objectContaining({
          client_id: clientId,
          amount_eur: amount,
          note: note,
          type: 'adjustment'
        })
      );
    });

    it('should throw error when adjustment fails', async () => {
      (safeSupabaseInsert as jest.Mock).mockResolvedValue({ data: null, error: new Error('Insert failed') });

      await expect(fxBilling.applyAdjustment('c1', 10)).rejects.toThrow('Failed to apply billing adjustment');
    });
  });
});
