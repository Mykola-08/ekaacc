export const walletService = {
  getBalance: async (userId: string) => {
    // Stub implementation
    return 0;
  },
  processStripeTopUp: async (userId: string, credits: number, paymentIntentId: string, amount: number) => {
    // Stub implementation
    console.warn("processStripeTopUp called (stub)");
  }
};

export const getWalletService = async () => walletService;
