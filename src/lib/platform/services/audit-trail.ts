import { supabase } from '@/lib/platform/supabase';
import {
  safeSupabaseInsert,
  safeSupabaseQuery,
  safeSupabaseUpdate,
} from '@/lib/platform/supabase/utils';
import { SystemRole } from '@/lib/platform/config/role-permissions';
import { NavigationItem } from '@/lib/platform/config/navigation-config';

export type AuditEventType =
  | 'navigation_access_granted'
  | 'navigation_access_denied'
  | 'permission_check_passed'
  | 'permission_check_failed'
  | 'role_changed'
  | 'user_authenticated'
  | 'user_deauthenticated'
  | 'route_validation_success'
  | 'route_validation_failure'
  | 'security_alert_triggered'
  | 'permission_cache_invalidated'
  | 'system_error'
  | 'configuration_changed'
  | 'bulk_permission_update';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLogEntry {
  id: string;
  event_type: AuditEventType;
  severity: AuditSeverity;
  user_id?: string;
  user_role?: SystemRole;
  session_id?: string;
  ip_address: string;
  user_agent: string;
  resource: string;
  action: string;
  result: boolean;
  reason?: string;
  metadata?: Record<string, any>;
  processing_time_ms?: number;
  previous_state?: Record<string, any>;
  new_state?: Record<string, any>;
  created_at: string;
  processed_at?: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  retention_until?: string;
}

export interface AuditQueryFilters {
  event_type?: AuditEventType | AuditEventType[];
  severity?: AuditSeverity | AuditSeverity[];
  user_id?: string | string[];
  user_role?: SystemRole | SystemRole[];
  resource?: string | string[];
  result?: boolean;
  date_from?: Date;
  date_to?: Date;
  acknowledged?: boolean;
  limit?: number;
  offset?: number;
  order_by?: 'created_at' | 'severity' | 'user_id';
  order_direction?: 'asc' | 'desc';
}

export interface AuditMetrics {
  total_events: number;
  events_by_type: Record<AuditEventType, number>;
  events_by_severity: Record<AuditSeverity, number>;
  events_by_user_role: Record<SystemRole, number>;
  events_by_result: { success: number; failure: number };
  average_processing_time: number;
  top_resources: Array<{ resource: string; count: number }>;
  top_users: Array<{ user_id: string; count: number }>;
  time_range: {
    start: string;
    end: string;
  };
}

export interface AuditComplianceReport {
  report_id: string;
  generated_at: string;
  time_range: {
    start: string;
    end: string;
  };
  summary: {
    total_events: number;
    security_events: number;
    unauthorized_access_attempts: number;
    permission_denials: number;
    role_changes: number;
    system_errors: number;
  };
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    risk_factors: string[];
    recommendations: string[];
  };
  compliance_status: {
    data_retention: boolean;
    access_logging: boolean;
    permission_auditing: boolean;
    security_monitoring: boolean;
  };
}

class AuditTrailService {
  private static instance: AuditTrailService;
  private retentionDays: number = 90; // Default 90 days retention
  private batchSize: number = 1000;
  private maxRetries: number = 3;

  private constructor() {}

  public static getInstance(): AuditTrailService {
    if (!AuditTrailService.instance) {
      AuditTrailService.instance = new AuditTrailService();
    }
    return AuditTrailService.instance;
  }

