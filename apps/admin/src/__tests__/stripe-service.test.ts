import { StripeService } from '@/services/stripe-service';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: { create: jest.fn() },
    customers: { create: jest.fn() },
    refunds: { create: jest.fn() },
  }));
});

describe('StripeService', () => {
  const stripeService = StripeService.getInstance();


  describe('calculateWalletPrice', () => {
    it('should apply 0% discount for amounts < 100', () => {
      const result = stripeService.calculateWalletPrice(50);
      expect(result.discountPercent).toBe(0);
      expect(result.price).toBe(50);
    });

    it('should apply 1% discount for 100 EUR', () => {
      const result = stripeService.calculateWalletPrice(100);
      expect(result.discountPercent).toBe(1);
      expect(result.price).toBe(99);
    });

    it('should apply 10% discount for 1000 EUR', () => {
      const result = stripeService.calculateWalletPrice(1000);
      expect(result.discountPercent).toBe(10);
      expect(result.price).toBe(900);
    });

    it('should apply interpolated discount for 550 EUR', () => {
      const result = stripeService.calculateWalletPrice(550);
      // 550 / 100 = 5.5%
      expect(result.discountPercent).toBe(5.5);
      // 550 * (1 - 0.055) = 550 * 0.945 = 519.75
      expect(result.price).toBe(519.75);
    });
  });
});
