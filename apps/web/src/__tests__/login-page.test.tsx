import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { LoginForm } from '../components/login-form';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useSimpleAuth
jest.mock('@/hooks/use-simple-auth', () => ({
  useSimpleAuth: jest.fn()
}));

import { useSimpleAuth } from '@/hooks/use-simple-auth';
import { useRouter } from 'next/navigation';

describe('LoginForm Component', () => {
  const mockSignIn = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useSimpleAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      isLoading: false,
      user: null,
    });
  });

  it('should render login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
  });

  it('should handle sign in', async () => {
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    
    const signInButton = screen.getByRole('button', { name: /^sign in$/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
