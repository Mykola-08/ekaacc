import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reportErrorToSupabase } from '@/lib/observability/error-reporting';

type ErrorBody = {
  error?: string;
  message?: string;
  errorInfo?: string;
  stack?: string;
  digest?: string;
  level?: 'error' | 'warning' | 'fatal';
  source?: 'client' | 'server';
  timestamp?: string;
  url?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  context?: Record<string, unknown>;
  location?: Record<string, unknown>;
  additionalData?: Record<string, unknown>;
};

async function resolveUserId() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ErrorBody;
    const userId = await resolveUserId();

    await reportErrorToSupabase(
      {
        source: body.source ?? 'client',
        level: body.level ?? 'error',
        message: body.message ?? body.error ?? 'Unknown client error',
        stack: body.stack ?? body.errorInfo,
        digest: body.digest,
        route: request.nextUrl.pathname,
        url: body.url,
        userId,
        userAgent: body.userAgent,
        metadata: {
          ...(body.metadata ?? {}),
          timestamp: body.timestamp ?? new Date().toISOString(),
        },
        context: body.context ?? {},
        location: body.location ?? {},
        additionalData: body.additionalData ?? {},
      },
      request.headers
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


