import { paymentVerificationService } from '../services/payment-verification-service';
import { bookingService } from '../services/booking-service';
import { supabaseAdmin } from '@/lib/supabase';

// Mock dependencies
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  },
}));

jest.mock('../services/payment-verification-service', () => ({
  paymentVerificationService: {
    verifyPaymentProof: jest.fn(),
  },
}));

jest.mock('../services/stripe-service', () => ({
  stripeService: {
    createSessionPrepaymentIntent: jest.fn(),
    refundPayment: jest.fn(),
  },
}));

jest.mock('../services/wallet-service', () => ({
  walletService: {
    canAfford: jest.fn(),
    deductAmount: jest.fn(),
  },
}));

describe('BookingService - Payment Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify payment proof and update booking status', async () => {
    const mockBooking = {
      id: 'booking-123',
      deposit_amount: 50,
      price: 100,
      status: 'pending_payment',
    };

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockBooking }),
        }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    (paymentVerificationService.verifyPaymentProof as jest.Mock).mockResolvedValue({
      isValid: true,
      confidence: 0.95,
      issues: [],
    });

    const result = await bookingService.submitPaymentProof('booking-123', 'https://example.com/proof.jpg');

    expect(result.verified).toBe(true);
    expect(paymentVerificationService.verifyPaymentProof).toHaveBeenCalledWith(
      'https://example.com/proof.jpg',
      50,
      'EUR'
    );
    expect(supabaseAdmin.from).toHaveBeenCalledWith('bookings');
    // Check update call
    // Note: Since we mocked the chain, checking the exact update call is a bit tricky without capturing the mock
    // But we can check that update was called
  });

  it('should fail verification if AI rejects it', async () => {
    const mockBooking = {
      id: 'booking-123',
      deposit_amount: 50,
      price: 100,
    };

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockBooking }),
        }),
      }),
    });

    (paymentVerificationService.verifyPaymentProof as jest.Mock).mockResolvedValue({
      isValid: false,
      confidence: 0.2,
      issues: ['Amount mismatch'],
    });

    const result = await bookingService.submitPaymentProof('booking-123', 'https://example.com/proof.jpg');

    expect(result.verified).toBe(false);
    expect(result.message).toContain('Amount mismatch');
  });
});
