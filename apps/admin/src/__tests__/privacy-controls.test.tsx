import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PrivacyControlsPage from '@/app/privacy-controls/page';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('@/ai/ai-personalization-service', () => {
  return {
    AIPersonalizationService: jest.fn().mockImplementation(() => ({
      trackUserInteraction: jest.fn(),
      updatePrivacySettings: jest.fn().mockResolvedValue(true),
      getPrivacySettings: jest.fn().mockResolvedValue({
        dataSharing: { aiTraining: false },
        visibility: { profileVisibility: 'private' },
      }),
    })),
  };
});

// Mock UI components
jest.mock('@/components/eka/page-container', () => ({
  PageContainer: ({ children }: any) => <div data-testid="page-container">{children}</div>,
}));

jest.mock('@/components/eka/surface-panel', () => ({
  SurfacePanel: ({ children, title }: any) => (
    <div data-testid="surface-panel">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

jest.mock('@/components/eka/page-header', () => ({
  PageHeader: ({ title }: any) => <h1>{title}</h1>,
}));

describe('PrivacyControlsPage (Admin)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'admin-user', email: 'admin@example.com' },
    });
  });

  it('renders privacy controls', () => {
    render(<PrivacyControlsPage />);
    expect(screen.getByText('Privacy & Data Controls')).toBeInTheDocument();
    expect(screen.getByText('Data Sharing Preferences')).toBeInTheDocument();
    expect(screen.getByText('Visibility Controls')).toBeInTheDocument();
  });

  it('toggles data sharing settings', async () => {
    render(<PrivacyControlsPage />);
    
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThan(0);
    
    fireEvent.click(switches[0]);
  });

  it('opens export data dialog', async () => {
    render(<PrivacyControlsPage />);
    
    const exportButton = screen.getByText(/Export My Data/i);
    fireEvent.click(exportButton);
    
    expect(screen.getByText(/Export Your Data/i)).toBeInTheDocument();
  });
});
