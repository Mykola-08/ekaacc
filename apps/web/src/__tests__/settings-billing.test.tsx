import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BillingSettings } from '@/components/settings/billing-settings';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('BillingSettings', () => {
  const mockRouter = { push: jest.fn() };
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('renders free plan state when no subscription found', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null }),
    });

    render(<BillingSettings />);

    await waitFor(() => {
      expect(screen.getByText('You are currently on the Free plan.')).toBeInTheDocument();
    });
    
    const upgradeBtn = screen.getByText('Upgrade Plan');
    fireEvent.click(upgradeBtn);
    expect(mockRouter.push).toHaveBeenCalledWith('/pricing');
  });

  it('renders active subscription details', async () => {
    const mockSubscription = {
      id: 'sub_123',
      status: 'active',
      current_period_end: new Date('2025-12-31').toISOString(),
      cancel_at_period_end: false,
      plan_type: 'pro',
      tier: {
        name: 'Pro Plan',
        monthly_price: 29,
        currency: 'USD',
      },
    };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockSubscription }),
    });

    render(<BillingSettings />);

    await waitFor(() => {
      expect(screen.getByText('Pro Plan')).toBeInTheDocument();
      // Use a flexible matcher for price since formatting might vary slightly (e.g. non-breaking space)
      expect(screen.getByText((content) => content.includes('$29.00'))).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });
  });

  it('handles manage subscription click', async () => {
     const mockSubscription = {
      id: 'sub_123',
      status: 'active',
      current_period_end: new Date('2025-12-31').toISOString(),
      cancel_at_period_end: false,
      plan_type: 'pro',
      tier: {
        name: 'Pro Plan',
        monthly_price: 29,
        currency: 'USD',
      },
    };

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockSubscription }),
    });

    // Mock fetch for portal
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ url: 'https://stripe.com/portal' }),
    });

    // Mock window.location.href
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { href: '' };

    render(<BillingSettings />);

    await waitFor(() => {
      expect(screen.getByText('Manage Subscription')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Manage Subscription'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stripe/portal', expect.objectContaining({ method: 'POST' }));
      expect(window.location.href).toBe('https://stripe.com/portal');
    });

    // Cleanup - use Object.defineProperty for proper restoration
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
  });
});
