import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '@/app/forgot-password/page';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ForgotPasswordPage (Admin)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { origin: 'http://localhost:3000' },
    });
  });

  it('renders the form initially', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument(); // Assuming button text implies sending
  });

  it('validates empty email', async () => {
    render(<ForgotPasswordPage />);
    
    const form = screen.getByPlaceholderText('Enter your email').closest('form');
    fireEvent.submit(form!);

    expect(toast.error).toHaveBeenCalledWith('Please enter your email address');
    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('handles successful password reset request', async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({ error: null });

    render(<ForgotPasswordPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    
    // Find button - likely "Send Reset Link" or similar. 
    // Since I don't see the button text in the snippet, I'll assume it's the submit button in the form.
    // I can use getByRole('button') if it's the only one, or look for type="submit"
    const form = screen.getByPlaceholderText('Enter your email').closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: 'http://localhost:3000/reset-password',
      });
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Password reset email sent'));
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    });
  });

  it('handles error from supabase', async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
      error: { message: 'Invalid email' },
    });

    render(<ForgotPasswordPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'invalid@example.com' },
    });
    
    const form = screen.getByPlaceholderText('Enter your email').closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid email');
      expect(screen.queryByText('Check Your Email')).not.toBeInTheDocument();
    });
  });
});
