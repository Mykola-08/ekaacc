import { NextRequest, NextResponse } from 'next/server';
import { SystemRole, hasPermission, PermissionGroup, PermissionAction } from '@/lib/platform/config/role-permissions';
import { canAccessRoute } from '@/lib/platform/services/permission-service';
import { logSecurityEvent, logUnauthorizedAccess } from '@/lib/platform/services/security-service';
import { supabase } from '@/lib/platform/supabase';
import { safeSupabaseQuery } from '@/lib/platform/supabase/utils';

export interface RouteValidationResult {
  hasAccess: boolean;
  reason: string;
  missingPermissions?: string[];
  userRole?: SystemRole;
  userId?: string;
}

export interface RoutePermission {
  group: PermissionGroup;
  action: PermissionAction;
  conditions?: Record<string, any>;
}

export interface RouteConfig {
  path: string;
  permissions: RoutePermission[];
  requireAuth: boolean;
  allowRoles?: SystemRole[];
  denyRoles?: SystemRole[];
  metadata?: Record<string, any>;
}

/**
 * Server-side route validation middleware
 */
export async function validateRouteAccess(
  request: NextRequest,
  routeConfig: RouteConfig
): Promise<RouteValidationResult> {
  const startTime = Date.now();
  
  try {
    // Get user session from request
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '') || request.cookies.get('sb-access-token')?.value;
    
    if (!sessionToken && routeConfig.requireAuth) {
      logSecurityEvent({
        type: 'unauthorized_access_attempt',
        severity: 'high',
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: routeConfig.path,
        action: 'access_attempt',
        result: false,
        reason: 'No authentication token provided'
      });

      return {
        hasAccess: false,
        reason: 'Authentication required'
      };
    }

    // Get user from session

    const { data: { user: authUser }, error: authError } = await (supabase.auth as any).getUser(sessionToken);
    
    if (authError || !authUser) {
      logSecurityEvent({
        type: 'unauthorized_access_attempt',
        severity: 'high',
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: routeConfig.path,
        action: 'access_attempt',
        result: false,
        reason: authError?.message || 'Invalid authentication token'
      });

      return {
        hasAccess: false,
        reason: 'Invalid authentication'
      };
    }

    // Get user role from database
    const { data: userData, error: userError } = await safeSupabaseQuery<any>(
      supabase
        .from('users')
        .select(`
          *,
          user_roles!inner (
            role,
            is_active
          )
        `)
        .eq('id', authUser.id)
        .single()
    );

    if (userError || !userData) {
      logSecurityEvent({
        type: 'system_error',
        severity: 'medium',
        userId: authUser.id,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: routeConfig.path,
        action: 'user_lookup',
        result: false,
        reason: userError?.message || 'User not found in database'
      });

      return {
        hasAccess: false,
        reason: 'User account not found'
      };
    }

    const userRole = userData.user_roles?.[0]?.role as SystemRole;
    const isActive = userData.user_roles?.[0]?.is_active ?? true;

    if (!isActive) {
      logSecurityEvent({
        type: 'unauthorized_access_attempt',
        severity: 'high',
        userId: authUser.id,
        userRole,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: routeConfig.path,
        action: 'access_attempt',
        result: false,
        reason: 'User account is inactive'
      });

      return {
        hasAccess: false,
        reason: 'User account is inactive'
      };
    }

    // Check role-based access
    if (routeConfig.denyRoles?.includes(userRole)) {
      logUnauthorizedAccess(
        authUser.id,
        userRole,
        routeConfig.path,
        `Role ${userRole} is explicitly denied access`,
        { ipAddress: getClientIP(request), userAgent: request.headers.get('user-agent') || undefined }
      );

      return {
        hasAccess: false,
        reason: `Role ${userRole} is not authorized to access this resource`,
        userRole,
        userId: authUser.id
      };
    }

    if (routeConfig.allowRoles && !routeConfig.allowRoles.includes(userRole)) {
      logUnauthorizedAccess(
        authUser.id,
        userRole,
        routeConfig.path,
        `Role ${userRole} is not in allowed roles list`,
        { ipAddress: getClientIP(request), userAgent: request.headers.get('user-agent') || undefined }
      );

      return {
        hasAccess: false,
        reason: `Role ${userRole} is not authorized to access this resource`,
        userRole,
        userId: authUser.id
      };
    }

    // Check permission-based access
    if (routeConfig.permissions.length > 0) {
      const missingPermissions: string[] = [];
      let hasRequiredPermission = false;

      for (const permission of routeConfig.permissions) {
        const hasRequired = hasPermission(
          userRole,
          permission.group,
          permission.action,
          permission.conditions
        );

        if (hasRequired) {
          hasRequiredPermission = true;
          break;
        } else {
          missingPermissions.push(`${permission.group}:${permission.action}`);
        }
      }

      if (!hasRequiredPermission) {
        logUnauthorizedAccess(
          authUser.id,
          userRole,
          routeConfig.path,
          `Missing required permissions: ${missingPermissions.join(', ')}`,
          { ipAddress: getClientIP(request), userAgent: request.headers.get('user-agent') || undefined }
        );

        return {
          hasAccess: false,
          reason: 'Insufficient permissions',
          missingPermissions,
          userRole,
          userId: authUser.id
        };
      }
    }

    // Log successful access
    logSecurityEvent({
      type: 'navigation_access',
      severity: 'low',
      userId: authUser.id,
      userRole,
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      resource: routeConfig.path,
      action: 'access_granted',
      result: true,
      reason: 'Access granted'
    });

    const executionTime = Date.now() - startTime;
    if (executionTime > 500) {
      console.warn(`Slow route validation detected: ${executionTime}ms for path ${routeConfig.path}`);
    }

    return {
      hasAccess: true,
      reason: 'Access granted',
      userRole,
      userId: authUser.id
    };
  } catch (error) {
    console.error('Route validation error:', error);
    
    logSecurityEvent({
      type: 'system_error',
      severity: 'high',
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      resource: routeConfig.path,
      action: 'validation_error',
      result: false,
      reason: error instanceof Error ? error.message : 'Unknown error during validation'
    });

    return {
      hasAccess: false,
      reason: 'System error during validation'
    };
  }
}

