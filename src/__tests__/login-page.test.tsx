import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { LoginForm } from '../components/login-form';
import { useSimpleAuth } from '../hooks/use-simple-auth';
import { useRouter } from 'next/navigation';

// Mock the auth hook
jest.mock('../hooks/use-simple-auth', () => ({
  useSimpleAuth: jest.fn()
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('LoginForm Component', () => {
  const mockSignIn = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useSimpleAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      isLoading: false
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });

  it('should render login form correctly', () => {
    render(<LoginForm />);

    // Auth0 Universal Login form
    expect(screen.getByRole('button', { name: /sign in.*sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in with auth0/i)).toBeInTheDocument();
  });

  it('should handle auth0 sign in button click', async () => {
    render(<LoginForm />);

    const authButton = screen.getByRole('button', { name: /sign in.*sign up/i });
    fireEvent.click(authButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it('should render social login providers', async () => {
    render(<LoginForm />);

    // Check for social login buttons
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('should disable button while loading', async () => {
    // Mock loading state initially or during the process
    // Since we control the hook mock, we can simulate loading state
    // But the component uses local state for loading based on the async call
    // So we can just check if the button gets disabled after click
    
    // We need to make the promise not resolve immediately to check loading state
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));

    render(<LoginForm />);

    // Auth0 Universal Login - click the main auth button
    const authButton = screen.getByRole('button', { name: /sign in.*sign up/i });
    fireEvent.click(authButton);

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
