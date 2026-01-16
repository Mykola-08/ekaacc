import type { PaymentRequest } from '@/lib/platform/wallet-types';

export const getPaymentService = async () => ({
    confirmPaymentRequest: async (
        _paymentId: string,
        _verifierId: string,
        _verifierName: string,
        _verifierRole: 'Admin' | 'Therapist'
    ): Promise<{ success: boolean }> => ({ success: true }),
    rejectPaymentRequest: async (
        _paymentId: string,
        _verifierId: string,
        _verifierName: string,
        _verifierRole: 'Admin' | 'Therapist',
        _reason: string
    ): Promise<{ success: boolean }> => ({ success: true }),
    getUserPaymentRequests: async (_userId: string): Promise<PaymentRequest[]> => [],
    createPaymentRequest: async (
        _userId: string,
        _amount: number,
        _method: 'bizum' | 'cash' | string,
        _status?: string,
        _proofUrl?: string,
        _userName?: string
    ): Promise<{ success: boolean; id?: string }> => ({ success: true }),
    getPendingPaymentRequests: async (): Promise<PaymentRequest[]> => [],
});
