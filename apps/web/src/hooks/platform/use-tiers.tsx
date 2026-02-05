import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { supabase } from '@/lib/platform/supabase';
import type { VIPTier, LoyaltyTier } from '@/lib/platform/types/subscription-types';
import type { PermissionGroup, PermissionAction } from '@/lib/platform/config/role-permissions';

export interface UserTierData {
  currentTiers: {
    vip: {
      tier: VIPTier;
      assignedAt: string;
      expiresAt: string | null;
    } | null;
    loyalty: {
      tier: LoyaltyTier;
      assignedAt: string;
      expiresAt: string | null;
    } | null;
  };
  nextTierProgress: {
    vip: {
      progress: number;
      nextRequirements: string[];
    } | null;
    loyalty: {
      progress: number;
      nextRequirements: string[];
    } | null;
  };
  usage: {
    vip: {
      sessionsUsed: number;
      sessionsRemaining: number;
      supportRequests: number;
      storageUsed: number;
      storageLimit: number;
    };
    loyalty: {
      pointsEarned: number;
      pointsMultiplier: number;
      discountUsed: number;
      discountAvailable: number;
    };
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

export interface TierValidationResult {
  isEligible: boolean;
  requirements: string[];
  progress: number;
  canUpgrade: boolean;
}

export interface UseTiersReturn {
  tierData: UserTierData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserTiers: () => Promise<void>;
  validateTierUpgrade: (tierType: 'vip' | 'loyalty', targetTier: VIPTier | LoyaltyTier) => Promise<TierValidationResult>;
  refreshTierData: () => Promise<void>;
}

export function useTiers(): UseTiersReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tierData, setTierData] = useState<UserTierData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTiers = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/user/tiers/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to fetch tier data');
      }

      const data = await response.json() as any;
      setTierData(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tier data';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const validateTierUpgrade = useCallback(async (
    tierType: 'vip' | 'loyalty', 
    targetTier: VIPTier | LoyaltyTier
  ): Promise<TierValidationResult> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/user/tiers/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetTierType: tierType,
          targetTierName: targetTier,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to validate tier upgrade');
      }

      const data = await response.json() as any;
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate tier upgrade';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [user, toast]);

  const refreshTierData = useCallback(async () => {
    await fetchUserTiers();
  }, [fetchUserTiers]);

  // Helper function to get auth token
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const { data: { session } } = await (supabase.auth as any).getSession();
      return session?.access_token || null;
    } catch {
      return null;
    }
  };

  // Fetch tier data on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUserTiers();
    }
  }, [user, fetchUserTiers]);

  return {
    tierData,
    isLoading,
    error,
    fetchUserTiers,
    validateTierUpgrade,
    refreshTierData,
  };
}

// Hook for admin tier management
export interface UseAdminTiersReturn {
  users: Array<{
    id: string;
    email: string;
    displayName: string;
    currentTiers: Array<{
      tierType: 'vip' | 'loyalty';
      tierName: VIPTier | LoyaltyTier;
      assignedAt: string;
      assignedBy: string;
      isActive: boolean;
    }>;
  }>;
  auditLogs: Array<{
    id: string;
    userId: string;
    action: 'assign' | 'revoke' | 'upgrade' | 'downgrade';
    tierType: 'vip' | 'loyalty';
    tierName: VIPTier | LoyaltyTier;
    performedBy: string;
    timestamp: string;
    reason: string;
    metadata: any;
  }>;
  analytics: {
    totalTierUsers: number;
    tierDistribution: {
      vip: Record<VIPTier, number>;
      loyalty: Record<LoyaltyTier, number>;
    };
    recentActivity: any[];
  };
  isLoading: boolean;
  error: string | null;
  assignTier: (userId: string, tierType: 'vip' | 'loyalty', tierName: VIPTier | LoyaltyTier, reason?: string) => Promise<void>;
  revokeTier: (userId: string, tierType: 'vip' | 'loyalty', tierName: VIPTier | LoyaltyTier, reason?: string) => Promise<void>;
  validateTierEligibility: (userId: string, tierType: 'vip' | 'loyalty', tierName: VIPTier | LoyaltyTier) => Promise<TierValidationResult>;
  fetchAuditLogs: (filters?: any) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
}

export function useAdminTiers(): UseAdminTiersReturn {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verify admin permissions
  const verifyAdminAccess = useCallback(() => {
    if (!user || !hasPermission({ group: 'user_management', action: 'manage' })) {
      throw new Error('Insufficient permissions');
    }
  }, [user, hasPermission]);

  const assignTier = useCallback(async (
    userId: string,
    tierType: 'vip' | 'loyalty',
    tierName: VIPTier | LoyaltyTier,
    reason?: string
  ) => {
    verifyAdminAccess();
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const response = await fetch('/api/admin/tiers/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tierType,
          tierName,
          reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to assign tier');
      }

      toast({
        title: 'Success',
        description: `Successfully assigned ${tierType} ${tierName} tier`,
      });

      // Refresh data
      await fetchAnalytics();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign tier';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [verifyAdminAccess, toast]);

  const revokeTier = useCallback(async (
    userId: string,
    tierType: 'vip' | 'loyalty',
    tierName: VIPTier | LoyaltyTier,
    reason?: string
  ) => {
    verifyAdminAccess();
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const response = await fetch('/api/admin/tiers/revoke', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tierType,
          tierName,
          reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to revoke tier');
      }

      toast({
        title: 'Success',
        description: `Successfully revoked ${tierType} ${tierName} tier`,
      });

      // Refresh data
      await fetchAnalytics();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to revoke tier';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [verifyAdminAccess, toast]);

  const validateTierEligibility = useCallback(async (
    userId: string,
    tierType: 'vip' | 'loyalty',
    tierName: VIPTier | LoyaltyTier
  ): Promise<TierValidationResult> => {
    verifyAdminAccess();

    try {
      const token = await getAuthToken();
      const response = await fetch('/api/admin/tiers/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tierType,
          tierName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to validate tier eligibility');
      }

      const data = await response.json() as any;
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate tier eligibility';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [verifyAdminAccess, toast]);

  const fetchAuditLogs = useCallback(async (filters?: any) => {
    verifyAdminAccess();
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const params = new URLSearchParams(filters || {});
      const response = await fetch(`/api/admin/tiers/audit-logs?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to fetch audit logs');
      }

      const data = await response.json() as any;
      setAuditLogs(data.data.logs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch audit logs';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [verifyAdminAccess, toast]);

  const fetchAnalytics = useCallback(async () => {
    verifyAdminAccess();
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const response = await fetch('/api/admin/tiers/analytics', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const data = await response.json() as any;
      setAnalytics(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [verifyAdminAccess, toast]);

  // Helper function to get auth token
  const getAuthToken = async (): Promise<string> => {
    try {
      const { data: { session } } = await (supabase.auth as any).getSession();
      return session?.access_token || '';
    } catch {
      return '';
    }
  };

  return {
    users,
    auditLogs,
    analytics,
    isLoading,
    error,
    assignTier,
    revokeTier,
    validateTierEligibility,
    fetchAuditLogs,
    fetchAnalytics,
  };
}
