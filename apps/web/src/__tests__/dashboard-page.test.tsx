import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import DashboardPage from '../app/dashboard/page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useSimpleAuth
const mockUseSimpleAuth = jest.fn();
jest.mock('@/hooks/use-simple-auth', () => ({
  useSimpleAuth: () => mockUseSimpleAuth(),
}));

// Mock AuthGuard
jest.mock('@/components/auth/auth-guard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock UI components
jest.mock('@/components/eka/page-container', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/eka/surface-panel', () => ({
  SurfacePanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading skeleton when loading', () => {
    mockUseSimpleAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(<DashboardPage />);
    // Skeleton usually doesn't have text, but we can check if the redirect message is NOT there
    expect(screen.queryByText(/redirecting to your dashboard/i)).not.toBeInTheDocument();
  });

  it('should redirect therapist to therapist dashboard', async () => {
    mockUseSimpleAuth.mockReturnValue({
      user: {
        role: { name: 'therapist' },
      },
      isLoading: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/therapist/dashboard');
    });
  });

  it('should redirect regular user to home dashboard', async () => {
    mockUseSimpleAuth.mockReturnValue({
      user: {
        role: { name: 'user' },
      },
      isLoading: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('should redirect patient to home dashboard', async () => {
    mockUseSimpleAuth.mockReturnValue({
      user: {
        role: { name: 'patient' },
      },
      isLoading: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('should show redirect message while redirecting', () => {
    mockUseSimpleAuth.mockReturnValue({
      user: {
        role: { name: 'user' },
      },
      isLoading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText(/redirecting to your dashboard/i)).toBeInTheDocument();
  });
});
