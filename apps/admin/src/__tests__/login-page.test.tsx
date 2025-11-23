import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { LoginForm } from '../components/login-form';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

// Import after mock is set up
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';

describe('LoginForm Component', () => {
  const mockLoginWithRedirect = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth0 as jest.Mock).mockReturnValue({
      loginWithRedirect: mockLoginWithRedirect,
      isLoading: false,
      isAuthenticated: false,
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
      expect(mockPush).toHaveBeenCalledWith('/api/auth/login');
    });
  });

  it('should render social login providers', async () => {
    render(<LoginForm />);

    // Check for social login buttons
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });
});
