import { SystemRole } from '@/lib/platform/config/role-permissions';
import { NavigationItem } from '@/lib/platform/config/navigation-config';

export type SecurityEventType =
  | 'unauthorized_access_attempt'
  | 'permission_denied'
  | 'role_change'
  | 'navigation_access'
  | 'route_validation_failure'
  | 'permission_cache_miss'
  | 'system_error'
  | 'suspicious_activity';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string;
  userRole?: SystemRole;
  sessionId?: string;
  ipAddress: string;
  userAgent: string;
  resource: string;
  action: string;
  result: boolean;
  reason?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  processed: boolean;
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  title: string;
  description: string;
  userId?: string;
  userRole?: SystemRole;
  resource: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  autoResolved: boolean;
}

export interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<SecurityEventType, number>;
  eventsBySeverity: Record<SecuritySeverity, number>;
  activeAlerts: number;
  acknowledgedAlerts: number;
  autoResolvedAlerts: number;
  topResources: Array<{ resource: string; count: number }>;
  topUsers: Array<{ userId: string; count: number }>;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface SecurityNotificationConfig {
  enabled: boolean;
  emailAlerts: boolean;
  webhookAlerts: boolean;
  severityThreshold: SecuritySeverity;
  rateLimiting: {
    enabled: boolean;
    maxAlertsPerHour: number;
    burstThreshold: number;
  };
  destinations: {
    email?: string[];
    webhook?: string[];
  };
}

class SecurityMonitoringService {
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private notificationConfig: SecurityNotificationConfig;
  private alertThresholds: Record<SecuritySeverity, number>;
  private rateLimiter: Map<string, number[]> = new Map();

  constructor() {
    this.notificationConfig = {
      enabled: true,
      emailAlerts: false,
      webhookAlerts: false,
      severityThreshold: 'medium',
      rateLimiting: {
        enabled: true,
        maxAlertsPerHour: 50,
        burstThreshold: 10,
      },
      destinations: {},
    };

    this.alertThresholds = {
      low: 10,
      medium: 5,
      high: 1,
      critical: 1,
    };

    this.startCleanupInterval();
  }

  /**
   * Log a security event
   */
  logEvent(eventData: Omit<SecurityEvent, 'id' | 'timestamp' | 'processed'>): SecurityEvent {
    const event: SecurityEvent = {
      id: this.generateEventId(),
      ...eventData,
      timestamp: new Date().toISOString(),
      processed: false,
    };

    this.events.push(event);

    // Process event for potential alerts
    this.processEventForAlerts(event);

    // Maintain event limit to prevent memory issues
    if (this.events.length > 10000) {
      this.events = this.events.slice(-5000);
    }

    return event;
  }

  /**
   * Log unauthorized access attempt
   */
  logUnauthorizedAccess(
    userId: string,
    userRole: SystemRole,
    resource: string,
    reason: string,
    context?: Record<string, any>
  ): SecurityEvent {
    return this.logEvent({
      type: 'unauthorized_access_attempt',
      severity: 'high',
      userId,
      userRole,
      resource,
      action: 'access_denied',
      result: false,
      reason,
      ipAddress: context?.ipAddress || 'unknown',
      userAgent: context?.userAgent || 'unknown',
      metadata: context,
    });
  }

  /**
   * Log permission denied event
   */
  logPermissionDenied(
    userId: string,
    userRole: SystemRole,
    resource: string,
    requiredPermission: string,
    context?: Record<string, any>
  ): SecurityEvent {
    return this.logEvent({
      type: 'permission_denied',
      severity: 'medium',
      userId,
      userRole,
      resource,
      action: 'permission_check',
      result: false,
      reason: `Missing permission: ${requiredPermission}`,
      ipAddress: context?.ipAddress || 'unknown',
      userAgent: context?.userAgent || 'unknown',
      metadata: context,
    });
  }

  /**
   * Log navigation access
   */
  logNavigationAccess(
    userId: string,
    userRole: SystemRole,
    item: NavigationItem,
    result: boolean,
    reason?: string,
    context?: Record<string, any>
  ): SecurityEvent {
    return this.logEvent({
      type: 'navigation_access',
      severity: result ? 'low' : 'medium',
      userId,
      userRole,
      resource: item.id,
      action: 'navigation_check',
      result,
      reason,
      ipAddress: context?.ipAddress || 'unknown',
      userAgent: context?.userAgent || 'unknown',
      metadata: {
        href: item.href,
        label: item.label,
        category: item.category,
        ...context,
      },
    });
  }

