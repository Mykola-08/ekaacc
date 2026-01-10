export const getPaymentService = async () => ({
    confirmPaymentRequest: async (args: any) => ({ success: true }),
    rejectPaymentRequest: async (args: any) => ({ success: true }),
});