  /**
   * Create a new audit log entry
   */
  async createAuditLog(
    entry: Omit<AuditLogEntry, 'id' | 'created_at'>
  ): Promise<AuditLogEntry | null> {
    try {
      const auditEntry: AuditLogEntry = {
        ...entry,
        id: this.generateAuditId(),
        created_at: new Date().toISOString(),
        retention_until: this.calculateRetentionDate(),
      };

      const { data, error } = await safeSupabaseInsert<any>('audit_logs', auditEntry);

      if (error) {
        console.error('Failed to create audit log:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating audit log:', error);
      return null;
    }
  }

  /**
   * Log navigation access event
   */
  async logNavigationAccess(
    userId: string,
    userRole: SystemRole,
    navigationItem: NavigationItem,
    result: boolean,
    reason?: string,
    context?: Record<string, any>
  ): Promise<AuditLogEntry | null> {
    return this.createAuditLog({
      event_type: result ? 'navigation_access_granted' : 'navigation_access_denied',
      severity: result ? 'info' : 'warning',
      user_id: userId,
      user_role: userRole,
      ip_address: context?.ip_address || 'unknown',
      user_agent: context?.user_agent || 'unknown',
      resource: navigationItem.href,
      action: 'navigation_access',
      result,
      reason,
      metadata: {
        navigation_item_id: navigationItem.id,
        navigation_item_label: navigationItem.label,
        navigation_item_category: navigationItem.category,
        required_permissions: navigationItem.permissions,
        ...context,
      },
    });
  }

  /**
   * Log permission check event
   */
  async logPermissionCheck(
    userId: string,
    userRole: SystemRole,
    permissionGroup: string,
    permissionAction: string,
    result: boolean,
    reason?: string,
    context?: Record<string, any>
  ): Promise<AuditLogEntry | null> {
    return this.createAuditLog({
      event_type: result ? 'permission_check_passed' : 'permission_check_failed',
      severity: result ? 'info' : 'warning',
      user_id: userId,
      user_role: userRole,
      ip_address: context?.ip_address || 'unknown',
      user_agent: context?.user_agent || 'unknown',
      resource: 'permission_system',
      action: `${permissionGroup}:${permissionAction}`,
      result,
      reason,
      metadata: {
        permission_group: permissionGroup,
        permission_action: permissionAction,
        ...context,
      },
    });
  }

  /**
   * Log role change event
   */
  async logRoleChange(
    userId: string,
    oldRole: SystemRole,
    newRole: SystemRole,
    changedBy: string,
    reason?: string,
    context?: Record<string, any>
  ): Promise<AuditLogEntry | null> {
    return this.createAuditLog({
      event_type: 'role_changed',
      severity: 'info',
      user_id: userId,
      user_role: newRole,
      ip_address: context?.ip_address || 'unknown',
      user_agent: context?.user_agent || 'unknown',
      resource: 'user_role',
      action: 'role_change',
      result: true,
      reason,
      previous_state: { role: oldRole },
      new_state: { role: newRole },
      metadata: {
        changed_by: changedBy,
        old_role: oldRole,
        new_role: newRole,
        ...context,
      },
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    eventType: 'security_alert_triggered',
    severity: AuditSeverity,
    resource: string,
    userId?: string,
    userRole?: SystemRole,
    reason?: string,
    context?: Record<string, any>
  ): Promise<AuditLogEntry | null> {
    return this.createAuditLog({
      event_type: eventType,
      severity,
      user_id: userId,
      user_role: userRole,
      ip_address: context?.ip_address || 'unknown',
      user_agent: context?.user_agent || 'unknown',
      resource,
      action: 'security_event',
      result: false,
      reason,
      metadata: context,
    });
  }

  /**
   * Query audit logs with filters
   */
  async queryAuditLogs(filters: AuditQueryFilters = {}): Promise<{
    logs: AuditLogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      let query = supabase.from('audit_logs').select('*', { count: 'exact' });

      // Apply filters
      if (filters.event_type) {
        const eventTypes = Array.isArray(filters.event_type)
          ? filters.event_type
          : [filters.event_type];
        query = query.in('event_type', eventTypes);
      }

      if (filters.severity) {
        const severities = Array.isArray(filters.severity) ? filters.severity : [filters.severity];
        query = query.in('severity', severities);
      }

      if (filters.user_id) {
        const userIds = Array.isArray(filters.user_id) ? filters.user_id : [filters.user_id];
        query = query.in('user_id', userIds);
      }

      if (filters.user_role) {
        const roles = Array.isArray(filters.user_role) ? filters.user_role : [filters.user_role];
        query = query.in('user_role', roles);
      }

      if (filters.resource) {
        const resources = Array.isArray(filters.resource) ? filters.resource : [filters.resource];
        query = query.in('resource', resources);
      }

      if (filters.result !== undefined) {
        query = query.eq('result', filters.result);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from.toISOString());
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to.toISOString());
      }

      if (filters.acknowledged !== undefined) {
        if (filters.acknowledged) {
          query = query.not('acknowledged_at', 'is', null);
        } else {
          query = query.is('acknowledged_at', null);
        }
      }

      // Apply ordering
      const orderBy = filters.order_by || 'created_at';
      const orderDirection = filters.order_direction || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      // Apply pagination
      const limit = filters.limit || 100;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (error) {
        console.error('Failed to query audit logs:', error);
        return { logs: [], total: 0, hasMore: false };
      }

      return {
        logs: data || [],
        total: count || 0,
        hasMore: (data?.length || 0) === limit,
      };
    } catch (error) {
      console.error('Error querying audit logs:', error);
      return { logs: [], total: 0, hasMore: false };
    }
  }

