import { Redis } from '@upstash/redis'

// Safe Redis initialization: guard against missing env vars
function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Upstash Redis not configured; rate limiting disabled.');
    }
    return null;
  }
  try {
    return Redis.fromEnv();
  } catch (e) {
    console.warn('Redis initialization failed:', e);
    return null;
  }
}

const redis = createRedisClient();

interface RateLimitConfig {
  key: string
  limit: number
  windowSeconds: number
}

export async function rateLimit({ key, limit, windowSeconds }: RateLimitConfig) {
  if (!redis) {
    // Redis not configured; allow all requests (no rate limiting).
    return { allowed: true, count: 0 };
  }
  const now = Math.floor(Date.now() / 1000)
  const bucket = `${key}:${Math.floor(now / windowSeconds)}`
  const tx = redis.pipeline()
  tx.incr(bucket)
  tx.expire(bucket, windowSeconds)
  const results = await tx.exec()
  const count = (results[0] as number) || 0
  return { allowed: count <= limit, count }
}

export async function ipRateLimit(ip: string, scope: string, limit: number, windowSeconds: number) {
  return rateLimit({ key: `rl:${scope}:${ip}`, limit, windowSeconds })
}