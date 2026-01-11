export const getPaymentService = async () => ({
    confirmPaymentRequest: async (args: any) => ({ success: true }),
    rejectPaymentRequest: async (args: any) => ({ success: true }),
    getUserPaymentRequests: async (_userId: string) => [],
    createPaymentRequest: async (..._args: any[]) => ({ success: true }),
    getPendingPaymentRequests: async () => [],
});
