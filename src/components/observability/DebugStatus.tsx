'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  env: string;
  database?: string;
  responseTimeMs?: number;
  error?: string;
}

interface DbHealthStatus {
  healthy: boolean;
  timestamp: string;
  responseTimeMs: number;
  database?: {
    connected: boolean;
    tables: Record<string, boolean>;
    allTablesAccessible: boolean;
    errors?: Record<string, string>;
  };
  error?: string;
}

interface PerformanceMetrics {
  pageLoadTime: number | null;
  domContentLoaded: number | null;
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  cumulativeLayoutShift: number | null;
  jsHeapUsed: number | null;
  jsHeapTotal: number | null;
  resourceCount: number;
  transferSize: number;
}

interface ClientError {
  message: string;
  source: string;
  timestamp: string;
  count: number;
}

type DebugTab = 'health' | 'performance' | 'page' | 'errors' | 'network';

// ─── Helpers ───────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatMs(ms: number | null): string {
  if (ms === null) return '—';
  if (ms < 1) return '<1ms';
  return `${Math.round(ms)}ms`;
}

function statusDot(ok: boolean) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${ok ? 'bg-success' : 'bg-destructive'}`}
    />
  );
}

function ratingColor(value: number | null, good: number, poor: number): string {
  if (value === null) return 'text-muted-foreground';
  if (value <= good) return 'text-success dark:text-success';
  if (value <= poor) return 'text-warning dark:text-warning';
  return 'text-destructive dark:text-destructive';
}

// ─── Error collector (module-level singleton) ──────────────────────

const collectedErrors: ClientError[] = [];
const MAX_ERRORS = 50;

function pushError(message: string, source: string) {
  const existing = collectedErrors.find(
    (e) => e.message === message && e.source === source
  );
  if (existing) {
    existing.count++;
    existing.timestamp = new Date().toISOString();
    return;
  }
  collectedErrors.unshift({
    message,
    source,
    timestamp: new Date().toISOString(),
    count: 1,
  });
  if (collectedErrors.length > MAX_ERRORS) collectedErrors.pop();
}

if (typeof window !== 'undefined') {
  const origError = console.error;
  console.error = (...args: any[]) => {
    pushError(
      args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' '),
      'console.error'
    );
    origError.apply(console, args);
  };

  const origWarn = console.warn;
  console.warn = (...args: any[]) => {
    pushError(
      args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' '),
      'console.warn'
    );
    origWarn.apply(console, args);
  };

  window.addEventListener('error', (event) => {
    pushError(
      event.message || 'Unhandled error',
      `${event.filename || 'unknown'}:${event.lineno || 0}`
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    pushError(
      reason instanceof Error ? reason.message : String(reason),
      'unhandledrejection'
    );
  });
}

// ─── Component ─────────────────────────────────────────────────────

export function DebugStatus() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DebugTab>('health');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [dbHealth, setDbHealth] = useState<DbHealthStatus | null>(null);
  const [perf, setPerf] = useState<PerformanceMetrics | null>(null);
  const [errors, setErrors] = useState<ClientError[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [networkRequests, setNetworkRequests] = useState<
    {
      url: string;
      method: string;
      status: number;
      duration: number;
      size: number;
    }[]
  >([]);

  // ─── Health check ───────────────────────────────────────────────
  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const [healthRes, dbRes] = await Promise.allSettled([
        fetch('/api/health'),
        fetch('/api/health/db'),
      ]);

      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        setHealth(await healthRes.value.json());
      } else {
        setHealth({
          status: 'error',
          timestamp: new Date().toISOString(),
          env: process.env.NODE_ENV || 'unknown',
          error:
            healthRes.status === 'rejected'
              ? healthRes.reason?.message
              : `HTTP ${(healthRes as PromiseFulfilledResult<Response>).value.status}`,
        });
      }

      if (dbRes.status === 'fulfilled' && dbRes.value.ok) {
        setDbHealth(await dbRes.value.json());
      } else {
        setDbHealth(null);
      }
    } catch (e: any) {
      setHealth({
        status: 'error',
        timestamp: new Date().toISOString(),
        env: 'unknown',
        error: e.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Performance metrics ────────────────────────────────────────
  const collectPerformance = useCallback(() => {
    if (typeof window === 'undefined') return;
    const nav = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming | undefined;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType(
      'resource'
    ) as PerformanceResourceTiming[];

    const fcp =
      paint.find((p) => p.name === 'first-contentful-paint')?.startTime ??
      null;

    let lcp: number | null = null;
    let cls: number | null = null;

    try {
      const lcpEntries = performance.getEntriesByType(
        'largest-contentful-paint'
      );
      if (lcpEntries.length > 0)
        lcp = lcpEntries[lcpEntries.length - 1].startTime;
    } catch {
      /* not supported */
    }

    try {
      const layoutShiftEntries = performance.getEntriesByType(
        'layout-shift'
      ) as any[];
      if (layoutShiftEntries.length > 0)
        cls = layoutShiftEntries.reduce(
          (sum: number, e: any) => sum + (e.value || 0),
          0
        );
    } catch {
      /* not supported */
    }

    const memInfo = (performance as any).memory;
    const totalTransfer = resources.reduce(
      (sum, r) => sum + (r.transferSize || 0),
      0
    );

    setPerf({
      pageLoadTime: nav ? nav.loadEventEnd - nav.fetchStart : null,
      domContentLoaded: nav
        ? nav.domContentLoadedEventEnd - nav.fetchStart
        : null,
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: cls,
      jsHeapUsed: memInfo?.usedJSHeapSize ?? null,
      jsHeapTotal: memInfo?.totalJSHeapSize ?? null,
      resourceCount: resources.length,
      transferSize: totalTransfer,
    });

    const topResources = resources.slice(-30).map((r) => ({
      url: r.name.replace(window.location.origin, ''),
      method: 'GET',
      status: (r as any).responseStatus ?? 200,
      duration: Math.round(r.responseEnd - r.startTime),
      size: r.transferSize || 0,
    }));
    setNetworkRequests(topResources);
  }, []);

  // ─── Auto-refresh every 5 s ────────────────────────────────────
  useEffect(() => {
    if (autoRefresh && isOpen) {
      autoRefreshRef.current = setInterval(() => {
        checkHealth();
        collectPerformance();
        setErrors([...collectedErrors]);
      }, 5000);
    }
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [autoRefresh, isOpen, checkHealth, collectPerformance]);

  // ─── Open → initial fetch ──────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      checkHealth();
      collectPerformance();
      setErrors([...collectedErrors]);
    }
  }, [isOpen, checkHealth, collectPerformance]);

  // ─── Refresh on route change ───────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
        collectPerformance();
        setErrors([...collectedErrors]);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [pathname, isOpen, collectPerformance]);

  // ─── Keyboard shortcut  Ctrl+Shift+D  ──────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const refreshAll = () => {
    checkHealth();
    collectPerformance();
    setErrors([...collectedErrors]);
  };

  const errorCount = collectedErrors.length;
  const hasIssues =
    health?.status !== 'ok' || (dbHealth && !dbHealth.healthy) || errorCount > 0;

  const TABS: { id: DebugTab; label: string; badge?: number }[] = [
    { id: 'health', label: 'Health' },
    { id: 'performance', label: 'Perf' },
    { id: 'page', label: 'Page' },
    { id: 'errors', label: 'Errors', badge: errorCount || undefined },
    { id: 'network', label: 'Network' },
  ];

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <div className="fixed right-4 bottom-4 z-[9999] font-sans">
      {isOpen && (
        <div className="mb-2 flex max-h-[70vh] w-[420px] flex-col rounded-xl border border-border bg-card text-sm shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* ── Header ─────────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🐞</span>
              <h3 className="text-sm font-semibold text-foreground">
                Debug Panel
              </h3>
              {hasIssues && (
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-destructive" />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`rounded px-1.5 py-0.5 text-2xs font-medium transition-colors ${
                  autoRefresh
                    ? 'bg-success/20 text-success dark:bg-success/10 dark:text-success'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                title="Auto-refresh every 5 s"
              >
                {autoRefresh ? '⟲ Auto' : '⟲'}
              </button>
              <button
                onClick={refreshAll}
                disabled={loading}
                className="rounded bg-muted px-1.5 py-0.5 text-2xs font-medium text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
              >
                {loading ? '…' : '↻'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────────── */}
          <div className="flex border-b border-border px-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-destructive/20 px-1 text-[9px] font-bold text-destructive dark:bg-destructive/10 dark:text-destructive">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Content ────────────────────────────────── */}
          <div className="flex-1 overflow-auto p-3">
            {/* ─── Health ─── */}
            {activeTab === 'health' && (
              <HealthTab
                health={health}
                dbHealth={dbHealth}
                loading={loading}
              />
            )}

            {/* ─── Performance ─── */}
            {activeTab === 'performance' && <PerformanceTab perf={perf} />}

            {/* ─── Page ─── */}
            {activeTab === 'page' && <PageTab pathname={pathname} />}

            {/* ─── Errors ─── */}
            {activeTab === 'errors' && (
              <ErrorsTab errors={errors} setErrors={setErrors} />
            )}

            {/* ─── Network ─── */}
            {activeTab === 'network' && (
              <NetworkTab requests={networkRequests} />
            )}
          </div>

          {/* ── Footer ─────────────────────────────────── */}
          <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-2xs text-muted-foreground/60">
            <span>Ctrl+Shift+D to toggle</span>
            <span>{pathname}</span>
          </div>
        </div>
      )}

      {/* ── Toggle button ────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative rounded-full px-3 py-2 text-xs font-medium shadow-lg transition-all duration-200 ${
          isOpen
            ? 'bg-foreground text-background ring-2 ring-foreground/20'
            : 'border border-border bg-card text-foreground hover:bg-muted/50 hover:shadow-xl'
        }`}
        title="Debug Panel (Ctrl+Shift+D)"
      >
        {hasIssues && !isOpen && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
          </span>
        )}
        {isOpen ? '✕ Close' : '🐞 Debug'}
      </button>
    </div>
  );
}

// ─── Row ───────────────────────────────────────────────────────────

function Row({
  label,
  value,
  ok,
  className,
  hint,
  mono,
}: {
  label: string;
  value: string;
  ok?: boolean;
  className?: string;
  hint?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {ok !== undefined && statusDot(ok)}
        {label}
        {hint && (
          <span
            className="text-[9px] text-muted-foreground/50"
            title={hint}
          >
            ⓘ
          </span>
        )}
      </span>
      <span
        className={`max-w-[220px] truncate text-right text-xs ${
          className ||
          (ok !== undefined
            ? ok
              ? 'font-medium text-success dark:text-success'
              : 'font-medium text-destructive dark:text-destructive'
            : 'text-foreground')
        } ${mono ? 'font-mono' : ''}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Sub-section label ─────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}

// ─── Tab: Health ───────────────────────────────────────────────────

function HealthTab({
  health,
  dbHealth,
  loading,
}: {
  health: HealthStatus | null;
  dbHealth: DbHealthStatus | null;
  loading: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <SectionLabel>API Health</SectionLabel>
        {health ? (
          <>
            <Row
              label="Status"
              value={health.status.toUpperCase()}
              ok={health.status === 'ok'}
            />
            <Row label="Environment" value={health.env} />
            {health.database && (
              <Row
                label="Database"
                value={health.database}
                ok={health.database === 'connected'}
              />
            )}
            {health.responseTimeMs !== undefined && (
              <Row
                label="Response Time"
                value={formatMs(health.responseTimeMs)}
              />
            )}
          </>
        ) : (
          <div className="py-2 text-center text-xs text-muted-foreground">
            {loading ? 'Checking…' : 'No data'}
          </div>
        )}
      </div>

      {dbHealth && (
        <div className="space-y-1.5">
          <SectionLabel>Database Tables</SectionLabel>
          {dbHealth.database?.tables &&
            Object.entries(dbHealth.database.tables).map(([table, ok]) => (
              <Row
                key={table}
                label={table}
                ok={ok}
                value={ok ? 'OK' : 'FAIL'}
              />
            ))}
          <Row label="Response Time" value={formatMs(dbHealth.responseTimeMs)} />
          {dbHealth.database?.errors &&
            Object.entries(dbHealth.database.errors).map(([table, error]) => (
              <div
                key={table}
                className="rounded bg-destructive/10 p-1.5 text-2xs text-destructive dark:bg-destructive/10 dark:text-destructive"
              >
                <strong>{table}:</strong> {error}
              </div>
            ))}
        </div>
      )}

      {health?.error && (
        <div className="break-all rounded bg-destructive/10 p-2 text-xs text-destructive dark:bg-destructive/10 dark:text-destructive">
          {health.error}
        </div>
      )}

      <div className="pt-1 text-2xs text-muted-foreground/60">
        Last check:{' '}
        {health ? new Date(health.timestamp).toLocaleTimeString() : '—'}
      </div>
    </div>
  );
}

// ─── Tab: Performance ──────────────────────────────────────────────

function PerformanceTab({ perf }: { perf: PerformanceMetrics | null }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <SectionLabel>Core Web Vitals</SectionLabel>
        <Row
          label="FCP"
          value={formatMs(perf?.firstContentfulPaint ?? null)}
          className={ratingColor(
            perf?.firstContentfulPaint ?? null,
            1800,
            3000
          )}
          hint="First Contentful Paint (good ≤1.8 s)"
        />
        <Row
          label="LCP"
          value={formatMs(perf?.largestContentfulPaint ?? null)}
          className={ratingColor(
            perf?.largestContentfulPaint ?? null,
            2500,
            4000
          )}
          hint="Largest Contentful Paint (good ≤2.5 s)"
        />
        <Row
          label="CLS"
          value={
            perf?.cumulativeLayoutShift != null
              ? perf.cumulativeLayoutShift.toFixed(3)
              : '—'
          }
          className={ratingColor(
            perf?.cumulativeLayoutShift ?? null,
            0.1,
            0.25
          )}
          hint="Cumulative Layout Shift (good ≤0.1)"
        />
      </div>

      <div className="space-y-1.5">
        <SectionLabel>Page Timing</SectionLabel>
        <Row
          label="DOM Content Loaded"
          value={formatMs(perf?.domContentLoaded ?? null)}
        />
        <Row label="Page Load" value={formatMs(perf?.pageLoadTime ?? null)} />
      </div>

      <div className="space-y-1.5">
        <SectionLabel>Memory</SectionLabel>
        <Row
          label="JS Heap Used"
          value={perf?.jsHeapUsed ? formatBytes(perf.jsHeapUsed) : '—'}
        />
        <Row
          label="JS Heap Total"
          value={perf?.jsHeapTotal ? formatBytes(perf.jsHeapTotal) : '—'}
        />
        {perf?.jsHeapUsed && perf?.jsHeapTotal && (
          <Row
            label="Heap Usage"
            value={`${Math.round((perf.jsHeapUsed / perf.jsHeapTotal) * 100)}%`}
            className={ratingColor(
              (perf.jsHeapUsed / perf.jsHeapTotal) * 100,
              70,
              90
            )}
          />
        )}
      </div>

      <div className="space-y-1.5">
        <SectionLabel>Resources</SectionLabel>
        <Row
          label="Resource Count"
          value={String(perf?.resourceCount ?? 0)}
        />
        <Row
          label="Total Transfer"
          value={formatBytes(perf?.transferSize ?? 0)}
        />
      </div>
    </div>
  );
}

// ─── Tab: Page ─────────────────────────────────────────────────────

function PageTab({ pathname }: { pathname: string }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <SectionLabel>Current Page</SectionLabel>
        <Row label="Route" value={pathname} />
        <Row
          label="URL"
          value={
            typeof window !== 'undefined' ? window.location.href : '—'
          }
          mono
        />
        <Row
          label="Viewport"
          value={
            typeof window !== 'undefined'
              ? `${window.innerWidth}×${window.innerHeight}`
              : '—'
          }
        />
        <Row
          label="Pixel Ratio"
          value={
            typeof window !== 'undefined'
              ? String(window.devicePixelRatio)
              : '—'
          }
        />
        <Row
          label="Color Scheme"
          value={
            typeof document !== 'undefined'
              ? document.documentElement.classList.contains('dark')
                ? 'dark'
                : 'light'
              : '—'
          }
        />
        <Row
          label="Language"
          value={
            typeof navigator !== 'undefined' ? navigator.language : '—'
          }
        />
      </div>

      <div className="space-y-1.5">
        <SectionLabel>DOM Analysis</SectionLabel>
        <Row
          label="DOM Nodes"
          value={
            typeof document !== 'undefined'
              ? String(document.querySelectorAll('*').length)
              : '—'
          }
          className={ratingColor(
            typeof document !== 'undefined'
              ? document.querySelectorAll('*').length
              : null,
            800,
            1500
          )}
          hint="good <800, poor >1500"
        />
        <Row
          label="Images"
          value={
            typeof document !== 'undefined'
              ? String(document.querySelectorAll('img').length)
              : '—'
          }
        />
        <Row
          label="Scripts"
          value={
            typeof document !== 'undefined'
              ? String(document.querySelectorAll('script').length)
              : '—'
          }
        />
        <Row
          label="Stylesheets"
          value={
            typeof document !== 'undefined'
              ? String(
                  document.querySelectorAll('link[rel="stylesheet"]').length
                )
              : '—'
          }
        />
      </div>

      <div className="space-y-1.5">
        <SectionLabel>Accessibility Quick Check</SectionLabel>
        <A11yRow
          label="Images w/o alt"
          selector="img:not([alt])"
          expectZero
        />
        <A11yButtonRow />
        <Row
          label="Skip Link"
          value={
            typeof document !== 'undefined' &&
            document.querySelector('a[href="#main-content"]')
              ? 'Present'
              : 'Missing'
          }
          className={
            typeof document !== 'undefined' &&
            document.querySelector('a[href="#main-content"]')
              ? 'text-success dark:text-success'
              : 'text-warning dark:text-warning'
          }
        />
        <Row
          label="h1 count"
          value={
            typeof document !== 'undefined'
              ? String(document.querySelectorAll('h1').length)
              : '—'
          }
          className={
            typeof document !== 'undefined' &&
            document.querySelectorAll('h1').length === 1
              ? 'text-success dark:text-success'
              : 'text-warning dark:text-warning'
          }
          hint="should be exactly 1"
        />
      </div>
    </div>
  );
}

/** Accessibility check: count elements matching selector */
function A11yRow({
  label,
  selector,
  expectZero,
}: {
  label: string;
  selector: string;
  expectZero?: boolean;
}) {
  const count =
    typeof document !== 'undefined'
      ? document.querySelectorAll(selector).length
      : 0;
  const good = expectZero ? count === 0 : count > 0;
  return (
    <Row
      label={label}
      value={String(count)}
      className={
        good
          ? 'text-success dark:text-success'
          : 'text-warning dark:text-warning'
      }
    />
  );
}

/** Check for buttons without accessible text */
function A11yButtonRow() {
  const count =
    typeof document !== 'undefined'
      ? Array.from(document.querySelectorAll('button')).filter(
          (b) =>
            !b.textContent?.trim() &&
            !b.getAttribute('aria-label') &&
            !b.querySelector('[aria-label]')
        ).length
      : 0;
  return (
    <Row
      label="Buttons w/o text"
      value={String(count)}
      className={
        count === 0
          ? 'text-success dark:text-success'
          : 'text-warning dark:text-warning'
      }
    />
  );
}

// ─── Tab: Errors ───────────────────────────────────────────────────

function ErrorsTab({
  errors,
  setErrors,
}: {
  errors: ClientError[];
  setErrors: React.Dispatch<React.SetStateAction<ClientError[]>>;
}) {
  if (errors.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        <span className="text-lg">✓</span>
        <p className="mt-1">No errors captured</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
          {errors.length} error{errors.length !== 1 ? 's' : ''} captured
        </span>
        <button
          onClick={() => {
            collectedErrors.length = 0;
            setErrors([]);
          }}
          className="text-2xs text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      </div>
      {errors.map((err, i) => {
        const isWarn = err.source === 'console.warn';
        return (
          <div
            key={`${err.timestamp}-${i}`}
            className={`rounded border p-2 text-xs ${
              isWarn
                ? 'border-warning/30 bg-warning/10 dark:border-warning/80 dark:bg-warning/10'
                : 'border-destructive/30 bg-destructive/10 dark:border-destructive/30 dark:bg-destructive/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`font-medium ${
                  isWarn
                    ? 'text-warning dark:text-warning'
                    : 'text-destructive dark:text-destructive'
                }`}
              >
                {isWarn ? '⚠' : '✕'} {err.source}
                {err.count > 1 && (
                  <span className="ml-1 rounded bg-destructive/30 px-1 text-[9px] dark:bg-destructive/20">
                    ×{err.count}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-[9px] text-muted-foreground">
                {new Date(err.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-0.5 break-all leading-relaxed text-foreground/80">
              {err.message.length > 300
                ? err.message.slice(0, 300) + '…'
                : err.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: Network ──────────────────────────────────────────────────

function NetworkTab({
  requests,
}: {
  requests: {
    url: string;
    method: string;
    status: number;
    duration: number;
    size: number;
  }[];
}) {
  if (requests.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        No network data collected
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <SectionLabel>Last {requests.length} requests</SectionLabel>
      <div className="space-y-1">
        {requests.map((req, i) => (
          <div
            key={`${req.url}-${i}`}
            className="flex items-center gap-2 rounded border border-border/50 px-2 py-1 text-2xs"
          >
            <span
              className={`shrink-0 font-mono font-medium ${
                req.status >= 400
                  ? 'text-destructive dark:text-destructive'
                  : req.status >= 300
                    ? 'text-warning dark:text-warning'
                    : 'text-success dark:text-success'
              }`}
            >
              {req.status || '—'}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-foreground/80">
              {req.url.length > 60
                ? '…' + req.url.slice(-55)
                : req.url}
            </span>
            <span className="shrink-0 text-muted-foreground">
              {formatMs(req.duration)}
            </span>
            <span className="shrink-0 text-muted-foreground">
              {formatBytes(req.size)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
