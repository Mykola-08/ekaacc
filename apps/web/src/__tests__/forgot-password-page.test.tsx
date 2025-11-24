import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ForgotPasswordPage from '../app/forgot-password/page';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

import { useRouter } from 'next/navigation';

describe('ForgotPasswordPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render the forgot password form', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('should show error if email is empty', async () => {
    const { container } = render(<ForgotPasswordPage />);
    const form = container.querySelector('form');
    
    if (form) {
      fireEvent.submit(form);
    }

    expect(toast.error).toHaveBeenCalledWith('Please enter your email address');
  });

  it('should call supabase resetPasswordForEmail on valid submission', async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({ error: null });
    
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: expect.stringContaining('/reset-password'),
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Password reset email sent! Check your inbox.');
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
  });

  it('should handle supabase error', async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({ 
      error: { message: 'Rate limit exceeded' } 
    });
    
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Rate limit exceeded');
    });
  });
});
