import { useState, useEffect } from 'react';

interface TierData {
  currentTiers: {
    vip?: {
      tier: 'silver' | 'gold' | 'platinum';
      assignedAt: string;
      expiresAt: string | null;
    };
    loyalty?: {
      tier: 'member' | 'elite';
      assignedAt: string;
      expiresAt: string | null;
    };
  };
  nextTierProgress: {
    vip?: {
      progress: number;
      nextRequirements: string[];
    };
    loyalty?: {
      progress: number;
      nextRequirements: string[];
    };
  };
  usage: {
    sessionsUsed: number;
    sessionsRemaining: number;
    storageUsed: number;
    storageRemaining: number;
  };
  benefits: {
    hasPriorityBooking: boolean;
    hasDedicatedSupport: boolean;
    hasExclusiveContent: boolean;
    hasEarlyAccess: boolean;
    hasCustomFeatures: boolean;
    hasWhiteLabel: boolean;
    pointsMultiplier: number;
    discountPercentage: number;
  };
}

export function useTiers() {
  const [tierData, setTierData] = useState<TierData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTiers = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTierData: TierData = {
        currentTiers: {
          vip: {
            tier: 'silver',
            assignedAt: '2024-01-15T10:30:00Z',
            expiresAt: null,
          },
          loyalty: {
            tier: 'member',
            assignedAt: '2024-01-10T14:20:00Z',
            expiresAt: null,
          },
        },
        nextTierProgress: {
          vip: {
            progress: 65,
            nextRequirements: [
              'Complete 10 more sessions',
              'Increase monthly spend by €150',
              'Refer 2 more users'
            ],
          },
          loyalty: {
            progress: 85,
            nextRequirements: [
              'Earn 500 more loyalty points',
              'Maintain activity for 2 more months'
            ],
          },
        },
        usage: {
          sessionsUsed: 15,
          sessionsRemaining: 35,
          storageUsed: 2.5,
          storageRemaining: 7.5,
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
      
      setTierData(mockTierData);
      return mockTierData;
    } catch (err) {
      setError('Failed to fetch tier data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const validateTierUpgrade = async (userId: string, tierType: 'vip' | 'loyalty', targetTier: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        isValid: true,
        requirementsMet: true,
        missingRequirements: [],
        currentMetrics: {
          totalSpend: 250,
          totalSessions: 12,
          subscriptionDuration: 2,
          referralCount: 1
        },
        requiredMetrics: {
          minimumSpend: 500,
          minimumSessions: 20,
          minimumDuration: 3,
          referralCount: 2
        }
      };
    } catch (err) {
      setError('Failed to validate tier upgrade');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTierData = async (userId: string) => {
    return fetchUserTiers(userId);
  };

  // Initialize with mock data
  useEffect(() => {
    fetchUserTiers('user-123');
  }, []);

  return {
    tierData,
    isLoading,
    error,
    fetchUserTiers,
    validateTierUpgrade,
    refreshTierData,
  };
}

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  currentTiers: Array<{
    tierType: 'vip' | 'loyalty';
    tierName: string;
    assignedAt: string;
    assignedBy: string;
    isActive: boolean;
  }>;
}

interface AuditLog {
  id: string;
  userId: string;
  action: 'assign' | 'revoke';
  tierType: 'vip' | 'loyalty';
  tierName: string;
  performedBy: string;
  timestamp: string;
  reason: string;
  metadata: Record<string, any>;
}

interface AdminAnalytics {
  totalTierUsers: number;
  tierDistribution: {
    vip: {
      silver: number;
      gold: number;
      platinum: number;
    };
    loyalty: {
      member: number;
      elite: number;
    };
  };
  recentActivity: Array<{
    userId: string;
    action: string;
    timestamp: string;
  }>;
}

export function useAdminTiers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUsers: AdminUser[] = [
        {
          id: 'user-123',
          email: 'test@example.com',
          displayName: 'Test User',
          currentTiers: [
            {
              tierType: 'vip',
              tierName: 'silver',
              assignedAt: '2024-01-15T10:30:00Z',
              assignedBy: 'admin-123',
              isActive: true,
            },
          ],
        },
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockLogs: AuditLog[] = [
        {
          id: 'log-123',
          userId: 'user-123',
          action: 'assign',
          tierType: 'vip',
          tierName: 'silver',
          performedBy: 'admin-123',
          timestamp: '2024-01-15T10:30:00Z',
          reason: 'Test assignment',
          metadata: {},
        },
      ];
      
      setAuditLogs(mockLogs);
    } catch (err) {
      setError('Failed to fetch audit logs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockAnalytics: AdminAnalytics = {
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
      };
      
      setAnalytics(mockAnalytics);
    } catch (err) {
      setError('Failed to fetch analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignTier = async (userId: string, tierType: 'vip' | 'loyalty', tierName: string, reason: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Add audit log
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        userId,
        action: 'assign',
        tierType,
        tierName,
        performedBy: 'admin-123',
        timestamp: new Date().toISOString(),
        reason,
        metadata: {},
      };
      
      setAuditLogs(prev => [newLog, ...prev]);
      
      return { success: true };
    } catch (err) {
      setError('Failed to assign tier');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const revokeTier = async (userId: string, tierType: 'vip' | 'loyalty', reason: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Add audit log
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        userId,
        action: 'revoke',
        tierType,
        tierName: 'current',
        performedBy: 'admin-123',
        timestamp: new Date().toISOString(),
        reason,
        metadata: {},
      };
      
      setAuditLogs(prev => [newLog, ...prev]);
      
      return { success: true };
    } catch (err) {
      setError('Failed to revoke tier');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateTierEligibility = async (userId: string, tierType: 'vip' | 'loyalty', targetTier: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        isEligible: true,
        requirements: [],
        progress: 100,
      };
    } catch (err) {
      setError('Failed to validate eligibility');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize with mock data
  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
    fetchAnalytics();
  }, []);

  return {
    users,
    auditLogs,
    analytics,
    loading,
    error,
    assignTier,
    revokeTier,
    validateTierEligibility,
    fetchAuditLogs,
    fetchAnalytics,
  };
}