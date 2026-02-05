import { NextRequest, NextResponse } from 'next/server';

/**
 * Error Logging API Endpoint
 * 
 * Receives client-side errors and logs them to the server
 * Can be extended to send to monitoring services like Sentry, LogRocket, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, errorInfo, timestamp, userAgent, url, userId } = body;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error:', {
        error,
        errorInfo,
        timestamp,
        userAgent,
        url,
        userId,
      });
    }

    // In production, log to your monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry
      // if (process.env.SENTRY_DSN) {
      //   Sentry.captureException(new Error(error), {
      //     extra: {
      //       errorInfo,
      //       timestamp,
      //       userAgent,
      //       url,
      //       userId,
      //     },
      //   });
      // }

      // Log to database for analysis
      // You could create an 'error_logs' table in Supabase
      // const { error: dbError } = await supabase
      //   .from('error_logs')
      //   .insert({
      //     error_message: error,
      //     error_info: errorInfo,
      //     user_agent: userAgent,
      //     url,
      //     user_id: userId,
      //     created_at: timestamp,
      //   });
    }

    return NextResponse.json(
      { success: true, message: 'Error logged successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to log error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}

// Prevent this endpoint from being cached
export const dynamic = 'force-dynamic';
