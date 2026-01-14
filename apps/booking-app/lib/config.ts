import { db } from '@/lib/db';

type ConfigCache = Record<string, string>;
const cache: ConfigCache = {};
let lastLoad = 0;
const CACHE_TTL_MS = 5 * 60_000; // 5 minutes (configs rarely change)
let isLoading = false;
let loadPromise: Promise<void> | null = null;
const CONFIG_DB_ENABLED = process.env.CONFIG_DB_ENABLED !== '0';
let hasLoggedError = false;

// Batch load all configs at once to reduce DB queries
async function loadAllConfigs(): Promise<void> {
  if (!CONFIG_DB_ENABLED) {
    // Skip DB-backed config loading; rely on env fallbacks
    return Promise.resolve();
  }
  if (isLoading && loadPromise) return loadPromise;
  
  isLoading = true;
  loadPromise = (async () => {
    try {
      const { rows } = await db.query<{ key: string; value: string }>(
        'SELECT key, value FROM system_configurations'
      );
      
      // Clear and repopulate cache
      for (const key of Object.keys(cache)) delete cache[key];
      for (const row of rows) {
        cache[row.key] = row.value;
      }
      lastLoad = Date.now();
    } catch (error) {
      if (!hasLoggedError) {
        console.warn('Config DB load failed; using env defaults:', error);
        hasLoggedError = true;
      }
    } finally {
      isLoading = false;
      loadPromise = null;
    }
  })();
  
  return loadPromise;
}

export async function getConfig(key: string): Promise<string | undefined> {
  const now = Date.now();
  
  // If cache is stale, reload all configs
  if (now - lastLoad >= CACHE_TTL_MS) {
    await loadAllConfigs();
  }
  
  return CONFIG_DB_ENABLED ? cache[key] : undefined;
}

// Pre-load configs on module import in production
if (process.env.NODE_ENV === 'production' && process.env.CONFIG_DB_PRELOAD === '1') {
  loadAllConfigs().catch(() => {/* ignore initial load errors */});
}

export async function getBookingTokenSecret(): Promise<string> {
  return (await getConfig('BOOKING_TOKEN_SECRET')) || process.env.BOOKING_TOKEN_SECRET || 'fallback-insecure';
}

export async function getStripeSecretKey(): Promise<string> {
  return (await getConfig('STRIPE_SECRET_KEY')) || process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
}

export async function getStripeWebhookSecret(): Promise<string> {
  return (await getConfig('STRIPE_WEBHOOK_SECRET')) || process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';
}

// Invalidate cache (call after config updates)
export function invalidateConfigCache(): void {
  for (const key of Object.keys(cache)) delete cache[key];
  lastLoad = 0;
}
