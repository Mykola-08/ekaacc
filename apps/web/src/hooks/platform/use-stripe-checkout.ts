'use client';

import { useState } from 'react';
import type { SubscriptionType, SubscriptionInterval } from '@/lib/platform/types/subscription-types';

interface CheckoutParams {
  userId: string;
  userEmail: string;
  tierId: string;
  subscriptionType: SubscriptionType;
  interval: SubscriptionInterval;
}

interface UseStripeCheckoutResult {
  initiateCheckout: (params: CheckoutParams) => Promise<void>;
  openCustomerPortal: (customerId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for handling Stripe checkout and customer portal
 */
export function useStripeCheckout(): UseStripeCheckoutResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (params: CheckoutParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const data = await response.json() as any;
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await response.json() as any;

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async (customerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        const data = await response.json() as any;
        throw new Error(data.error || 'Failed to open customer portal');
      }

      const { url } = await response.json() as any;

      if (url) {
        // Redirect to Stripe Customer Portal
        window.location.href = url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Portal access failed';
      setError(errorMessage);
      console.error('Portal error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiateCheckout,
    openCustomerPortal,
    loading,
    error,
  };
}
