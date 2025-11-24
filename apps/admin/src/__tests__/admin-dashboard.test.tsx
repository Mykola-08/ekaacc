import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import AdminDashboard from '../app/admin/dashboard/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useAuth
const mockStartImpersonation = jest.fn();
const mockEndImpersonation = jest.fn();
jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    user: { name: 'Admin User', role: { name: 'admin' } },
    isImpersonating: false,
    startImpersonation: mockStartImpersonation,
    endImpersonation: mockEndImpersonation,
  }),
}));

// Mock getAcademyStatistics
jest.mock('@/lib/academy/admin', () => ({
  getAcademyStatistics: jest.fn().mockResolvedValue({
    totalCourses: 10,
    totalEnrollments: 100,
    activeStudents: 50,
    completionRate: 80,
  }),
}));

// Mock UI components
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, onValueChange }: any) => <div onClick={() => onValueChange && onValueChange('users')}>{children}</div>,
  TabsContent: ({ children, value }: any) => <div data-testid={`tab-content-${value}`}>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button data-value={value}>{children}</button>,
}));

jest.mock('@/components/admin/enhanced-user-management', () => ({
  EnhancedUserManagement: () => <div>Enhanced User Management Component</div>,
}));
jest.mock('@/components/admin/analytics-dashboard', () => ({
  AnalyticsDashboard: () => <div>Analytics Dashboard Component</div>,
}));
jest.mock('@/components/admin/audit-log-viewer', () => ({
  AuditLogViewer: () => <div>Audit Log Viewer Component</div>,
}));
jest.mock('@/components/admin/system-configuration', () => ({
  SystemConfiguration: () => <div>System Configuration Component</div>,
}));
jest.mock('@/components/admin/user-impersonation', () => ({
  UserImpersonationDialog: () => <div>User Impersonation Dialog</div>,
}));
jest.mock('@/components/admin/admin-notification-system', () => ({
  AdminNotificationSystem: () => <div>Admin Notification System</div>,
}));
jest.mock('@/components/academy/admin-panel', () => ({
  AcademyAdminPanel: () => <div>Academy Admin Panel</div>,
}));
jest.mock('@/components/eka/page-container', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/eka/page-header', () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
jest.mock('@/components/eka/surface-panel', () => ({
  SurfacePanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render admin dashboard correctly', async () => {
    render(<AdminDashboard />);

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    
    // Wait for the academy stats to be fetched to avoid act() warning
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-academy')).toBeInTheDocument();
    });
  });

  it('should render overview tab content by default', async () => {
    render(<AdminDashboard />);
    
    // Check for overview content
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();

    // Wait for the academy stats to be fetched to avoid act() warning
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-academy')).toBeInTheDocument();
    });
  });

  it('should switch tabs correctly', async () => {
    render(<AdminDashboard />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    // Click on Users tab
    const usersTab = screen.getByText('Users');
    fireEvent.click(usersTab);
    
    // Check if Users content is displayed
    expect(screen.getByText('Enhanced User Management Component')).toBeInTheDocument();
    
    // Wait for the academy stats to be fetched to avoid act() warning
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-academy')).toBeInTheDocument();
    });
  });
});