  /**
   * Get audit metrics for a specific time range
   */
  async getAuditMetrics(timeRange?: { start: Date; end: Date }): Promise<AuditMetrics> {
    const filters: AuditQueryFilters = {};

    if (timeRange) {
      filters.date_from = timeRange.start;
      filters.date_to = timeRange.end;
    }

    const { logs } = await this.queryAuditLogs(filters);

    const metrics: AuditMetrics = {
      total_events: logs.length,
      events_by_type: {
        navigation_access_granted: 0,
        navigation_access_denied: 0,
        permission_check_passed: 0,
        permission_check_failed: 0,
        role_changed: 0,
        user_authenticated: 0,
        user_deauthenticated: 0,
        route_validation_success: 0,
        route_validation_failure: 0,
        security_alert_triggered: 0,
        permission_cache_invalidated: 0,
        system_error: 0,
        configuration_changed: 0,
        bulk_permission_update: 0,
      },
      events_by_severity: {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0,
      },
      events_by_user_role: {
        admin: 0,
        therapist: 0,
        client: 0,
        patient: 0,
        reception: 0,
      },
      events_by_result: { success: 0, failure: 0 },
      average_processing_time: 0,
      top_resources: [],
      top_users: [],
      time_range: {
        start: timeRange?.start.toISOString() || new Date(0).toISOString(),
        end: timeRange?.end.toISOString() || new Date().toISOString(),
      },
    };

    const resourceCounts = new Map<string, number>();
    const userCounts = new Map<string, number>();
    let totalProcessingTime = 0;
    let processingTimeCount = 0;

    logs.forEach((log) => {
      // Count by type
      metrics.events_by_type[log.event_type]++;

      // Count by severity
      metrics.events_by_severity[log.severity]++;

      // Count by user role
      if (log.user_role) {
        metrics.events_by_user_role[log.user_role]++;
      }

      // Count by result
      if (log.result) {
        metrics.events_by_result.success++;
      } else {
        metrics.events_by_result.failure++;
      }

      // Count resources
      resourceCounts.set(log.resource, (resourceCounts.get(log.resource) || 0) + 1);

      // Count users
      if (log.user_id) {
        userCounts.set(log.user_id, (userCounts.get(log.user_id) || 0) + 1);
      }

      // Sum processing time
      if (log.processing_time_ms) {
        totalProcessingTime += log.processing_time_ms;
        processingTimeCount++;
      }
    });

    // Calculate average processing time
    metrics.average_processing_time =
      processingTimeCount > 0 ? totalProcessingTime / processingTimeCount : 0;

    // Get top resources
    metrics.top_resources = Array.from(resourceCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([resource, count]) => ({ resource, count }));

    // Get top users
    metrics.top_users = Array.from(userCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([user_id, count]) => ({ user_id, count }));

    return metrics;
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(timeRange: {
    start: Date;
    end: Date;
  }): Promise<AuditComplianceReport> {
    const filters: AuditQueryFilters = {
      date_from: timeRange.start,
      date_to: timeRange.end,
    };

    const { logs } = await this.queryAuditLogs(filters);
    const metrics = await this.getAuditMetrics(timeRange);

    const securityEvents = logs.filter(
      (log) =>
        log.event_type === 'security_alert_triggered' ||
        log.event_type === 'navigation_access_denied' ||
        log.event_type === 'permission_check_failed'
    );

    const unauthorizedAttempts = logs.filter(
      (log) => log.event_type === 'navigation_access_denied' && log.severity === 'warning'
    );

    const permissionDenials = logs.filter((log) => log.event_type === 'permission_check_failed');

    const roleChanges = logs.filter((log) => log.event_type === 'role_changed');

    const systemErrors = logs.filter((log) => log.event_type === 'system_error');

    // Risk assessment
    const riskFactors = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (unauthorizedAttempts.length > 10) {
      riskFactors.push('High number of unauthorized access attempts');
      riskLevel = 'high';
    }

    if (systemErrors.length > 5) {
      riskFactors.push('Multiple system errors detected');
      riskLevel = riskLevel === 'high' ? 'critical' : 'medium';
    }

    if (permissionDenials.length > 50) {
      riskFactors.push('Excessive permission denials');
      riskLevel = riskLevel === 'high' ? 'critical' : 'medium';
    }

    const recommendations = [
      'Regular review of permission configurations',
      'Monitor for suspicious access patterns',
      'Implement additional security measures for high-risk events',
    ];

    if (riskLevel === 'high' || riskLevel === 'critical') {
      recommendations.push('Immediate security review recommended');
    }

    return {
      report_id: this.generateReportId(),
      generated_at: new Date().toISOString(),
      time_range: {
        start: timeRange.start.toISOString(),
        end: timeRange.end.toISOString(),
      },
      summary: {
        total_events: metrics.total_events,
        security_events: securityEvents.length,
        unauthorized_access_attempts: unauthorizedAttempts.length,
        permission_denials: permissionDenials.length,
        role_changes: roleChanges.length,
        system_errors: systemErrors.length,
      },
      risk_assessment: {
        risk_level: riskLevel,
        risk_factors: riskFactors,
        recommendations,
      },
      compliance_status: {
        data_retention: true,
        access_logging: true,
        permission_auditing: true,
        security_monitoring: true,
      },
    };
  }

  /**
   * Acknowledge audit log entries
   */
  async acknowledgeAuditLogs(
    logIds: string[],
    acknowledgedBy: string
  ): Promise<{ success: boolean; count: number }> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .update({
          acknowledged_by: acknowledgedBy,
          acknowledged_at: new Date().toISOString(),
        })
        .in('id', logIds);

      if (error) {
        console.error('Failed to acknowledge audit logs:', error);
        return { success: false, count: 0 };
      }

      return { success: true, count: logIds.length };
    } catch (error) {
      console.error('Error acknowledging audit logs:', error);
      return { success: false, count: 0 };
    }
  }

  /**
   * Clean up old audit logs
   */
  async cleanupOldLogs(): Promise<{ deleted: number; error?: string }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      const { error } = await supabase
        .from('audit_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (error) {
        console.error('Failed to cleanup old audit logs:', error);
        return { deleted: 0, error: error.message };
      }

      return { deleted: 0 }; // Supabase doesn't return count for delete operations
    } catch (error) {
      console.error('Error cleaning up old audit logs:', error);
      return { deleted: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Set retention policy
   */
  setRetentionPolicy(days: number): void {
    this.retentionDays = Math.max(1, days); // Minimum 1 day
  }

  // Private helper methods

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateRetentionDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + this.retentionDays);
    return date.toISOString();
  }
}

