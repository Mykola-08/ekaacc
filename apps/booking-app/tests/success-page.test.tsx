import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SuccessPage from '../app/(main)/success/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === 'session_id') return 'test-session-id';
      return null;
    },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('SuccessPage', () => {
  it('renders confirmation message', () => {
    render(<SuccessPage />);
    expect(screen.getByText('Booking Confirmed!')).toBeDefined();
    expect(screen.getByText('Return to Home')).toBeDefined();
  });
});
