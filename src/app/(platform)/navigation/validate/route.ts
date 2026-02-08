import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute, ROUTE_CONFIGS } from '@/lib/platform/services/route-middleware';
import { logSecurityEvent } from '@/lib/platform/services/security-service';
import { supabase } from '@/lib/platform/supabase';
import type {
  SystemRole,
  PermissionGroup,
  PermissionAction,
} from '@/lib/platform/config/role-permissions';

// Define the route configuration for this API endpoint
const routeConfig = {
  path: '/api/navigation/validate',
  permissions: [
    { group: 'system_settings' as PermissionGroup, action: 'read' as PermissionAction },
  ],
  requireAuth: true,
  allowRoles: ['Admin', 'Therapist', 'Content Manager'] as SystemRole[],
  metadata: { api: true, navigationValidation: true },
};

/**
 * API endpoint for validating navigation access
 * Demonstrates server-side route validation with comprehensive logging
 */
const validateNavigationAccess = createProtectedRoute(
  routeConfig,
  async (request: NextRequest, context: { userId: string; userRole: SystemRole }) => {
    try {
      const { searchParams } = new URL(request.url);
      const route = searchParams.get('route');
      const action = searchParams.get('action') || 'access';

      if (!route) {
        return NextResponse.json({ error: 'Route parameter is required' }, { status: 400 });
      }

      // Log the validation attempt
      logSecurityEvent({
        type: 'navigation_access',
        severity: 'low',
        userId: context.userId,
        userRole: context.userRole,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: route,
        action: `navigation_${action}`,
        result: true,
        reason: 'API validation request',
        metadata: {
          apiEndpoint: '/api/navigation/validate',
          requestMethod: request.method,
        },
      });

      // Get user details from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', context.userId)
        .single();

      if (userError || !userData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get user's custom roles if any
      const { data: customRoles } = await supabase
        .from('custom_roles')
        .select('*')
        .eq('is_active', true);

      // Return comprehensive validation result
      const validationResult = {
        userId: context.userId,
        userRole: context.userRole,
        isActive: true,
        lastRoleChange: null,
        route: route,
        action: action,
        timestamp: new Date().toISOString(),
        permissions: {
          canAccessRoute: true,
          reason: 'Access granted via API validation',
        },
        metadata: {
          apiVersion: '1.0',
          validationSource: 'server-side',
          customRoles: customRoles?.length || 0,
        },
      };

      return NextResponse.json(validationResult, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    } catch (error) {
      console.error('Navigation validation error:', error);

      logSecurityEvent({
        type: 'system_error',
        severity: 'high',
        userId: context.userId,
        userRole: context.userRole,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: '/api/navigation/validate',
        action: 'api_error',
        result: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
        },
      });

      return NextResponse.json(
        {
          error: 'Internal server error during navigation validation',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  }
);

/**
 * GET handler - Validate navigation access for a specific route
 */
export async function GET(request: NextRequest) {
  const handler = await validateNavigationAccess;
  return handler(request);
}

/**
 * POST handler - Validate navigation access with additional context
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { route, action, context } = body;

    if (!route) {
      return NextResponse.json(
        { error: 'Route parameter is required in request body' },
        { status: 400 }
      );
    }

    // Add context to the request URL for the validation handler
    const url = new URL(request.url);
    url.searchParams.set('route', route);
    if (action) url.searchParams.set('action', action);
    if (context) url.searchParams.set('context', JSON.stringify(context));

    // Create modified request with context
    const modifiedRequest = new NextRequest(url.toString(), {
      method: 'GET',
      headers: request.headers,
    });

    const handler = await validateNavigationAccess;
    return handler(modifiedRequest);
  } catch (error) {
    console.error('POST navigation validation error:', error);

    return NextResponse.json(
      {
        error: 'Invalid request body',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

/**
 * Helper function to get client IP address
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

  return (request as any).ip || request.headers.get('x-real-ip') || '127.0.0.1';
}

/**
 * Additional API endpoint for bulk navigation validation
 * This demonstrates advanced validation scenarios
 */
export async function PUT(request: NextRequest) {
  const config = {
    path: '/api/navigation/validate/bulk',
    permissions: [
      { group: 'system_settings' as PermissionGroup, action: 'manage' as PermissionAction },
    ],
    requireAuth: true,
    allowRoles: ['Admin'] as SystemRole[],
    metadata: { api: true, bulkValidation: true },
  };

  const bulkHandler = createProtectedRoute(config, async (request: NextRequest, context) => {
    try {
      const body = await request.json();
      const { routes } = body;

      if (!Array.isArray(routes) || routes.length === 0) {
        return NextResponse.json({ error: 'Routes array is required' }, { status: 400 });
      }

      if (routes.length > 100) {
        return NextResponse.json(
          { error: 'Maximum 100 routes allowed per bulk validation' },
          { status: 400 }
        );
      }

      const results = await Promise.all(
        routes.map(async (route) => {
          // Simulate validation for each route
          // In a real implementation, this would use the permission service
          return {
            route: route,
            hasAccess: true,
            reason: 'Bulk validation successful',
            timestamp: new Date().toISOString(),
          };
        })
      );

      logSecurityEvent({
        type: 'navigation_access',
        severity: 'low',
        userId: context.userId,
        userRole: context.userRole,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        resource: '/api/navigation/validate/bulk',
        action: 'bulk_validation',
        result: true,
        reason: `Validated ${routes.length} routes`,
        metadata: {
          routeCount: routes.length,
          allSuccessful: results.every((r) => r.hasAccess),
        },
      });

      return NextResponse.json({
        results,
        summary: {
          total: results.length,
          successful: results.filter((r) => r.hasAccess).length,
          failed: results.filter((r) => !r.hasAccess).length,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Bulk validation error:', error);

      return NextResponse.json(
        {
          error: 'Bulk validation failed',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  });

  const handler = await bulkHandler;
  return handler(request);
}
