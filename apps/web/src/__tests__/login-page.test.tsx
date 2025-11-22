import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { LoginForm } from '../components/login-form';

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

// Import after mock is set up
import { useAuth0 } from '@auth0/auth0-react';

describe('LoginForm Component', () => {
  const mockLoginWithRedirect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
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
    mockLoginWithRedirect.mockResolvedValue(undefined);
    
    render(<LoginForm />);

    const authButton = screen.getByRole('button', { name: /sign in.*sign up/i });
    fireEvent.click(authButton);

    await waitFor(() => {
      expect(mockLoginWithRedirect).toHaveBeenCalled();
    });
  });

  it('should render social login providers', async () => {
    render(<LoginForm />);

    // Check for social login buttons
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('should call loginWithRedirect on button click', async () => {
    mockLoginWithRedirect.mockResolvedValue(undefined);

    render(<LoginForm />);

    const authButton = screen.getByRole('button', { name: /sign in.*sign up/i });
    fireEvent.click(authButton);

    await waitFor(() => {
      expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
