import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ResetPasswordPage from '../app/reset-password/page';
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
      getSession: jest.fn(),
      updateUser: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

import { useRouter } from 'next/navigation';

describe('ResetPasswordPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should redirect if no session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid or expired reset link');
      expect(mockPush).toHaveBeenCalledWith('/forgot-password');
    });
  });

  it('should render form if session exists', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });
    
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText(/reset password/i)).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });
    
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText(/reset password/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith('Password must be at least 6 characters');
  });

  it('should validate password match', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });
    
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText(/reset password/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should call updateUser on valid submission', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });
    
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText(/reset password/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'password123' });
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully!');
      expect(mockPush).toHaveBeenCalledWith('/login?message=password_updated');
    });
  });
});
