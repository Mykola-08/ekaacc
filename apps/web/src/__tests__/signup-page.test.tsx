import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { SignupFormEnhanced } from '../components/signup-form-enhanced';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useSimpleAuth
const mockSignUp = jest.fn();
jest.mock('@/hooks/use-simple-auth', () => ({
  useSimpleAuth: () => ({
    signUp: mockSignUp,
    isLoading: false,
  }),
}));

describe('SignupFormEnhanced Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render signup form correctly', () => {
    render(<SignupFormEnhanced />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should handle signup submission', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    render(<SignupFormEnhanced />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    const signupButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        fullName: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockPush).toHaveBeenCalledWith('/login?message=Account created. Please sign in.');
    });
  });

  it('should render terms and privacy links', () => {
    render(<SignupFormEnhanced />);

    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
  });
});
