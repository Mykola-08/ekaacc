import { getAppVersionInfo } from '@/lib/version';

export interface ClientErrorReport {
  message: string;
  stack?: string;
  digest?: string;
  level?: 'error' | 'warning' | 'fatal';
  source?: 'client' | 'server';
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  additionalData?: Record<string, unknown>;
}

const sentFingerprintCache = new Set<string>();
const MAX_CACHE_SIZE = 200;

function rememberFingerprint(fingerprint: string) {
  if (sentFingerprintCache.size >= MAX_CACHE_SIZE) {
    const [first] = sentFingerprintCache;
    if (first) sentFingerprintCache.delete(first);
  }
  sentFingerprintCache.add(fingerprint);
}

function buildFingerprint(report: ClientErrorReport) {
  return `${report.message}::${report.stack ?? ''}::${report.digest ?? ''}`;
}

export async function sendClientErrorReport(report: ClientErrorReport) {
  if (typeof window === 'undefined') return;

  const fingerprint = buildFingerprint(report);
  if (sentFingerprintCache.has(fingerprint)) return;
  rememberFingerprint(fingerprint);

  const versionInfo = getAppVersionInfo();
  const payload = {
    source: report.source ?? 'client',
    level: report.level ?? 'error',
    message: report.message,
    stack: report.stack,
    digest: report.digest,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    location: {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      referrer: document.referrer || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    },
    metadata: {
      appVersion: versionInfo.version,
      appBuildId: versionInfo.buildId,
      appBuildTimestamp: versionInfo.buildTimestamp,
      environment: versionInfo.environment,
      ...report.metadata,
    },
    context: report.context ?? {},
    additionalData: report.additionalData ?? {},
  };

  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (error) {
    console.error('Failed to submit client error report:', error);
  }
}


