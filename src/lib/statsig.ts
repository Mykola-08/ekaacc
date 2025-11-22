import Statsig from 'statsig-node';

let initPromise: Promise<void> | null = null;
let initialized = false;
const gateCache: Map<string, { value: boolean; expires: number }> = new Map();
const CACHE_TTL_MS = 15_000; // 15s short-lived cache
const exposureCounts: Map<string, number> = new Map();

function getServerSecret(): string | undefined {
  return process.env.STATSIG_SERVER_SECRET;
}

export async function initStatsig(): Promise<void> {
  if (initialized) return;
  const secret = getServerSecret();
  if (!secret) return;
  if (!initPromise) {
    initPromise = Statsig.initialize(secret, {
      environment: { tier: process.env.NODE_ENV || 'development' }
    }).then(() => {
      initialized = true;
    });
  }
  return initPromise;
}

export async function checkFeature(key: string, user: { userID?: string; custom?: Record<string, unknown> } = {}): Promise<boolean> {
  const cacheKey = `${user.userID || 'anon'}:${key}`;
  const cached = gateCache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expires > now) return cached.value;
  await initStatsig();
  if (!initialized) return false;
  const statsigUser = { 
    userID: user.userID || 'anonymous', 
    customIDs: {} as Record<string, string>
  };
  const value = await Statsig.checkGateWithExposureLoggingDisabled(statsigUser, key);
  gateCache.set(cacheKey, { value, expires: now + CACHE_TTL_MS });
  exposureCounts.set(key, (exposureCounts.get(key) || 0) + 1);
  return value;
}

export async function getConfig<T extends Record<string, unknown>>(key: string, user: { userID?: string; custom?: Record<string, unknown> } = {}): Promise<T | null> {
  await initStatsig();
  if (!initialized) return null;
  const statsigUser = { 
    userID: user.userID || 'anonymous', 
    customIDs: {} as Record<string, string>
  };
  const config = await Statsig.getConfigWithExposureLoggingDisabled(statsigUser, key);
  return (config?.value as T) ?? null;
}

export async function shutdownStatsig(): Promise<void> {
  if (initialized) {
    await Statsig.shutdown();
  }
  initialized = false;
  initPromise = null;
  gateCache.clear();
  exposureCounts.clear();
}

export function getExposureSnapshot() {
  return Array.from(exposureCounts.entries()).map(([key, count]) => ({ key, count }));
}