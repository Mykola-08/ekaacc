import {
  SystemRole,
  hasPermission,
  PermissionGroup,
  PermissionAction,
  SYSTEM_ROLES,
} from '@/lib/platform/config/role-permissions';
import {
  NavigationItem,
  NavigationPermission,
  NAVIGATION_CONFIG,
  getFlattenedNavigationItems,
} from '@/lib/platform/config/navigation-config';

export interface PermissionCheckResult {
  hasAccess: boolean;
  reason?: string;
  missingPermissions?: NavigationPermission[];
  conditionsMet?: boolean;
}

export interface CachedPermissions {
  userId: string;
  role: SystemRole;
  accessibleItems: NavigationItem[];
  restrictedItems: NavigationItem[];
  timestamp: number;
  ttl: number;
}

export interface PermissionAuditLog {
  id: string;
  userId: string;
  userRole: SystemRole;
  action: string;
  resource: string;
  result: boolean;
  reason?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

class PermissionService {
  private cache: Map<string, CachedPermissions> = new Map();
  private auditLogs: PermissionAuditLog[] = [];
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100;
  private readonly AUDIT_LOG_RETENTION = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    this.startCleanupInterval();
  }

  /**
   * Check if a user has permission for a specific navigation item
   */
  checkNavigationPermission(
    userRole: SystemRole,
    item: NavigationItem,
    context?: Record<string, any>
  ): PermissionCheckResult {
    const startTime = Date.now();
    const normalizedRole = String(userRole).toLowerCase() as SystemRole;

    try {
      // Validate that the user role exists
      const roleDefinition = SYSTEM_ROLES[normalizedRole];
      if (!roleDefinition) {
        return {
          hasAccess: false,
          reason: `Invalid role: ${userRole}`,
        };
      }

      // Check universal access first
      if (item.metadata?.universal) {
        return {
          hasAccess: true,
          reason: 'Universal access granted',
        };
      }

      // Check role-specific items
      if (item.metadata?.roleSpecific) {
        const requiredRole = String(item.metadata.roleSpecific).toLowerCase();
        if (requiredRole !== normalizedRole) {
          return {
            hasAccess: false,
            reason: `Role-specific item requires ${item.metadata.roleSpecific} role`,
          };
        }
      }

      // Check each permission requirement
      const missingPermissions: NavigationPermission[] = [];
      let hasAnyPermission = false;

      for (const permission of item.permissions) {
        // Add appropriate context based on permission group and action
        const enhancedContext = { ...context, ...permission.conditions };

        // For patient_data view_own, automatically add own: true if userId matches
        if (
          permission.group === 'patient_data' &&
          permission.action === 'view_own' &&
          context?.userId
        ) {
          enhancedContext.own = true;
        }

        const hasRequiredPermission = hasPermission(
          userRole,
          permission.group,
          permission.action,
          enhancedContext
        );

        if (hasRequiredPermission) {
          hasAnyPermission = true;
          break;
        } else {
          missingPermissions.push(permission);
        }
      }

      const result: PermissionCheckResult = {
        hasAccess: hasAnyPermission,
        missingPermissions: missingPermissions.length > 0 ? missingPermissions : undefined,
        reason: hasAnyPermission
          ? 'Permission granted'
          : `Missing required permissions: ${missingPermissions.map((p) => `${p.group}:${p.action}`).join(', ')}`,
      };

      // Log permission check for audit trail
      this.logPermissionCheck({
        userId: context?.userId || 'unknown',
        userRole,
        action: 'navigation_access',
        resource: item.id,
        result: result.hasAccess,
        reason: result.reason,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      });

      return result;
    } catch (error) {
      console.error('Error checking navigation permission:', error);

      this.logPermissionCheck({
        userId: context?.userId || 'unknown',
        userRole,
        action: 'navigation_access',
        resource: item.id,
        result: false,
        reason: `Error during permission check: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      });

      return {
        hasAccess: false,
        reason: 'System error during permission check',
      };
    } finally {
      const executionTime = Date.now() - startTime;
      if (executionTime > 100) {
        console.warn(`Slow permission check detected: ${executionTime}ms for item ${item.id}`);
      }
    }
  }

  /**
   * Get all accessible navigation items for a user role
   */
  getAccessibleNavigationItems(
    userId: string,
    userRole: SystemRole,
    context?: Record<string, any>
  ): NavigationItem[] {
    const cacheKey = `${userId}:${userRole}`;
    const cached = this.cache.get(cacheKey);

    // Check cache validity
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.accessibleItems;
    }

    // Filter items based on permissions
    const accessibleItems: NavigationItem[] = [];
    const restrictedItems: NavigationItem[] = [];

    for (const item of NAVIGATION_CONFIG.items) {
      const permissionResult = this.checkNavigationPermission(userRole, item, {
        ...context,
        userId,
      });

      if (permissionResult.hasAccess) {
        accessibleItems.push(item);
      } else {
        restrictedItems.push(item);
      }
    }

    // Cache the results
    this.setCache(cacheKey, {
      userId,
      role: userRole,
      accessibleItems,
      restrictedItems,
      timestamp: Date.now(),
      ttl: this.CACHE_TTL,
    });

    return accessibleItems;
  }

  /**
   * Get restricted navigation items for a user role
   */
  getRestrictedNavigationItems(
    userId: string,
    userRole: SystemRole,
    context?: Record<string, any>
  ): NavigationItem[] {
    const cacheKey = `${userId}:${userRole}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.restrictedItems;
    }

    // If cache miss, get accessible items which will populate cache
    this.getAccessibleNavigationItems(userId, userRole, context);

    // Return cached restricted items
    const updatedCached = this.cache.get(cacheKey);
    return updatedCached?.restrictedItems || [];
  }

  /**
   * Check if user can access a specific route
   */
  canAccessRoute(
    userRole: SystemRole,
    route: string,
    context?: Record<string, any>
  ): PermissionCheckResult {
    const item = getFlattenedNavigationItems(NAVIGATION_CONFIG.items).find(
      (item) => item.href === route
    );

    if (!item) {
      return {
        hasAccess: false,
        reason: 'Route not found in navigation configuration',
      };
    }

    return this.checkNavigationPermission(userRole, item, context);
  }

  /**
   * Invalidate cache for a specific user
   */
  invalidateUserCache(userId: string): void {
    for (const [key, cached] of this.cache.entries()) {
      if (cached.userId === userId) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    missRate: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const now = Date.now();
    let validEntries = 0;
    let oldestTimestamp: number | null = null;
    let newestTimestamp: number | null = null;

    for (const cached of this.cache.values()) {
      if (now - cached.timestamp < cached.ttl) {
        validEntries++;
        if (oldestTimestamp === null || cached.timestamp < oldestTimestamp) {
          oldestTimestamp = cached.timestamp;
        }
        if (newestTimestamp === null || cached.timestamp > newestTimestamp) {
          newestTimestamp = cached.timestamp;
        }
      }
    }

    return {
      size: validEntries,
      hitRate: 0, // Would need to track hits/misses
      missRate: 0,
      oldestEntry: oldestTimestamp,
      newestEntry: newestTimestamp,
    };
  }

  /**
   * Get permission audit logs
   */
  getAuditLogs(filters?: {
    userId?: string;
    userRole?: SystemRole;
    action?: string;
    resource?: string;
    result?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): PermissionAuditLog[] {
    let logs = [...this.auditLogs];

    // Clean old logs first
    this.cleanupAuditLogs();

    // Apply filters
    if (filters?.userId) {
      logs = logs.filter((log) => log.userId === filters.userId);
    }
    if (filters?.userRole) {
      logs = logs.filter((log) => log.userRole === filters.userRole);
    }
    if (filters?.action) {
      logs = logs.filter((log) => log.action === filters.action);
    }
    if (filters?.resource) {
      logs = logs.filter((log) => log.resource === filters.resource);
    }
    if (filters?.result !== undefined) {
      logs = logs.filter((log) => log.result === filters.result);
    }
    if (filters?.startDate) {
      logs = logs.filter((log) => new Date(log.timestamp) >= filters.startDate!);
    }
    if (filters?.endDate) {
      logs = logs.filter((log) => new Date(log.timestamp) <= filters.endDate!);
    }

    // Apply limit
    if (filters?.limit) {
      logs = logs.slice(-filters.limit);
    }

    return logs;
  }

  /**
   * Get security alerts from audit logs
   */
  getSecurityAlerts(): PermissionAuditLog[] {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    return this.auditLogs
      .filter((log) => {
        const logTime = new Date(log.timestamp);

        // Failed access attempts in the last hour
        if (!log.result && logTime >= oneHourAgo) {
          return true;
        }

        // Multiple failed attempts by same user
        const userFailedAttempts = this.auditLogs.filter(
          (l) => l.userId === log.userId && !l.result && new Date(l.timestamp) >= oneHourAgo
        );

        if (userFailedAttempts.length >= 5) {
          return true;
        }

        return false;
      })
      .slice(-50); // Limit to 50 most recent alerts
  }

  // Private methods

  private setCache(key: string, data: CachedPermissions): void {
    // Prevent cache from growing too large
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Remove oldest entry
      const oldestKey = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp
      )[0]?.[0];

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, data);
  }

  private logPermissionCheck(logData: Omit<PermissionAuditLog, 'id' | 'timestamp'>): void {
    const log: PermissionAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...logData,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.push(log);

    // Keep only recent logs to prevent memory issues
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-5000);
    }
  }

