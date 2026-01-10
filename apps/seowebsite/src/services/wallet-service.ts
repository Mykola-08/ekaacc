export const walletService = {
  getBalance: async (userId: string) => {
    // Stub implementation
    return 0;
  },
  processStripeTopUp: async (userId: string, credits: number, paymentIntentId: string, amount: number) => {
    // Stub implementation
    console.warn("processStripeTopUp called (stub)");
  },
  getWallet: async (_userId: string) => ({ balance: 0, credits: 0 }),
  getTransactions: async (_userId: string, _limit: number) => [],
};

export const getWalletService = async () => walletService;
