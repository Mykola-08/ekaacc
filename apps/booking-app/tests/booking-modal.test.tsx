import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BookingModal } from '../components/BookingModal';
import { Service } from '../types/database';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

const mockService: Service = {
  id: 'service-1',
  name: 'Test Service',
  description: 'Test Description',
  duration: 60,
  price: 100,
  is_active: true,
  created_at: '2023-01-01',
  image_url: null,
};

describe('BookingModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button', () => {
    render(<BookingModal service={mockService} />);
    expect(screen.getByText('Book Now')).toBeDefined();
  });

  it('opens modal on click', () => {
    render(<BookingModal service={mockService} />);
    fireEvent.click(screen.getByText('Book Now'));
    expect(screen.getByText('Book Test Service')).toBeDefined();
    expect(screen.getByText(/Price: \$100/)).toBeDefined();
  });

  it('validates form inputs', async () => {
    render(<BookingModal service={mockService} />);
    fireEvent.click(screen.getByText('Book Now'));
    
    const submitBtn = screen.getByText('Pay €20 Deposit & Book');
    fireEvent.click(submitBtn);

    // Should show error toast
    const { toast } = await import('sonner');
    expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
  });
});
