# Performance Utilities - Usage Examples

This document provides practical examples of using the performance utilities to optimize your code.

## Table of Contents
1. [Debouncing and Throttling](#debouncing-and-throttling)
2. [Caching with LRU](#caching-with-lru)
3. [Batch Processing](#batch-processing)
4. [Memoization](#memoization)
5. [Performance Tracking](#performance-tracking)
6. [Resource Management](#resource-management)

---

## Debouncing and Throttling

### Debouncing Search Input
```typescript
import { debounce } from '@/lib/performance-utils';

// Debounce search API calls - only trigger after user stops typing for 300ms
const debouncedSearch = debounce(
  async (query: string) => {
    const results = await fetch(`/api/search?q=${query}`);
    setSearchResults(await results.json());
  },
  300,
  { trailing: true }
);

// In your component
<input 
  onChange={(e) => debouncedSearch(e.target.value)} 
  placeholder="Search..."
/>
```

### Throttling Scroll Events
```typescript
import { throttle } from '@/lib/performance-utils';

// Throttle scroll handler - execute at most once per 100ms
const throttledScroll = throttle(() => {
  const scrollPosition = window.scrollY;
  updateScrollIndicator(scrollPosition);
}, 100);

window.addEventListener('scroll', throttledScroll);
```

---

## Caching with LRU

### Cache API Responses
```typescript
import { LRUCache } from '@/lib/performance-utils';

// Create cache for user data (max 100 users, auto-evicts least recently used)
const userCache = new LRUCache<string, User>(100);

async function getUser(userId: string): Promise<User> {
  // Check cache first
  const cached = userCache.get(userId);
  if (cached) {
    console.log('Cache hit!');
    return cached;
  }

  // Fetch from API if not cached
  const user = await fetchUserFromAPI(userId);
  userCache.set(userId, user);
  return user;
}
```

### Cache Expensive Computations
```typescript
import { LRUCache } from '@/lib/performance-utils';

// Cache computation results
const computationCache = new LRUCache<string, number>(50);

function expensiveCalculation(input: string): number {
  const cached = computationCache.get(input);
  if (cached !== undefined) {
    return cached;
  }

  // Expensive operation
  const result = input.split('').reduce((sum, char) => {
    return sum + char.charCodeAt(0) * Math.PI;
  }, 0);

  computationCache.set(input, result);
  return result;
}
```

---

## Batch Processing

### Batch Database Inserts
```typescript
import { BatchProcessor } from '@/lib/performance-utils';

// Create batch processor for database inserts
const analyticsProcessor = new BatchProcessor(
  async (events: AnalyticsEvent[]) => {
    // Insert all events in a single database call
    await supabase.from('analytics_events').insert(events);
    console.log(`Inserted ${events.length} events`);
  },
  50,    // Batch size
  1000   // Flush after 1 second
);

// Add events individually - they'll be batched automatically
function trackEvent(event: AnalyticsEvent) {
  analyticsProcessor.add(event);
}

// Force flush on page unload
window.addEventListener('beforeunload', () => {
  analyticsProcessor.flush();
});
```

### Batch API Requests
```typescript
import { BatchProcessor } from '@/lib/performance-utils';

// Batch user profile updates
const profileUpdateProcessor = new BatchProcessor(
  async (updates: ProfileUpdate[]) => {
    // Send all updates in a single API call
    await fetch('/api/profiles/batch-update', {
      method: 'POST',
      body: JSON.stringify(updates)
    });
  },
  25,   // Process in batches of 25
  2000  // Flush every 2 seconds
);

// Usage
profileUpdateProcessor.add({
  userId: 'user-123',
  lastActive: new Date()
});
```

---

## Memoization

### Memoize Pure Functions
```typescript
import { memoize } from '@/lib/performance-utils';

// Expensive pure function
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memoized version - much faster for repeated calls
const memoizedFib = memoize(fibonacci);

console.log(memoizedFib(40)); // Slow first time
console.log(memoizedFib(40)); // Instant from cache
```

### Memoize with TTL
```typescript
import { memoize } from '@/lib/performance-utils';

// Cache API data for 5 minutes
const getWeatherData = memoize(
  async (city: string) => {
    const response = await fetch(`/api/weather?city=${city}`);
    return response.json();
  },
  {
    maxSize: 100,
    ttl: 5 * 60 * 1000, // 5 minutes
    keyFn: (city) => city.toLowerCase() // Custom cache key
  }
);
```

### Memoize React Components
```typescript
import { memoize } from '@/lib/performance-utils';
import { useMemo } from 'react';

function UserProfile({ userId }: { userId: string }) {
  // Memoize expensive user data transformation
  const processedData = useMemo(() => 
    memoize((id: string) => {
      // Expensive data processing
      return transformUserData(id);
    })(userId)
  , [userId]);

  return <div>{processedData.name}</div>;
}
```

---

## Performance Tracking

### Track Function Performance
```typescript
import { PerformanceTracker } from '@/lib/performance-utils';

const tracker = new PerformanceTracker();

// Synchronous function
function processData(data: any[]) {
  return tracker.measure('processData', () => {
    // Your code here
    return data.map(item => transform(item));
  });
}

// Async function
async function fetchAndProcess() {
  return tracker.measureAsync('fetchAndProcess', async () => {
    const data = await fetch('/api/data');
    return processData(await data.json());
  });
}
```

### Manual Performance Measurement
```typescript
import { PerformanceTracker } from '@/lib/performance-utils';

const tracker = new PerformanceTracker();

async function complexOperation() {
  tracker.start('database-query');
  const data = await database.query('SELECT * FROM users');
  tracker.end('database-query'); // Logs: [Performance] database-query: 45.23ms

  tracker.start('data-processing');
  const processed = processData(data);
  tracker.end('data-processing'); // Logs: [Performance] data-processing: 12.34ms

  return processed;
}
```

### Component Render Tracking
```typescript
import { PerformanceTracker } from '@/lib/performance-utils';
import { useEffect } from 'react';

function ExpensiveComponent() {
  const tracker = new PerformanceTracker();

  useEffect(() => {
    tracker.start('component-mount');
    
    return () => {
      tracker.end('component-mount');
    };
  }, []);

  // Track render time
  tracker.start('render');
  const content = generateContent();
  const renderTime = tracker.end('render', false);

  if (renderTime > 100) {
    console.warn(`Component rendered slowly: ${renderTime}ms`);
  }

  return <div>{content}</div>;
}
```

---

## Resource Management

### Manage Intervals and Timeouts
```typescript
import { ResourceManager } from '@/lib/performance-utils';

const resources = new ResourceManager();

// Register an interval with auto-cleanup after 1 hour
const interval = setInterval(() => {
  console.log('Periodic task');
}, 5000);

resources.register(
  'periodic-task',
  () => clearInterval(interval),
  60 * 60 * 1000 // Auto cleanup after 1 hour
);

// Manual cleanup when needed
resources.cleanup('periodic-task');
```

### Component Cleanup Pattern
```typescript
import { ResourceManager } from '@/lib/performance-utils';
import { useEffect, useRef } from 'react';

function MonitoringComponent() {
  const resources = useRef(new ResourceManager());

  useEffect(() => {
    // Start monitoring
    const interval = setInterval(() => {
      performMonitoring();
    }, 10000);

    resources.current.register('monitoring', () => {
      clearInterval(interval);
      console.log('Monitoring stopped');
    });

    // Cleanup on unmount
    return () => {
      resources.current.cleanupAll();
    };
  }, []);

  return <div>Monitoring active...</div>;
}
```

### Subscription Management
```typescript
import { ResourceManager } from '@/lib/performance-utils';

class DataService {
  private resources = new ResourceManager();

  subscribe(topic: string, callback: (data: any) => void) {
    const subscription = eventBus.on(topic, callback);
    
    this.resources.register(`subscription-${topic}`, () => {
      subscription.unsubscribe();
    });
  }

  cleanup() {
    this.resources.cleanupAll();
    console.log(`Cleaned up ${this.resources.size} subscriptions`);
  }
}
```

---

## Advanced Patterns

### Combining Multiple Utilities
```typescript
import { 
  debounce, 
  LRUCache, 
  PerformanceTracker,
  memoize 
} from '@/lib/performance-utils';

class OptimizedSearchService {
  private cache = new LRUCache<string, SearchResult[]>(100);
  private tracker = new PerformanceTracker();

  // Debounced, cached, and performance-tracked search
  search = debounce(
    memoize(
      async (query: string): Promise<SearchResult[]> => {
        return this.tracker.measureAsync('search', async () => {
          // Check cache
          const cached = this.cache.get(query);
          if (cached) return cached;

          // Perform search
          const results = await this.performSearch(query);
          this.cache.set(query, results);
          return results;
        });
      },
      { maxSize: 50, ttl: 5 * 60 * 1000 }
    ),
    300
  );

  private async performSearch(query: string): Promise<SearchResult[]> {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  }
}
```

### React Hook for Optimized Data Fetching
```typescript
import { useState, useEffect, useRef } from 'react';
import { debounce, LRUCache } from '@/lib/performance-utils';

const dataCache = new LRUCache<string, any>(100);

export function useOptimizedFetch<T>(url: string, delay = 300) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useRef(
    debounce(async (fetchUrl: string) => {
      // Check cache
      const cached = dataCache.get(fetchUrl);
      if (cached) {
        setData(cached);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(fetchUrl);
        const result = await response.json();
        dataCache.set(fetchUrl, result);
        setData(result);
      } finally {
        setLoading(false);
      }
    }, delay)
  ).current;

  useEffect(() => {
    fetchData(url);
  }, [url]);

  return { data, loading };
}
```

---

## Best Practices

1. **Choose the Right Tool**:
   - Use `debounce` for user input (search, form fields)
   - Use `throttle` for scroll/resize events
   - Use `memoize` for pure, expensive functions
   - Use `BatchProcessor` for database operations
   - Use `LRUCache` for data that doesn't change often

2. **Set Appropriate Limits**:
   - Cache size should fit your use case (don't cache everything)
   - TTL should match data freshness requirements
   - Batch sizes should balance latency vs throughput

3. **Monitor Performance**:
   - Use `PerformanceTracker` in development
   - Remove performance logs in production (or use logging levels)
   - Set up alerts for slow operations

4. **Clean Up Resources**:
   - Always use `ResourceManager` for intervals and subscriptions
   - Clean up on component unmount
   - Implement graceful shutdown for services

5. **Test Performance Improvements**:
   - Measure before and after optimization
   - Use realistic data volumes
   - Test under load conditions