// Export singleton instance
export const auditTrail = AuditTrailService.getInstance();

// Export helper functions for convenience
export async function logNavigationAccess(
  userId: string,
  userRole: SystemRole,
  navigationItem: NavigationItem,
  result: boolean,
  reason?: string,
  context?: Record<string, any>
) {
  return auditTrail.logNavigationAccess(userId, userRole, navigationItem, result, reason, context);
}

export async function logPermissionCheck(
  userId: string,
  userRole: SystemRole,
  permissionGroup: string,
  permissionAction: string,
  result: boolean,
  reason?: string,
  context?: Record<string, any>
) {
  return auditTrail.logPermissionCheck(
    userId,
    userRole,
    permissionGroup,
    permissionAction,
    result,
    reason,
    context
  );
}

export async function logRoleChange(
  userId: string,
  oldRole: SystemRole,
  newRole: SystemRole,
  changedBy: string,
  reason?: string,
  context?: Record<string, any>
) {
  return auditTrail.logRoleChange(userId, oldRole, newRole, changedBy, reason, context);
}

export async function logSecurityEvent(
  eventType: 'security_alert_triggered',
  severity: AuditSeverity,
  resource: string,
  userId?: string,
  userRole?: SystemRole,
  reason?: string,
  context?: Record<string, any>
) {
  return auditTrail.logSecurityEvent(
    eventType,
    severity,
    resource,
    userId,
    userRole,
    reason,
    context
  );
}

export async function queryAuditLogs(filters?: AuditQueryFilters) {
  return auditTrail.queryAuditLogs(filters);
}

export async function getAuditMetrics(timeRange?: { start: Date; end: Date }) {
  return auditTrail.getAuditMetrics(timeRange);
}

export async function generateComplianceReport(timeRange: { start: Date; end: Date }) {
  return auditTrail.generateComplianceReport(timeRange);
}

export async function acknowledgeAuditLogs(logIds: string[], acknowledgedBy: string) {
  return auditTrail.acknowledgeAuditLogs(logIds, acknowledgedBy);
}

export async function cleanupOldAuditLogs() {
  return auditTrail.cleanupOldLogs();
}
