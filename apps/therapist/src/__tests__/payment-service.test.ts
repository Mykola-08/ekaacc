/**
 * @file Payment Service Tests
 * @description Unit tests for the Payment Service
 */

import { getPaymentService } from '../services/payment-service';

describe('PaymentService', () => {
  let paymentService: any;

  beforeEach(async () => {
    // Using mock data mode for testing
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
    paymentService = await getPaymentService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPayment', () => {
    it('should create a payment request successfully', async () => {
      const result = await paymentService.requestPayment({
        userId: 'user-123',
        amount: 50,
        method: 'bizum',
        description: 'Test payment',
      });

      expect(result).toHaveProperty('proof');
      expect(result.proof).toContain('Payment request');
    });

    it('should include amount and method in proof', async () => {
      const result = await paymentService.requestPayment({
        userId: 'user-123',
        amount: 75.50,
        method: 'cash',
        description: 'Cash payment',
      });

      expect(result.proof).toContain('75.5');
      expect(result.proof).toContain('cash');
    });
  });

  describe('getUserPaymentRequests', () => {
    it('should retrieve payment requests for a user', async () => {
      const requests = await paymentService.getUserPaymentRequests('user-123');
      expect(Array.isArray(requests)).toBe(true);
    });

    it('should return array for any user', async () => {
      const requests = await paymentService.getUserPaymentRequests('any-user');
      expect(Array.isArray(requests)).toBe(true);
    });
  });

  describe('getPendingPaymentRequests', () => {
    it('should retrieve pending payment requests', async () => {
      const requests = await paymentService.getPendingPaymentRequests();
      expect(Array.isArray(requests)).toBe(true);
    });
  });
});

