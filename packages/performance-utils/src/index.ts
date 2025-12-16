/**
 * @ekaacc/performance-utils
 * 
 * Shared performance utilities for optimizing application performance.
 * Includes LRU cache, batch processing, debounce, throttle, memoization, and more.
 */

export {
  debounce,
  throttle,
  LRUCache,
  BatchProcessor,
  memoize,
  mapFilter,
  asyncBatch,
  PerformanceTracker,
  ResourceManager
} from './performance-utils';

export {
  logger,
  logDatabaseQuery,
  logPerformance,
  type LogLevel,
  type LogContext,
  type LogEntry
} from './logger';

export {
  queryBatcher,
  queryCache,
  QueryBatcher,
  QueryCache,
  cachedQuery,
  batchLoadByIds,
  prefetchRelated,
  optimizeSelect,
  buildFilterQuery,
  chunkArray,
  processBatches,
  parallelBatches,
  type BatchQuery,
  type CacheOptions
} from './query-optimizer';