/**
 * Middleware function for Next.js API routes
 */
export async function withRouteValidation(
  handler: (request: NextRequest, context: { userId: string; userRole: SystemRole }) => Promise<NextResponse>,
  routeConfig: RouteConfig
) {
  return async (request: NextRequest) => {
    const validationResult = await validateRouteAccess(request, routeConfig);
    
    if (!validationResult.hasAccess) {
      return NextResponse.json(
        { 
          error: 'Access denied',
          reason: validationResult.reason,
          missingPermissions: validationResult.missingPermissions
        },
        { 
          status: 403,
          headers: {
            'X-Access-Denied-Reason': validationResult.reason,
            'X-User-Role': validationResult.userRole || 'unknown'
          }
        }
      );
    }

    // Add user context to request for use in handler
    const context = {
      userId: validationResult.userId!,
      userRole: validationResult.userRole!
    };

    return handler(request, context);
  };
}

/**
 * Route configurations for common paths
 */
export const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  // Admin routes
  '/api/admin/*': {
    path: '/api/admin/*',
    permissions: [{ group: 'system_settings', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin'],
    metadata: { adminOnly: true }
  },
  
  // User management routes
  '/api/users/*': {
    path: '/api/users/*',
    permissions: [{ group: 'user_management', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Therapist', 'Reception'],
    metadata: { sensitive: true }
  },
  
  // Financial routes
  '/api/payments/*': {
    path: '/api/payments/*',
    permissions: [{ group: 'financial_management', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Accountant'],
    metadata: { financial: true }
  },
  
  // Patient data routes
  '/api/patients/*': {
    path: '/api/patients/*',
    permissions: [
      { group: 'patient_data', action: 'view_own' },
      { group: 'patient_data', action: 'view_all' }
    ],
    requireAuth: true,
    allowRoles: ['Admin', 'Therapist', 'Reception', 'Patient'],
    metadata: { patientData: true }
  },
  
  // Appointment routes
  '/api/appointments/*': {
    path: '/api/appointments/*',
    permissions: [{ group: 'appointment_management', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Therapist', 'Reception', 'Patient'],
    metadata: { appointmentRelated: true }
  },
  
  // Content management routes
  '/api/content/*': {
    path: '/api/content/*',
    permissions: [{ group: 'content_management', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Content Manager'],
    metadata: { contentManagement: true }
  },
  
  // Analytics routes
  '/api/analytics/*': {
    path: '/api/analytics/*',
    permissions: [{ group: 'analytics', action: 'read' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Marketing', 'Accountant'],
    metadata: { analyticsData: true }
  },
  
  // Communication routes
  '/api/messages/*': {
    path: '/api/messages/*',
    permissions: [{ group: 'communication', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Therapist', 'Patient'],
    metadata: { communication: true }
  },
  
  // Therapist tools routes
  '/api/therapist/*': {
    path: '/api/therapist/*',
    permissions: [{ group: 'therapist_tools', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Therapist'],
    metadata: { therapistOnly: true }
  },
  
  // Subscription routes
  '/api/subscriptions/*': {
    path: '/api/subscriptions/*',
    permissions: [{ group: 'product_management', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin', 'Marketing'],
    metadata: { subscriptionManagement: true }
  },
  
  // System settings routes
  '/api/settings/*': {
    path: '/api/settings/*',
    permissions: [{ group: 'system_settings', action: 'manage' }],
    requireAuth: true,
    allowRoles: ['Admin'],
    metadata: { systemSettings: true }
  }
};

/**
 * Get route configuration for a specific path
 */
export function getRouteConfig(path: string): RouteConfig | null {
  // Exact match first
  if (ROUTE_CONFIGS[path]) {
    return ROUTE_CONFIGS[path];
  }

  // Pattern matching
  for (const [pattern, config] of Object.entries(ROUTE_CONFIGS)) {
    if (pattern.includes('*')) {
      const regexPattern = pattern.replace('*', '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      
      if (regex.test(path)) {
        return config;
      }
    }
  }

  return null;
}

/**
 * Create a protected API route handler
 */
export function createProtectedRoute(
  routeConfig: RouteConfig,
  handler: (request: NextRequest, context: { userId: string; userRole: SystemRole }) => Promise<NextResponse>
) {
  return withRouteValidation(handler, routeConfig);
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return (forwarded as string).split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default IP for development
  return (request as any).ip || request.headers.get('x-real-ip') || '127.0.0.1';
}

/**
 * Middleware for protecting pages (not API routes)
 */
export async function protectPage(
  request: NextRequest,
  routeConfig: RouteConfig
): Promise<NextResponse | null> {
  const validationResult = await validateRouteAccess(request, routeConfig);
  
  if (!validationResult.hasAccess) {
    // Redirect to login or access denied page
    if (validationResult.reason.includes('Authentication')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  return null; // Allow access
}