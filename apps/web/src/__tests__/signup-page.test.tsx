import { render, screen, fireEvent } from '@testing-library/react';
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

describe('SignupFormEnhanced Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render signup form correctly', () => {
    render(<SignupFormEnhanced />);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Join EKA Account using Auth0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account with auth0/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  });

  it('should handle signup button click', () => {
    render(<SignupFormEnhanced />);

    const signupButton = screen.getByRole('button', { name: /create account with auth0/i });
    fireEvent.click(signupButton);

    expect(mockPush).toHaveBeenCalledWith('/api/auth/login?screen_hint=signup');
  });

  it('should render terms and privacy links', () => {
    render(<SignupFormEnhanced />);

    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
  });
});
