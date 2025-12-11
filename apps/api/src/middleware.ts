import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for auth verification
// We use a separate client here to just verify the token signature if possible,
// or use getUser() which verifies the token against Supabase Auth API.
// Note: For high performance, verifying JWT signature locally is better,
// but getUser() is safer and easier to start with.

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log(`[Middleware] Processing request for: ${path}`);

  // 1. Skip public endpoints
  if (
    path.startsWith('/api/openapi') ||
    path.startsWith('/api/health')
  ) {
    console.log(`[Middleware] Skipping auth for public endpoint: ${path}`);
    return NextResponse.next();
  }

  // 2. Extract Bearer Token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  // 3. Verify Token
  try {
    // We need SUPABASE_URL and SUPABASE_ANON_KEY (or SERVICE_ROLE_KEY if doing admin tasks)
    // to initialize the client.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Internal Server Error: Auth configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the token by getting the user
    // This call hits Supabase Auth API
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Token verification failed:', error?.message);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // 4. Attach user info to headers for downstream consumption (optional)
    // We can't easily modify the Request object to add 'user' property in Next.js Middleware like Express.
    // Instead we pass it via headers to the route handler.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
