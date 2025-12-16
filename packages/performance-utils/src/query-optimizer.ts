/**
 * Database Query Optimizer
 * 
 * Provides utilities for:
 * - Batch operations to prevent N+1 queries
 * - Query result caching
 * - Efficient data loading strategies
 */

export interface BatchQuery<T> {
  key: string;
  query: () => Promise<T>;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key: string;
}

/**
 * Batch multiple queries together to prevent N+1 queries
 */
export class QueryBatcher {
  private batches: Map<string, Promise<any>[]> = new Map();
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 10; // ms

  /**
   * Add a query to the batch
   */
  async batch<T>(key: string, query: () => Promise<T>): Promise<T> {
    // If we already have this exact query in the current batch, return it
    const existingBatch = this.batches.get(key);
    if (existingBatch && existingBatch.length > 0) {
      return existingBatch[0] as Promise<T>;
    }

    const queryPromise = query();
    
    if (!this.batches.has(key)) {
      this.batches.set(key, []);
    }
    
    this.batches.get(key)!.push(queryPromise);

    // Schedule batch execution
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.executeBatch();
      }, this.BATCH_DELAY);
    }

    return queryPromise;
  }

  /**
   * Execute all batched queries
   */
  private async executeBatch(): Promise<void> {
    const currentBatches = new Map(this.batches);
    this.batches.clear();
    this.batchTimeout = null;

    // All queries are already running, just wait for them
    for (const [key, queries] of currentBatches) {
      await Promise.all(queries);
    }
  }
}

/**
 * Simple in-memory cache for query results
 */
export class QueryCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached result
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttl || this.DEFAULT_TTL)
    });
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

/**
 * Execute query with caching
 */
export async function cachedQuery<T>(
  query: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const cache = queryCache;
  const cached = cache.get<T>(options.key);
  
  if (cached !== null) {
    return cached;
  }

  const result = await query();
  cache.set(options.key, result, options.ttl);
  
  return result;
}

/**
 * Batch load items by IDs (prevents N+1 queries)
 */
export async function batchLoadByIds<T extends { id: string }>(
  ids: string[],
  loader: (ids: string[]) => Promise<T[]>
): Promise<Map<string, T>> {
  const uniqueIds = [...new Set(ids)];
  const items = await loader(uniqueIds);
  
  const itemMap = new Map<string, T>();
  for (const item of items) {
    itemMap.set(item.id, item);
  }
  
  return itemMap;
}

/**
 * Prefetch related data to avoid N+1
 */
export async function prefetchRelated<T, R>(
  items: T[],
  getRelatedIds: (item: T) => string[],
  loader: (ids: string[]) => Promise<R[]>
): Promise<Map<string, R>> {
  const allRelatedIds = items.flatMap(getRelatedIds);
  const uniqueIds = [...new Set(allRelatedIds)];
  
  const relatedItems = await loader(uniqueIds);
  const relatedMap = new Map<string, R>();
  
  for (const item of relatedItems) {
    relatedMap.set((item as any).id, item);
  }
  
  return relatedMap;
}

/**
 * Optimize Supabase queries with select optimization
 */
export function optimizeSelect(fields: string[]): string {
  // Remove duplicates
  const uniqueFields = [...new Set(fields)];
  
  // Sort fields for consistent caching
  uniqueFields.sort();
  
  return uniqueFields.join(',');
}

/**
 * Build efficient filter query
 */
export function buildFilterQuery(filters: Record<string, any>): {
  params: [string, string, any][];
} {
  const params: [string, string, any][] = [];
  
  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      params.push([key, 'is', null]);
    } else if (Array.isArray(value)) {
      params.push([key, 'in', value]);
    } else if (typeof value === 'object' && 'gte' in value) {
      params.push([key, 'gte', value.gte]);
    } else if (typeof value === 'object' && 'lte' in value) {
      params.push([key, 'lte', value.lte]);
    } else if (typeof value === 'object' && 'like' in value) {
      params.push([key, 'like', value.like]);
    } else {
      params.push([key, 'eq', value]);
    }
  }
  
  return { params };
}

/**
 * Chunk array for batch processing
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  
  return chunks;
}

/**
 * Process items in batches to avoid overwhelming the database
 */
export async function processBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const chunks = chunkArray(items, batchSize);
  const results: R[] = [];
  
  for (const chunk of chunks) {
    const chunkResults = await processor(chunk);
    results.push(...chunkResults);
  }
  
  return results;
}

/**
 * Parallel batch processing with concurrency limit
 */
export async function parallelBatches<T, R>(
  items: T[],
  batchSize: number,
  concurrency: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const chunks = chunkArray(items, batchSize);
  const results: R[] = [];
  
  for (let i = 0; i < chunks.length; i += concurrency) {
    const batch = chunks.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults.flat());
  }
  
  return results;
}

// Export singleton instances
export const queryBatcher = new QueryBatcher();
export const queryCache = new QueryCache();

// Example usage:
/*
// Prevent N+1 queries
const userIds = posts.map(p => p.userId);
const users = await batchLoadByIds(userIds, async (ids) => {
  return supabase.from('users').select('*').in('id', ids);
});

// Cached query
const tiers = await cachedQuery(
  () => supabase.from('subscription_tiers').select('*'),
  { key: 'subscription_tiers', ttl: 10 * 60 * 1000 } // 10 min cache
);

// Batch processing
const results = await processBatches(
  largeArray,
  100, // batch size
  async (batch) => {
    return supabase.from('table').insert(batch);
  }
);
*/