  private cleanupAuditLogs(): void {
    const cutoffDate = new Date(Date.now() - this.AUDIT_LOG_RETENTION);
    this.auditLogs = this.auditLogs.filter((log) => new Date(log.timestamp) >= cutoffDate);
  }

  private startCleanupInterval(): void {
    // Clean up expired cache entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.cache.entries()) {
        if (now - cached.timestamp >= cached.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60 * 1000);

    // Clean up old audit logs every hour
    setInterval(
      () => {
        this.cleanupAuditLogs();
      },
      60 * 60 * 1000
    );
  }
}

// Export singleton instance
export const permissionService = new PermissionService();

// Export helper functions for convenience
export function checkNavigationPermission(
  userRole: SystemRole,
  item: NavigationItem,
  context?: Record<string, any>
): PermissionCheckResult {
  return permissionService.checkNavigationPermission(userRole, item, context);
}

export function getAccessibleNavigationItems(
  userId: string,
  userRole: SystemRole,
  context?: Record<string, any>
): NavigationItem[] {
  return permissionService.getAccessibleNavigationItems(userId, userRole, context);
}

export function canAccessRoute(
  userRole: SystemRole,
  route: string,
  context?: Record<string, any>
): PermissionCheckResult {
  return permissionService.canAccessRoute(userRole, route, context);
}

export function invalidateUserPermissionCache(userId: string): void {
  permissionService.invalidateUserCache(userId);
}

export function getPermissionAuditLogs(
  filters?: Parameters<typeof permissionService.getAuditLogs>[0]
) {
  return permissionService.getAuditLogs(filters);
}

export function getSecurityAlerts() {
  return permissionService.getSecurityAlerts();
}
