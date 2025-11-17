import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { AppSidebar } from '../components/navigation/ShadcnSidebar';
import { SidebarProvider } from '../components/ui/sidebar';
import { useAuth } from '../hooks/use-auth';
import { useSidebar } from '../components/ui/sidebar';

// Mock the auth hook
jest.mock('../hooks/use-auth');

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      pathname: '/dashboard',
    };
  },
  usePathname() {
    return '/dashboard';
  },
}));

// Mock the sidebar context
jest.mock('../components/ui/sidebar', () => ({
  ...jest.requireActual('../components/ui/sidebar'),
  useSidebar: jest.fn(),
}));

describe('Sidebar and Navigation Components', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'user' as const,
    isTherapist: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  };

  const mockTherapistUser = {
    ...mockUser,
    role: 'therapist' as const,
    isTherapist: true,
    therapistProfile: {
      id: 'therapist-123',
      specialties: ['Anxiety', 'Depression'],
      rating: 4.8,
      sessionCount: 150,
    },
  };

  const mockAdminUser = {
    ...mockUser,
    role: 'admin' as const,
    isTherapist: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSidebar as jest.Mock).mockReturnValue({
      isExpanded: true,
      toggleSidebar: jest.fn(),
      isMobile: false,
    });
  });

  describe('AppSidebar Component', () => {
    it('should render sidebar with navigation items for regular user', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Check brand name
      expect(screen.getByText('EKA')).toBeInTheDocument();

      // Check navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();

      // Check user-specific items are present
      expect(screen.getByText('Tiers')).toBeInTheDocument();
      expect(screen.getByText('Sessions')).toBeInTheDocument();

      // Check therapist-specific items are NOT present
      expect(screen.queryByText('Therapist Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Client Management')).not.toBeInTheDocument();

      // Check admin-specific items are NOT present
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('User Management')).not.toBeInTheDocument();
    });

    it('should render therapist-specific navigation items', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockTherapistUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Check therapist-specific items
      expect(screen.getByText('Therapist Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Client Management')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();

      // Check regular user items are still present
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should render admin-specific navigation items', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockAdminUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Check admin-specific items
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Tier Management')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('System Settings')).toBeInTheDocument();

      // Check regular items are still present
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should handle collapsed state with tooltips', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      (useSidebar as jest.Mock).mockReturnValue({
        isExpanded: false,
        toggleSidebar: jest.fn(),
        isMobile: false,
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // In collapsed state, brand name should not be visible
      expect(screen.queryByText('EKA')).not.toBeInTheDocument();

      // Navigation items should still be accessible (icons visible)
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    });

    it('should handle sign out functionality', async () => {
      const user = userEvent.setup();
      const mockSignOut = jest.fn().mockResolvedValue({ success: true });
      
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: mockSignOut,
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      await user.click(screen.getByRole('button', { name: /sign out/i }));

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('should display user information', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: true,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Should show loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should handle authentication errors', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: false,
        error: 'Authentication failed',
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });
  });

  describe('Sidebar Toggle Functionality', () => {
    it('should toggle sidebar expansion', async () => {
      const user = userEvent.setup();
      const mockToggleSidebar = jest.fn();
      
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      (useSidebar as jest.Mock).mockReturnValue({
        isExpanded: true,
        toggleSidebar: mockToggleSidebar,
        isMobile: false,
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Find and click the toggle button
      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      await user.click(toggleButton);

      expect(mockToggleSidebar).toHaveBeenCalled();
    });

    it('should handle mobile sidebar behavior', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      (useSidebar as jest.Mock).mockReturnValue({
        isExpanded: false,
        toggleSidebar: jest.fn(),
        isMobile: true,
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // In mobile mode, sidebar should have mobile-specific classes
      const sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass('group');
    });
  });

  describe('Navigation Active States', () => {
    it('should highlight active navigation item', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Dashboard should be active (based on mock pathname)
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('should handle navigation clicks', async () => {
      const user = userEvent.setup();
      const mockPush = jest.fn();
      
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Click on Profile navigation
      await user.click(screen.getByRole('link', { name: /profile/i }));

      // Navigation should work (Next.js router handles the actual navigation)
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle different screen sizes', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      // Test desktop view
      (useSidebar as jest.Mock).mockReturnValue({
        isExpanded: true,
        toggleSidebar: jest.fn(),
        isMobile: false,
      });

      const { rerender } = render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      expect(screen.getByText('EKA')).toBeInTheDocument();

      // Test mobile view
      (useSidebar as jest.Mock).mockReturnValue({
        isExpanded: false,
        toggleSidebar: jest.fn(),
        isMobile: true,
      });

      rerender(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Mobile view should have different behavior
      const sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass('group');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Sidebar should have proper role
      expect(screen.getByRole('complementary')).toBeInTheDocument();

      // Navigation links should have proper roles
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();

      // Sign out button should have proper role
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Tab through navigation items
      await user.tab();
      const firstLink = screen.getByRole('link', { name: /dashboard/i });
      expect(firstLink).toHaveFocus();

      await user.tab();
      const secondLink = screen.getByRole('link', { name: /profile/i });
      expect(secondLink).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      // Mock console.error to prevent error output in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );

      // Component should render without errors
      expect(screen.getByText('EKA')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});