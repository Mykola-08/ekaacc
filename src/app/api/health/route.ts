import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * 
 * Provides basic health status of the application
 * Used by load balancers, monitoring tools, and uptime checks
 * 
 * Returns:
 * - 200: Service is healthy
 * - 503: Service is unhealthy (with details)
 */
export async function GET() {
  try {
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '0.1.0',
      services: {
        api: 'healthy',
        // Add more service checks as needed
      },
    };

    // Optional: Check database connection
    // try {
    //   const { createClient } = await import('@/lib/supabase-server');
    //   const supabase = createClient();
    //   const { error } = await supabase.from('user_roles').select('count').limit(1);
    //   
    //   if (error) {
    //     healthCheck.services.database = 'unhealthy';
    //     healthCheck.status = 'degraded';
    //   } else {
    //     healthCheck.services.database = 'healthy';
    //   }
    // } catch (error) {
    //   healthCheck.services.database = 'error';
    //   healthCheck.status = 'degraded';
    // }

    // Optional: Check external services
    // Check Stripe API
    // Check AI services
    // Check email service

    const status = healthCheck.status === 'ok' ? 200 : 503;

    return NextResponse.json(healthCheck, { 
      status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}

// Ensure this route is always dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
