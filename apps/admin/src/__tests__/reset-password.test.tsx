import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordPage from '@/app/reset-password/page';
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
      getSession: jest.fn(),
      updateUser: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ResetPasswordPage (Admin)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('redirects if session is invalid', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });

    render(<ResetPasswordPage />);

    expect(screen.getByText('Verifying...')).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid or expired reset link');
      expect(mockPush).toHaveBeenCalledWith('/forgot-password');
    });
  });

  it('renders form if session is valid', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });

    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });
  });

  it('validates password mismatch', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });

    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'password456' } });

    const form = screen.getByLabelText('New Password').closest('form');
    fireEvent.submit(form!);

    expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('handles successful password update', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });

    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'newpassword123' } });

    const form = screen.getByLabelText('New Password').closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newpassword123' });
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully!');
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login?message=password_updated');
    });
  });
});
