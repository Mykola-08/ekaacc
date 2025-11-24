# @ekaacc/performance-utils

Shared performance utilities for optimizing application performance across the ekaacc monorepo.

## Features

- **LRUCache**: O(1) cache operations with automatic eviction
- **BatchProcessor**: Efficient batch processing with auto-flush
- **debounce/throttle**: Rate limiting for expensive operations
- **memoize**: Function result caching with TTL
- **PerformanceTracker**: Operation timing and logging
- **ResourceManager**: Automatic cleanup for intervals/subscriptions
- **asyncBatch**: Concurrent processing with error collection

## Installation

This package is part of the ekaacc monorepo and is automatically available to all apps via workspace dependencies.

## Usage

```typescript
import { LRUCache, debounce, PerformanceTracker } from '@ekaacc/performance-utils';

// Use LRU cache
const cache = new LRUCache<string, User>(100);

// Debounce function
const debouncedSearch = debounce((query: string) => {
  // search logic
}, 300);

// Track performance
const tracker = new PerformanceTracker();
tracker.start('operation');
// ... do work
tracker.end('operation');
```

## Documentation

See `PERFORMANCE_UTILS_EXAMPLES.md` in the repository root for comprehensive usage examples.
