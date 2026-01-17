
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  LRUCache,
  BatchProcessor,
  debounce,
  throttle,
  memoize,
  mapFilter,
  asyncBatch,
  PerformanceTracker,
  ResourceManager
} from '../performance-utils';

describe('Performance Utils', () => {
  describe('LRUCache', () => {
    it('should store and retrieve values', () => {
      const cache = new LRUCache<string, number>(3);
      cache.set('a', 1);
      cache.set('b', 2);
      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBe(2);
    });

    it('should evict least recently used items', () => {
      const cache = new LRUCache<string, number>(2);
      cache.set('a', 1);
      cache.set('b', 2);
      cache.get('a'); // Access 'a' to make it most recently used
      cache.set('c', 3); // Should evict 'b'

      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
    });

    it('should update position on set', () => {
      const cache = new LRUCache<string, number>(2);
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('a', 3); // Update 'a', making it most recently used
      cache.set('c', 4); // Should evict 'b'

      expect(cache.get('a')).toBe(3);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
    });

    it('should delete items', () => {
      const cache = new LRUCache<string, number>(2);
      cache.set('a', 1);
      expect(cache.delete('a')).toBe(true);
      expect(cache.has('a')).toBe(false);
      expect(cache.delete('b')).toBe(false);
    });

    it('should clear cache', () => {
      const cache = new LRUCache<string, number>(2);
      cache.set('a', 1);
      cache.clear();
      expect(cache.size).toBe(0);
    });
  });

  describe('BatchProcessor', () => {
    it('should process items in batches', async () => {
      const processFn = vi.fn(async (items: number[]) => {});
      const processor = new BatchProcessor<number>(processFn, 3, 1000);

      processor.add(1);
      processor.add(2);
      processor.add(3); // Should trigger flush

      expect(processFn).toHaveBeenCalledWith([1, 2, 3]);
    });

    it('should flush on timeout', async () => {
      vi.useFakeTimers();
      const processFn = vi.fn(async (items: number[]) => {});
      const processor = new BatchProcessor<number>(processFn, 3, 1000);

      processor.add(1);
      processor.add(2);

      vi.advanceTimersByTime(1000);

      expect(processFn).toHaveBeenCalledWith([1, 2]);
      vi.useRealTimers();
    });

    it('should retry failed items', async () => {
      const processFn = vi.fn<(items: number[]) => Promise<void>>()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValue(undefined);
      
      const processor = new BatchProcessor<number>(processFn, 2, 1000);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      processor.add(1);
      processor.add(2); // Triggers first flush (fails)

      await new Promise(resolve => setTimeout(resolve, 0)); // Allow promise to reject

      expect(processFn).toHaveBeenCalledTimes(1);
      
      // Items should be put back in batch
      // Trigger another flush manually or add more items
      await processor.flush();

      expect(processFn).toHaveBeenCalledTimes(2);
      expect(processFn).toHaveBeenLastCalledWith([1, 2]);
      
      consoleSpy.mockRestore();
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it('should support leading edge', () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100, { leading: true, trailing: false });

      debouncedFunc();
      expect(func).toHaveBeenCalledTimes(1);

      debouncedFunc();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      debouncedFunc();
      expect(func).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);

      throttledFunc();
      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2); // Trailing call
      vi.useRealTimers();
    });
  });

  describe('memoize', () => {
    it('should memoize results', () => {
      const func = vi.fn((x: number) => x * 2);
      const memoizedFunc = memoize(func);

      expect(memoizedFunc(2)).toBe(4);
      expect(memoizedFunc(2)).toBe(4);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should respect TTL', () => {
      vi.useFakeTimers();
      const func = vi.fn((x: number) => x * 2);
      const memoizedFunc = memoize(func, { ttl: 100 });

      expect(memoizedFunc(2)).toBe(4);
      
      vi.advanceTimersByTime(101);
      
      expect(memoizedFunc(2)).toBe(4);
      expect(func).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });
  });

  describe('mapFilter', () => {
    it('should map and filter in one pass', () => {
      const items = [1, 2, 3, 4, 5];
      const result = mapFilter(
        items,
        x => x % 2 === 0,
        x => x * 2
      );
      expect(result).toEqual([4, 8]);
    });
  });

  describe('asyncBatch', () => {
    it('should process items with concurrency limit', async () => {
      const items = [1, 2, 3, 4, 5];
      const processFn = vi.fn(async (x: number) => x * 2);
      
      const { results } = await asyncBatch(items, processFn, 2);
      
      expect(results).toHaveLength(5);
      expect(results).toContain(2);
      expect(results).toContain(10);
      expect(processFn).toHaveBeenCalledTimes(5);
    });

    it('should handle errors gracefully', async () => {
      const items = [1, 2, 3];
      const processFn = vi.fn(async (x: number) => {
        if (x === 2) throw new Error('Fail');
        return x * 2;
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const { results, errors } = await asyncBatch(items, processFn, 2);
      
      expect(results).toEqual([2, 6]);
      expect(errors).toHaveLength(1);
      
      consoleSpy.mockRestore();
    });
  });

  describe('PerformanceTracker', () => {
    it('should measure execution time', () => {
      const tracker = new PerformanceTracker();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      tracker.start('test');
      const duration = tracker.end('test');
      
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('ResourceManager', () => {
    it('should cleanup resources', () => {
      const manager = new ResourceManager();
      const cleanup = vi.fn();
      
      manager.register('res1', cleanup);
      manager.cleanup('res1');
      
      expect(cleanup).toHaveBeenCalled();
    });

    it('should auto-cleanup after timeout', () => {
      vi.useFakeTimers();
      const manager = new ResourceManager();
      const cleanup = vi.fn();
      
      manager.register('res1', cleanup, 100);
      
      vi.advanceTimersByTime(100);
      
      expect(cleanup).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
});
