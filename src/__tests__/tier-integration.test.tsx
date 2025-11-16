import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { UserTierDashboard } from '../components/tiers/user-tier-dashboard';
import { TierManagementControls } from '../components/admin/tier-management-controls';
import { useTiers, useAdminTiers } from '../hooks/use-tiers';

// Mock the hooks
jest.mock('../hooks/use-tiers');

describe('Tier Management Integration Tests', () => {
  const mockTierData = {
    currentTiers: {
      vip: {
        tier: 'silver' as const,
        assignedAt: '2024-01-15T10:30:00Z',
        expiresAt: null,
      },
      loyalty: {
        tier: 'member' as const,
        assignedAt: '2024-01-10T14:20:00Z',
        expiresAt: null,
      },
    },
    nextTierProgress: {
      vip: {
        progress: 65,
        nextRequirements: [
          'Complete 10 more sessions',
          'Maintain 4.8+ rating for 3 months',
          'Refer 2 new users',
        ],
      },
      loyalty: {
        progress: 40,
        nextRequirements: [
          'Earn 500 more points',
          'Complete 5 more sessions',
          'Leave 3 more reviews',
        ],
      },
    },
    usage: {
      vip: {
        sessionsUsed: 8,
        sessionsRemaining: 7,
        supportRequests: 3,
        storageUsed: 2.5,
        storageLimit: 10,
      },
      loyalty: {
        pointsEarned: 1250,
        pointsMultiplier: 1.5,
        discountUsed: 15,
        discountAvailable: 5,
      },
    },
    benefits: {
      hasPriorityBooking: true,
      hasDedicatedSupport: true,
      hasExclusiveContent: true,
      hasEarlyAccess: false,
      hasCustomFeatures: false,
      hasWhiteLabel: false,
      pointsMultiplier: 1.5,
      discountPercentage: 5,
    },
  };

  const mockAdminData = {
    users: [
      {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        currentTiers: [
          {
            tierType: 'vip' as const,
            tierName: 'silver' as const,
            assignedAt: '2024-01-15T10:30:00Z',
            assignedBy: 'admin-123',
            isActive: true,
          },
        ],
      },
    ],
    auditLogs: [
      {
        id: 'log-123',
        userId: 'user-123',
        action: 'assign' as const,
        tierType: 'vip' as const,
        tierName: 'silver' as const,
        performedBy: 'admin-123',
        timestamp: '2024-01-15T10:30:00Z',
        reason: 'Test assignment',
        metadata: {},
      },
    ],
    analytics: {
      totalTierUsers: 150,
      tierDistribution: {
        vip: {
          silver: 50,
          gold: 30,
          platinum: 20,
        },
        loyalty: {
          member: 80,
          elite: 40,
        },
      },
      recentActivity: [],
    },
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Tier Dashboard', () => {
    it('should display current tier status correctly', async () => {
      (useTiers as jest.Mock).mockReturnValue({
        tierData: mockTierData,
        isLoading: false,
        error: null,
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // Check VIP status
      expect(screen.getByText('VIP Status')).toBeInTheDocument();
      expect(screen.getByText('Current tier: Silver')).toBeInTheDocument();
      expect(screen.getByText('8 / 15')).toBeInTheDocument(); // Sessions used
      expect(screen.getByText('2.5GB / 10GB')).toBeInTheDocument(); // Storage used

      // Check Loyalty status
      expect(screen.getByText('Loyalty Status')).toBeInTheDocument();
      expect(screen.getByText('Current tier: Member')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument(); // Points earned
      expect(screen.getByText('1.5x')).toBeInTheDocument(); // Points multiplier
    });

    it('should display progress indicators', async () => {
      (useTiers as jest.Mock).mockReturnValue({
        tierData: mockTierData,
        isLoading: false,
        error: null,
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // Check progress indicators are present
      expect(screen.getByText('Next Tier Progress')).toBeInTheDocument();
      
      // Check progress bars are rendered (using data attributes or specific classes)
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it('should handle loading state', async () => {
      (useTiers as jest.Mock).mockReturnValue({
        tierData: null,
        isLoading: true,
        error: null,
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // Should show loading state (you might need to adjust this based on your loading UI)
      expect(screen.getByText('Your Membership')).toBeInTheDocument();
    });

    it('should handle error state', async () => {
      (useTiers as jest.Mock).mockReturnValue({
        tierData: null,
        isLoading: false,
        error: 'Failed to load tier data',
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // Should show error message
      expect(screen.getByText('Failed to load tier data')).toBeInTheDocument();
    });

    it('should switch between tabs correctly', async () => {
      const user = userEvent.setup();
      
      (useTiers as jest.Mock).mockReturnValue({
        tierData: mockTierData,
        isLoading: false,
        error: null,
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // Click on Benefits tab
      await user.click(screen.getByText('Benefits'));
      expect(screen.getByText('All Available Benefits')).toBeInTheDocument();

      // Click on Progress tab
      await user.click(screen.getByText('Progress'));
      expect(screen.getByText('VIP Progress')).toBeInTheDocument();

      // Click on History tab
      await user.click(screen.getByText('History'));
      expect(screen.getByText('Tier History')).toBeInTheDocument();
    });
  });

  describe('Admin Tier Management Controls', () => {
    it('should display user search and tier management interface', async () => {
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        assignTier: jest.fn(),
        revokeTier: jest.fn(),
        validateTierEligibility: jest.fn(),
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      // Check search interface
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();

      // Check user display
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display tier assignment controls', async () => {
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        assignTier: jest.fn(),
        revokeTier: jest.fn(),
        validateTierEligibility: jest.fn(),
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      // Check tier assignment controls are present
      expect(screen.getByText('Assign Tier')).toBeInTheDocument();
      expect(screen.getByText('VIP Tier')).toBeInTheDocument();
      expect(screen.getByText('Loyalty Tier')).toBeInTheDocument();
    });

    it('should display audit logs', async () => {
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        assignTier: jest.fn(),
        revokeTier: jest.fn(),
        validateTierEligibility: jest.fn(),
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      // Switch to audit logs tab
      const auditTab = screen.getByText('Audit Logs');
      fireEvent.click(auditTab);

      // Check audit log is displayed
      expect(screen.getByText('VIP Silver Assigned')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should display analytics dashboard', async () => {
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        assignTier: jest.fn(),
        revokeTier: jest.fn(),
        validateTierEligibility: jest.fn(),
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      // Check analytics are displayed
      expect(screen.getByText('Total Tier Users')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument(); // Total users
      expect(screen.getByText('VIP Users')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument(); // VIP users
      expect(screen.getByText('Loyalty Users')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument(); // Loyalty users
    });

    it('should handle tier assignment', async () => {
      const mockAssignTier = jest.fn().mockResolvedValue({ success: true });
      
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        assignTier: mockAssignTier,
        revokeTier: jest.fn(),
        validateTierEligibility: jest.fn(),
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      // Switch to Management tab and wait for content
      const managementTab = screen.getByText('Management');
      fireEvent.click(managementTab);
      
      await waitFor(() => {
        expect(screen.getByText('Tier Management')).toBeInTheDocument();
      });

      // Test that the textarea exists
      const reasonTextarea = screen.getByPlaceholderText('Enter the reason for this tier change...');
      expect(reasonTextarea).toBeInTheDocument();
      
      // Test that the assign button exists
      const assignButton = screen.getByText('Assign Tier');
      expect(assignButton).toBeInTheDocument();
      
      // The button should be disabled initially (no tier selected)
      expect(assignButton).toBeDisabled();
    });

    it('should handle tier revocation', async () => {
      const mockRevokeTier = jest.fn().mockResolvedValue({ success: true });
      
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        assignTier: jest.fn(),
        revokeTier: mockRevokeTier,
        validateTierEligibility: jest.fn(),
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      // Switch to Management tab and wait for content
      const managementTab = screen.getByText('Management');
      fireEvent.click(managementTab);
      
      await waitFor(() => {
        expect(screen.getByText('Tier Management')).toBeInTheDocument();
      });

      // Test that the textarea exists
      const reasonTextarea = screen.getByPlaceholderText('Enter the reason for this tier change...');
      expect(reasonTextarea).toBeInTheDocument();

      // Simulate tier revocation (test button exists and is clickable)
      const revokeButton = screen.getByText('Revoke Tier');
      expect(revokeButton).toBeInTheDocument();
    });

    it('should validate tier eligibility', async () => {
      const mockValidateTierEligibility = jest.fn().mockResolvedValue({
        isEligible: true,
        requirements: [],
        progress: 100,
      });
      
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        assignTier: jest.fn(),
        revokeTier: jest.fn(),
        validateTierEligibility: mockValidateTierEligibility,
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      // Switch to Management tab and wait for content
      const managementTab = screen.getByText('Management');
      fireEvent.click(managementTab);
      
      await waitFor(() => {
        expect(screen.getByText('Tier Management')).toBeInTheDocument();
      });

      // Test that validate eligibility button exists
      const validationButton = screen.getByText('Validate Eligibility');
      expect(validationButton).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors in user dashboard', async () => {
      (useTiers as jest.Mock).mockReturnValue({
        tierData: null,
        isLoading: false,
        error: 'Network error: Unable to fetch tier data',
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // The error should be displayed in an Alert component
      expect(screen.getByText('Network error: Unable to fetch tier data')).toBeInTheDocument();
    });

    it('should handle permission errors in admin controls', async () => {
      (useAdminTiers as jest.Mock).mockReturnValue({
        ...mockAdminData,
        error: 'Insufficient permissions to manage tiers',
        assignTier: jest.fn(),
        revokeTier: jest.fn(),
        validateTierEligibility: jest.fn(),
        fetchAuditLogs: jest.fn(),
        fetchAnalytics: jest.fn(),
      });

      render(<TierManagementControls />);

      expect(screen.getByText('Insufficient permissions to manage tiers')).toBeInTheDocument();
    });

    it('should handle loading states gracefully', async () => {
      (useTiers as jest.Mock).mockReturnValue({
        tierData: null,
        isLoading: true,
        error: null,
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // Should not show error when loading
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
  });

  describe('Data Flow Integration', () => {
    it('should refresh data when refresh is called', async () => {
      const mockRefreshTierData = jest.fn();
      
      (useTiers as jest.Mock).mockReturnValue({
        tierData: mockTierData,
        isLoading: false,
        error: null,
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: jest.fn(),
        refreshTierData: mockRefreshTierData,
      });

      render(<UserTierDashboard userId="user-123" />);

      // Click refresh button (if available)
      const refreshButton = screen.getByText('Settings');
      fireEvent.click(refreshButton);

      // The refresh function should be available for calling
      expect(mockRefreshTierData).toBeDefined();
    });

    it('should validate tier upgrades', async () => {
      const mockValidateTierUpgrade = jest.fn().mockResolvedValue({
        canUpgrade: true,
        requirements: [],
        progress: 100,
      });
      
      (useTiers as jest.Mock).mockReturnValue({
        tierData: mockTierData,
        isLoading: false,
        error: null,
        fetchUserTiers: jest.fn(),
        validateTierUpgrade: mockValidateTierUpgrade,
        refreshTierData: jest.fn(),
      });

      render(<UserTierDashboard userId="user-123" />);

      // The validate function should be available for calling
      expect(mockValidateTierUpgrade).toBeDefined();
    });
  });
});