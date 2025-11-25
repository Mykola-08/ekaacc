/**
 * Performance Utility Functions
 * Common patterns and helpers for optimizing code performance
 */

/**
 * Debounce function - limits how often a function can be called
 * Useful for expensive operations triggered by frequent events
 * 
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before executing
 * @param options - Configuration options
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  const { leading = false, trailing = true } = options;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function debounced(...args: Parameters<T>) {
    lastArgs = args;

    const callNow = leading && !timeout;

    const later = () => {
      timeout = null;
      if (trailing && lastArgs) {
        func(...lastArgs);
        lastArgs = null;
      }
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);

    if (callNow) {
      func(...args);
    }
  };
}

/**
 * Throttle function - ensures a function is called at most once per interval
 * Useful for rate-limiting expensive operations
 * 
 * @param func - Function to throttle
 * @param limit - Minimum milliseconds between calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Simple LRU Cache implementation with O(1) operations
 * Uses Map's insertion order for efficient access tracking
 */
export class LRUCache<K, V> {
  private maxSize: number;
  private cache: Map<K, V>;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recently used) - O(1) using Map's delete+set
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    // Delete existing key to update position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end (most recently used)
    this.cache.set(key, value);

    // Remove least recently used if over capacity
    if (this.cache.size > this.maxSize) {
      const iteratorResult = this.cache.keys().next();
      if (!iteratorResult.done) {
        this.cache.delete(iteratorResult.value);
      }
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Batch processor - collects items and processes them in batches
 * Useful for reducing database round trips
 */
export class BatchProcessor<T> {
  private batch: T[] = [];
  private batchSize: number;
  private processFn: (items: T[]) => Promise<void>;
  private timeout: NodeJS.Timeout | null = null;
  private flushDelay: number;

  constructor(
    processFn: (items: T[]) => Promise<void>,
    batchSize: number = 50,
    flushDelay: number = 1000
  ) {
    this.processFn = processFn;
    this.batchSize = batchSize;
    this.flushDelay = flushDelay;
  }

  add(item: T): void {
    this.batch.push(item);

    if (this.batch.length >= this.batchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  private scheduleFlush(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.flush(), this.flushDelay);
  }

  async flush(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.batch.length === 0) {
      return;
    }

    const itemsToProcess = [...this.batch];
    this.batch = [];

    try {
      await this.processFn(itemsToProcess);
    } catch (error) {
      console.error('Batch processing error:', error);
      // Put failed items back in batch for retry
      this.batch.unshift(...itemsToProcess);
    }
  }
}

/**
 * Memoize expensive function results
 * Uses a simple cache with optional TTL
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number;
    ttl?: number;
    keyFn?: (...args: Parameters<T>) => string;
  } = {}
): T {
  const { maxSize = 100, ttl, keyFn = (...args) => JSON.stringify(args) } = options;
  const cache = new LRUCache<string, { value: ReturnType<T>; timestamp: number }>(maxSize);

  return ((...args: Parameters<T>) => {
    const key = keyFn(...args);
    const cached = cache.get(key);

    if (cached) {
      if (!ttl || Date.now() - cached.timestamp < ttl) {
        return cached.value;
      }
    }

    const value = fn(...args);
    cache.set(key, { value, timestamp: Date.now() });
    return value;
  }) as T;
}

/**
 * Combine multiple array operations into single pass
 * More efficient than chaining map/filter
 */
export function mapFilter<T, U>(
  array: T[],
  predicateFn: (item: T) => boolean,
  mapFn: (item: T) => U
): U[] {
  const result: U[] = [];
  for (const item of array) {
    if (predicateFn(item)) {
      result.push(mapFn(item));
    }
  }
  return result;
}

/**
 * Async batch processor with concurrency control
 * Processes items in parallel but limits concurrency
 * Collects all errors and returns successful results
 */
export async function asyncBatch<T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  concurrency: number = 5
): Promise<{ results: R[]; errors: Error[] }> {
  const results: R[] = [];
  const errors: Error[] = [];
  const queue = [...items];
  const processing: Promise<void>[] = [];

  const processNext = async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      
      try {
        const result = await processFn(item);
        results.push(result);
      } catch (error) {
        console.error('Async batch item processing error:', error);
        errors.push(error as Error);
        // Continue processing instead of throwing
      }
    }
  };

  // Start concurrent processors
  for (let i = 0; i < Math.min(concurrency, items.length); i++) {
    processing.push(processNext());
  }

  await Promise.all(processing);
  return { results, errors };
}

/**
 * Performance measurement utility
 */
export class PerformanceTracker {
  private marks: Map<string, number> = new Map();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string, log: boolean = true): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(label);

    if (log) {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label);
    try {
      return fn();
    } finally {
      this.end(label);
    }
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      return await fn();
    } finally {
      this.end(label);
    }
  }
}

/**
 * Resource cleanup utility with automatic timeout
 */
export class ResourceManager {
  private resources: Map<string, () => void> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  register(id: string, cleanup: () => void, autoCleanupAfter?: number): void {
    this.resources.set(id, cleanup);

    if (autoCleanupAfter) {
      const timeout = setTimeout(() => {
        this.cleanup(id);
      }, autoCleanupAfter);
      this.timeouts.set(id, timeout);
    }
  }

  cleanup(id: string): void {
    const cleanup = this.resources.get(id);
    if (cleanup) {
      cleanup();
      this.resources.delete(id);
    }

    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }
  }

  cleanupAll(): void {
    for (const [id] of this.resources) {
      this.cleanup(id);
    }
  }

  get size(): number {
    return this.resources.size;
  }
}