  /**
   * Log suspicious activity
   */
  logSuspiciousActivity(
    userId: string,
    userRole: SystemRole,
    activity: string,
    severity: SecuritySeverity = 'medium',
    context?: Record<string, any>
  ): SecurityEvent {
    return this.logEvent({
      type: 'suspicious_activity',
      severity,
      userId,
      userRole,
      resource: 'system',
      action: activity,
      result: false,
      reason: 'Suspicious behavior detected',
      ipAddress: context?.ipAddress || 'unknown',
      userAgent: context?.userAgent || 'unknown',
      metadata: context,
    });
  }

  /**
   * Get security events with filtering
   */
  getEvents(filters?: {
    type?: SecurityEventType;
    severity?: SecuritySeverity;
    userId?: string;
    userRole?: SystemRole;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    processed?: boolean;
    limit?: number;
  }): SecurityEvent[] {
    let filteredEvents = [...this.events];

    if (filters?.type) {
      filteredEvents = filteredEvents.filter((e) => e.type === filters.type);
    }
    if (filters?.severity) {
      filteredEvents = filteredEvents.filter((e) => e.severity === filters.severity);
    }
    if (filters?.userId) {
      filteredEvents = filteredEvents.filter((e) => e.userId === filters.userId);
    }
    if (filters?.userRole) {
      filteredEvents = filteredEvents.filter((e) => e.userRole === filters.userRole);
    }
    if (filters?.resource) {
      filteredEvents = filteredEvents.filter((e) => e.resource === filters.resource);
    }
    if (filters?.processed !== undefined) {
      filteredEvents = filteredEvents.filter((e) => e.processed === filters.processed);
    }
    if (filters?.startDate) {
      filteredEvents = filteredEvents.filter((e) => new Date(e.timestamp) >= filters.startDate!);
    }
    if (filters?.endDate) {
      filteredEvents = filteredEvents.filter((e) => new Date(e.timestamp) <= filters.endDate!);
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    if (filters?.limit) {
      filteredEvents = filteredEvents.slice(0, filters.limit);
    }

    return filteredEvents;
  }

  /**
   * Get security alerts
   */
  getAlerts(filters?: {
    acknowledged?: boolean;
    severity?: SecuritySeverity;
    type?: SecurityEventType;
    userId?: string;
    autoResolved?: boolean;
    limit?: number;
  }): SecurityAlert[] {
    let filteredAlerts = [...this.alerts];

    if (filters?.acknowledged !== undefined) {
      filteredAlerts = filteredAlerts.filter((a) => a.acknowledged === filters.acknowledged);
    }
    if (filters?.severity) {
      filteredAlerts = filteredAlerts.filter((a) => a.severity === filters.severity);
    }
    if (filters?.type) {
      filteredAlerts = filteredAlerts.filter((a) => a.type === filters.type);
    }
    if (filters?.userId) {
      filteredAlerts = filteredAlerts.filter((a) => a.userId === filters.userId);
    }
    if (filters?.autoResolved !== undefined) {
      filteredAlerts = filteredAlerts.filter((a) => a.autoResolved === filters.autoResolved);
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    if (filters?.limit) {
      filteredAlerts = filteredAlerts.slice(0, filters.limit);
    }

    return filteredAlerts;
  }

  /**
   * Acknowledge security alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date().toISOString();

    return true;
  }

  /**
   * Get security metrics
   */
  getMetrics(timeRange?: { start: Date; end: Date }): SecurityMetrics {
    let events = this.events;

    if (timeRange) {
      events = events.filter((e) => {
        const eventTime = new Date(e.timestamp);
        return eventTime >= timeRange.start && eventTime <= timeRange.end;
      });
    }

    const eventsByType: Record<SecurityEventType, number> = {
      unauthorized_access_attempt: 0,
      permission_denied: 0,
      role_change: 0,
      navigation_access: 0,
      route_validation_failure: 0,
      permission_cache_miss: 0,
      system_error: 0,
      suspicious_activity: 0,
    };

    const eventsBySeverity: Record<SecuritySeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    const resourceCounts: Map<string, number> = new Map();
    const userCounts: Map<string, number> = new Map();

    events.forEach((event) => {
      eventsByType[event.type]++;
      eventsBySeverity[event.severity]++;

      resourceCounts.set(event.resource, (resourceCounts.get(event.resource) || 0) + 1);

      if (event.userId) {
        userCounts.set(event.userId, (userCounts.get(event.userId) || 0) + 1);
      }
    });

    const activeAlerts = this.alerts.filter((a) => !a.acknowledged && !a.autoResolved).length;
    const acknowledgedAlerts = this.alerts.filter((a) => a.acknowledged).length;
    const autoResolvedAlerts = this.alerts.filter((a) => a.autoResolved).length;

    const topResources = Array.from(resourceCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([resource, count]) => ({ resource, count }));

    const topUsers = Array.from(userCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([userId, count]) => ({ userId, count }));

    return {
      totalEvents: events.length,
      eventsByType,
      eventsBySeverity,
      activeAlerts,
      acknowledgedAlerts,
      autoResolvedAlerts,
      topResources,
      topUsers,
      timeRange: {
        start: timeRange?.start.toISOString() || new Date(0).toISOString(),
        end: timeRange?.end.toISOString() || new Date().toISOString(),
      },
    };
  }

  /**
   * Update notification configuration
   */
  updateNotificationConfig(config: Partial<SecurityNotificationConfig>): void {
    this.notificationConfig = { ...this.notificationConfig, ...config };
  }

  /**
   * Process event for potential alerts
   */
  private processEventForAlerts(event: SecurityEvent): void {
    // Skip if below severity threshold
    if (!this.shouldTriggerAlert(event)) {
      return;
    }

    // Check rate limiting
    if (!this.checkRateLimit(event.userId || event.ipAddress)) {
      return;
    }

    // Create alert
    const alert = this.createAlertFromEvent(event);
    this.alerts.push(alert);

    // Send notification if configured
    if (this.notificationConfig.enabled) {
      this.sendNotification(alert);
    }

    // Mark event as processed
    event.processed = true;
  }

  /**
   * Check if event should trigger alert
   */
  private shouldTriggerAlert(event: SecurityEvent): boolean {
    const severityLevels: Record<SecuritySeverity, number> = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };

    const thresholdLevel = severityLevels[this.notificationConfig.severityThreshold];
    const eventLevel = severityLevels[event.severity];

    if (eventLevel < thresholdLevel) {
      return false;
    }

    // Special rules for different event types
    switch (event.type) {
      case 'unauthorized_access_attempt':
        return event.severity === 'high' || event.severity === 'critical';

      case 'permission_denied':
        // Check for repeated permission denials
        const recentDenials = this.events.filter(
          (e) =>
            e.type === 'permission_denied' &&
            e.userId === event.userId &&
            new Date(e.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        );
        return recentDenials.length >= 3;

      case 'suspicious_activity':
        return event.severity === 'high' || event.severity === 'critical';

      default:
        return true;
    }
  }

  /**
   * Check rate limiting for alerts
   */
  private checkRateLimit(identifier: string): boolean {
    if (!this.notificationConfig.rateLimiting.enabled) {
      return true;
    }

    const now = Date.now();
    const windowStart = now - 60 * 60 * 1000; // 1 hour window

    const alerts = this.rateLimiter.get(identifier) || [];
    const recentAlerts = alerts.filter((timestamp) => timestamp > windowStart);

    // Update rate limiter
    this.rateLimiter.set(identifier, [...recentAlerts, now]);

    const maxAlerts = this.notificationConfig.rateLimiting.maxAlertsPerHour;
    return recentAlerts.length < maxAlerts;
  }

  /**
   * Create alert from security event
   */
  private createAlertFromEvent(event: SecurityEvent): SecurityAlert {
    const titles: Record<SecurityEventType, string> = {
      unauthorized_access_attempt: 'Unauthorized Access Attempt',
      permission_denied: 'Permission Denied',
      role_change: 'Role Change',
      navigation_access: 'Navigation Access',
      route_validation_failure: 'Route Validation Failure',
      permission_cache_miss: 'Permission Cache Miss',
      system_error: 'System Error',
      suspicious_activity: 'Suspicious Activity',
    };

    const title = titles[event.type] || 'Security Alert';
    const description = this.generateAlertDescription(event);

    return {
      id: this.generateAlertId(),
      eventId: event.id,
      type: event.type,
      severity: event.severity,
      title,
      description,
      userId: event.userId,
      userRole: event.userRole,
      resource: event.resource,
      timestamp: event.timestamp,
      acknowledged: false,
      autoResolved: false,
    };
  }

  /**
   * Generate alert description from event
   */
  private generateAlertDescription(event: SecurityEvent): string {
    const userInfo = event.userId ? `User ${event.userId}` : 'Anonymous user';
    const roleInfo = event.userRole ? ` (${event.userRole})` : '';
    const resourceInfo = event.resource ? ` to ${event.resource}` : '';
    const reasonInfo = event.reason ? `: ${event.reason}` : '';

    return `${userInfo}${roleInfo} attempted ${event.action}${resourceInfo}${reasonInfo}`;
  }

  /**
   * Send notification for alert
   */
  private sendNotification(alert: SecurityAlert): void {
    console.warn(`Security Alert: ${alert.title} - ${alert.description}`);

    try {
      // Async so we don't block
      import('@/lib/platform/services/email-client').then(({ getResend }) => {
        const resend = getResend();
        const adminEmail = process.env.ADMIN_EMAIL || 'contact@ekabalance.com';
        const sender = process.env.EMAIL_SENDER || 'Eka Platform <onboarding@resend.dev>';

        const htmlContent = `
          <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: ${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'black'}">Security Alert: ${alert.title}</h2>
            <p><strong>Severity:</strong> ${alert.severity}</p>
            <p><strong>Time:</strong> ${alert.timestamp}</p>
            <p><strong>User ID:</strong> ${alert.userId || 'N/A'}</p>
            <hr />
            <p>${alert.description}</p>
          </div>
        `;

        resend.emails
          .send({
            from: sender,
            to: [adminEmail],
            subject: `[${alert.severity.toUpperCase()}] Eka Security Alert: ${alert.title}`,
            html: htmlContent,
          })
          .catch((err) => console.error('Failed to send security alert email', err));
      });
    } catch (e) {
      console.error('Error triggering security alert notification', e);
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique alert ID
   */
  private generateAlertId(): string {
    return `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    // Clean up old events every hour
    setInterval(
      () => {
        const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
        this.events = this.events.filter((e) => new Date(e.timestamp) >= cutoffDate);
        this.alerts = this.alerts.filter((a) => new Date(a.timestamp) >= cutoffDate);
        this.rateLimiter.clear(); // Clear rate limiter periodically
      },
      60 * 60 * 1000
    );
  }
}

// Export singleton instance
export const securityMonitoring = new SecurityMonitoringService();

// Export helper functions
export function logSecurityEvent(eventData: Omit<SecurityEvent, 'id' | 'timestamp' | 'processed'>) {
  return securityMonitoring.logEvent(eventData);
}

export function logUnauthorizedAccess(
  userId: string,
  userRole: SystemRole,
  resource: string,
  reason: string,
  context?: Record<string, any>
) {
  return securityMonitoring.logUnauthorizedAccess(userId, userRole, resource, reason, context);
}

export function logPermissionDenied(
  userId: string,
  userRole: SystemRole,
  resource: string,
  requiredPermission: string,
  context?: Record<string, any>
) {
  return securityMonitoring.logPermissionDenied(
    userId,
    userRole,
    resource,
    requiredPermission,
    context
  );
}

export function logNavigationAccess(
  userId: string,
  userRole: SystemRole,
  item: NavigationItem,
  result: boolean,
  reason?: string,
  context?: Record<string, any>
) {
  return securityMonitoring.logNavigationAccess(userId, userRole, item, result, reason, context);
}

export function getSecurityEvents(filters?: Parameters<typeof securityMonitoring.getEvents>[0]) {
  return securityMonitoring.getEvents(filters);
}

export function getSecurityAlerts(filters?: Parameters<typeof securityMonitoring.getAlerts>[0]) {
  return securityMonitoring.getAlerts(filters);
}

export function acknowledgeSecurityAlert(alertId: string, acknowledgedBy: string) {
  return securityMonitoring.acknowledgeAlert(alertId, acknowledgedBy);
}

export function getSecurityMetrics(timeRange?: { start: Date; end: Date }) {
  return securityMonitoring.getMetrics(timeRange);
}
