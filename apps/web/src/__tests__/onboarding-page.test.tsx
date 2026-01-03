import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import OnboardingPage from '../app/onboarding/page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

// Mock useSimpleAuth
const mockUpdateProfile = jest.fn();
jest.mock('@/hooks/use-simple-auth', () => ({
  useSimpleAuth: jest.fn(() => ({
    user: { id: 'test-user' },
    isAuthenticated: true,
    isLoading: false,
    updateProfile: mockUpdateProfile,
  })),
}));

describe('OnboardingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders onboarding form', () => {
    render(<OnboardingPage />);
    expect(screen.getByText(/Welcome to EKA Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/I am a.../i)).toBeInTheDocument();
    expect(screen.getByText('Patient')).toBeInTheDocument();
    expect(screen.getByText('Therapist')).toBeInTheDocument();
  });

  it('completes onboarding as patient', async () => {
    render(<OnboardingPage />);
    
    // Select Patient (default, but clicking to be sure)
    fireEvent.click(screen.getByText('Patient'));
    
    const submitButton = screen.getByText('Get Started');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        personalizationCompleted: true,
      });
      expect(mockPush).toHaveBeenCalledWith('/auth-dispatch');
    });
  });
});
