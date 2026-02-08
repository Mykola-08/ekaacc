import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAppVersionInfo } from '@/lib/version';

type JsonRecord = Record<string, unknown>;

export interface ErrorReportInput {
  source: 'client' | 'server';
  message: string;
  stack?: string;
  digest?: string;
  level?: 'error' | 'warning' | 'fatal';
  route?: string;
  url?: string;
  userId?: string | null;
  userAgent?: string;
  metadata?: JsonRecord;
  context?: JsonRecord;
  location?: JsonRecord;
  additionalData?: JsonRecord;
}

function truncate(value: string | undefined, max = 8000): string | undefined {
  if (!value) return value;
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

function getForwardedIp(forwardedFor: string | null): string | null {
  if (!forwardedFor) return null;
  const first = forwardedFor.split(',')[0]?.trim();
  return first || null;
}

export async function reportErrorToSupabase(input: ErrorReportInput, requestHeaders?: Headers) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const versionInfo = getAppVersionInfo();
  let hdrs: Headers;
  if (requestHeaders) {
    hdrs = requestHeaders;
  } else {
    try {
      hdrs = await headers();
    } catch {
      hdrs = new Headers();
    }
  }
  const admin = createAdminClient();

  const ipAddress = getForwardedIp(hdrs.get('x-forwarded-for'));
  const requestId = hdrs.get('x-request-id') ?? hdrs.get('cf-ray');
  const userAgent = input.userAgent ?? hdrs.get('user-agent') ?? null;

  const payload = {
    source: input.source,
    level: input.level ?? 'error',
    message: truncate(input.message, 4000),
    stack: truncate(input.stack),
    digest: truncate(input.digest, 255),
    route: truncate(input.route, 1024),
    url: truncate(input.url, 2048),
    user_id: input.userId ?? null,
    user_agent: truncate(userAgent ?? undefined, 1024) ?? null,
    ip_address: ipAddress,
    request_id: requestId,
    environment: versionInfo.environment,
    app_version: versionInfo.version,
    app_build_id: versionInfo.buildId,
    app_build_timestamp: versionInfo.buildTimestamp,
    metadata: input.metadata ?? {},
    context: input.context ?? {},
    location: input.location ?? {},
    additional_data: input.additionalData ?? {},
  };

  const { error } = await admin.from('app_error_reports').insert(payload);
  if (error) {
    console.error('Failed to persist app error report to Supabase:', error.message);
  }
}

export async function reportServerRuntimeError(error: unknown, context?: JsonRecord) {
  const normalized = error instanceof Error ? error : new Error(String(error));
  await reportErrorToSupabase({
    source: 'server',
    level: 'fatal',
    message: normalized.message,
    stack: normalized.stack,
    metadata: {
      name: normalized.name,
    },
    context,
  });
}
