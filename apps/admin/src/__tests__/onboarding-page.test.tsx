import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingPage from '@/app/onboarding/page';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock child components to simplify testing
jest.mock('@/components/eka/comprehensive-onboarding', () => ({
  ComprehensiveOnboarding: ({ onComplete, onSkip }: any) => (
    <div data-testid="comprehensive-onboarding">
      <button onClick={() => onComplete({ layoutPreference: 'modern', theme: 'dark' })}>
        Complete Onboarding
      </button>
      <button onClick={onSkip}>Skip Onboarding</button>
    </div>
  ),
}));

jest.mock('@/components/eka/onboarding/onboarding-shell', () => ({
  OnboardingShell: ({ children }: any) => <div data-testid="onboarding-shell">{children}</div>,
}));

jest.mock('@/components/medical-disclaimer', () => () => <div data-testid="medical-disclaimer" />);

// Mock dynamic import of data-service
jest.mock('@/services/data-service', () => ({
  getDataService: jest.fn(),
}));

describe('OnboardingPage (Admin)', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    // Setup data service mock
    const { getDataService } = require('@/services/data-service');
    getDataService.mockResolvedValue({
      updateUser: mockUpdateUser,
    });
  });

  it('redirects if user is already onboarded', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1', personalizationCompleted: true },
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Already onboarded!',
      }));
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('renders onboarding components when user is not onboarded', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1', personalizationCompleted: false },
    });

    render(<OnboardingPage />);

    expect(screen.getByTestId('onboarding-shell')).toBeInTheDocument();
    expect(screen.getByTestId('comprehensive-onboarding')).toBeInTheDocument();
    expect(screen.getByTestId('medical-disclaimer')).toBeInTheDocument();
  });

  it('handles completion successfully', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1', personalizationCompleted: false, settings: {} },
    });

    render(<OnboardingPage />);

    fireEvent.click(screen.getByText('Complete Onboarding'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('user-1', expect.objectContaining({
        personalizationCompleted: true,
        personalization: { theme: 'dark' },
        settings: {
          appPreferences: { layoutMode: 'modern' }
        }
      }));
      
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Welcome aboard!',
      }));
    });

    // Wait for timeout redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    }, { timeout: 2000 });
  });

  it('handles skip successfully', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1', personalizationCompleted: false },
    });

    render(<OnboardingPage />);

    fireEvent.click(screen.getByText('Skip Onboarding'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('user-1', {
        personalizationCompleted: true
      });
      
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Onboarding skipped',
      }));
    });
  });

  it('redirects to login if user is missing during completion', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    render(<OnboardingPage />);

    fireEvent.click(screen.getByText('Complete Onboarding'));

    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      variant: 'destructive',
      title: 'Error',
    }));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
