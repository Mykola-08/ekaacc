import { NextRequest } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Maximum number of unique tokens
}

interface RateLimitResult {
  limit: number;
  remaining: number;
  reset: number;
}

// Simple in-memory store for rate limiting
// In production, use Redis or similar distributed cache
const tokenCache = new Map<string, number[]>();

/**
 * Rate Limiter
 * 
 * Implements a sliding window rate limiter
 * For production, replace in-memory cache with Redis
 * 
 * @param config - Rate limit configuration
 * @returns Rate limiter function
 */
export function rateLimit(config: RateLimitConfig) {
  const { interval, uniqueTokenPerInterval } = config;

  return {
    check: async (
      request: NextRequest,
      limit: number = 10
    ): Promise<RateLimitResult> => {
      // Get unique identifier (IP address or user ID)
      const token = getIdentifier(request);
      
      const now = Date.now();
      const windowStart = now - interval;

      // Get or initialize token bucket
      let timestamps = tokenCache.get(token) || [];
      
      // Remove old timestamps outside the window
      timestamps = timestamps.filter(timestamp => timestamp > windowStart);

      // Check if limit exceeded
      if (timestamps.length >= limit) {
        const oldestTimestamp = timestamps[0] ?? now;
        const reset = oldestTimestamp + interval;
        
        throw {
          error: 'RATE_LIMIT_EXCEEDED',
          limit,
          remaining: 0,
          reset,
        };
      }

      // Add current timestamp
      timestamps.push(now);
      tokenCache.set(token, timestamps);

      // Clean up old tokens if cache is too large
      if (tokenCache.size > uniqueTokenPerInterval) {
        cleanupCache(windowStart);
      }

      return {
        limit,
        remaining: limit - timestamps.length,
        reset: now + interval,
      };
    },
  };
}

/**
 * Get unique identifier from request
 * Uses IP address as fallback, can be extended to use user ID
 */
function getIdentifier(request: NextRequest): string {
  // Try to get user ID from authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // Extract user ID from JWT if needed
    // For now, use the auth header as identifier
    return `user:${authHeader}`;
  }

  // Fallback to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  return `ip:${ip}`;
}

/**
 * Clean up old entries from cache
 */
function cleanupCache(windowStart: number) {
  const keysToDelete: string[] = [];
  
  tokenCache.forEach((timestamps, token) => {
    const validTimestamps = timestamps.filter(t => t > windowStart);
    if (validTimestamps.length === 0) {
      keysToDelete.push(token);
    } else {
      tokenCache.set(token, validTimestamps);
    }
  });

  keysToDelete.forEach(key => tokenCache.delete(key));
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Standard API endpoints
  api: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  }),
  
  // Authentication endpoints (stricter)
  auth: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  }),
  
  // AI endpoints (stricter due to cost)
  ai: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  }),
  
  // File upload endpoints
  upload: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  }),
};

/**
 * Helper function to add rate limit headers to response
 */
export function addRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult
): Headers {
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString());
  return headers;
}
