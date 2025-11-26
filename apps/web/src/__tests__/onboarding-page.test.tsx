import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import OnboardingPage from '../app/onboarding/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('OnboardingPage', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('redirects to auth app onboarding', () => {
    render(<OnboardingPage />);
    expect(window.location.href).toContain('/onboarding');
    expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
  });
});
