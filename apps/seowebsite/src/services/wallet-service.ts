import type { Wallet, WalletTransaction } from '@/lib/platform/wallet-types';

export const walletService = {
  getBalance: async (_userId: string): Promise<number> => {
    // Stub implementation
    return 0;
  },
  processStripeTopUp: async (_userId: string, _credits: number, _paymentIntentId: string, _amount: number): Promise<void> => {
    // Stub implementation
    console.warn("processStripeTopUp called (stub)");
  },
  getWallet: async (userId: string): Promise<Wallet | null> => {
    // Stub implementation - return null when no wallet exists
    return {
      id: userId,
      userId,
      balance: 0,
      currency: 'EUR',
      isActive: true,
      isPaused: false,
      totalCredits: 0,
      totalDebits: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  getTransactions: async (_userId: string, _limit: number): Promise<WalletTransaction[]> => [],
};

export const getWalletService = async () => walletService;
