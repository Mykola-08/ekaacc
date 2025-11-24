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

// Mock Data Service
const mockUpdateUser = jest.fn();
jest.mock('@/services/data-service', () => ({
  getDataService: jest.fn().mockResolvedValue({
    updateUser: mockUpdateUser,
  }),
}));

// Mock Components
jest.mock('@/components/eka/comprehensive-onboarding', () => ({
  ComprehensiveOnboarding: ({ onComplete, onSkip }: any) => (
    <div data-testid="onboarding-form">
      <button onClick={() => onComplete({ layoutPreference: 'focused', goal: 'stress' })}>Complete</button>
      <button onClick={onSkip}>Skip</button>
    </div>
  ),
}));

jest.mock('@/components/eka/onboarding/onboarding-shell', () => ({
  OnboardingShell: ({ children }: any) => <div data-testid="onboarding-shell">{children}</div>,
}));

jest.mock('@/components/medical-disclaimer', () => () => <div data-testid="medical-disclaimer" />);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('OnboardingPage', () => {
  const mockRouter = { push: jest.fn() };
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('redirects if user already onboarded', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', personalizationCompleted: true },
    });

    render(<OnboardingPage />);
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Already onboarded!' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/home');
  });

  it('renders onboarding form if not onboarded', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', personalizationCompleted: false },
    });

    render(<OnboardingPage />);
    
    expect(screen.getByTestId('onboarding-form')).toBeInTheDocument();
  });

  it('handles completion successfully', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', personalizationCompleted: false, settings: {} },
    });
    mockUpdateUser.mockResolvedValue(true);

    render(<OnboardingPage />);
    
    fireEvent.click(screen.getByText('Complete'));
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('u1', expect.objectContaining({
        personalizationCompleted: true,
        personalization: { goal: 'stress' },
        settings: {
          appPreferences: { layoutMode: 'focused' }
        }
      }));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Welcome aboard!' }));
    });
    
    // Wait for timeout
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/home');
    }, { timeout: 2000 });
  });

  it('handles skip successfully', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', personalizationCompleted: false },
    });
    mockUpdateUser.mockResolvedValue(true);

    render(<OnboardingPage />);
    
    fireEvent.click(screen.getByText('Skip'));
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('u1', expect.objectContaining({
        personalizationCompleted: true
      }));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Onboarding skipped' }));
    });
  });
});
