import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

interface RateLimitConfig {
  key: string
  limit: number
  windowSeconds: number
}

export async function rateLimit({ key, limit, windowSeconds }: RateLimitConfig) {
  const now = Math.floor(Date.now() / 1000)
  const bucket = `${key}:${Math.floor(now / windowSeconds)}`
  const tx = redis.pipeline()
  tx.incr(bucket)
  tx.expire(bucket, windowSeconds)
  const [count] = await tx.exec<number>()
  return { allowed: count <= limit, count }
}

export async function ipRateLimit(ip: string, scope: string, limit: number, windowSeconds: number) {
  return rateLimit({ key: `rl:${scope}:${ip}`, limit, windowSeconds })
}