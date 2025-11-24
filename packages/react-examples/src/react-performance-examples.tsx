/**
 * React Performance Optimization Examples
 * Demonstrates best practices for optimizing React components
 */

import React, { useState, useMemo, useCallback, memo } from 'react';
import { debounce, LRUCache, PerformanceTracker } from '@/lib/performance-utils';

// ============================================================================
// Example 1: Memoized Component to Prevent Unnecessary Re-renders
// ============================================================================

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onSelect: (id: string) => void;
}

// Without memo: Re-renders whenever parent re-renders
export function UserCardUnoptimized({ user, onSelect }: UserCardProps) {
  console.log('UserCard rendered (unoptimized)');
  return (
    <div onClick={() => onSelect(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// With memo: Only re-renders when props actually change
export const UserCardOptimized = memo(function UserCard({ user, onSelect }: UserCardProps) {
  console.log('UserCard rendered (optimized)');
  return (
    <div onClick={() => onSelect(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// ============================================================================
// Example 2: useCallback to Prevent Function Recreation
// ============================================================================

interface UserListProps {
  users: UserCardProps['user'][];
}

// Unoptimized: Creates new function on every render
export function UserListUnoptimized({ users }: UserListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div>
      {users.map(user => (
        <UserCardOptimized
          key={user.id}
          user={user}
          // ⚠️ New function created every render - causes UserCard to re-render
          onSelect={(id) => setSelectedId(id)}
        />
      ))}
    </div>
  );
}

// Optimized: Memoizes callback to prevent recreation
export function UserListOptimized({ users }: UserListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ✅ Callback only created once
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []); // Empty deps - function never changes

  return (
    <div>
      {users.map(user => (
        <UserCardOptimized
          key={user.id}
          user={user}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Example 3: useMemo for Expensive Computations
// ============================================================================

interface DataVisualizationProps {
  data: number[];
  threshold: number;
}

// Unoptimized: Recalculates on every render
export function DataVisualizationUnoptimized({ data, threshold }: DataVisualizationProps) {
  // ⚠️ Runs on every render, even when data doesn't change
  const processedData = data
    .filter(x => x > threshold)
    .map(x => x * 2)
    .sort((a, b) => b - a);

  const stats = {
    mean: processedData.reduce((a, b) => a + b, 0) / processedData.length,
    max: Math.max(...processedData),
    min: Math.min(...processedData)
  };

  return (
    <div>
      <p>Mean: {stats.mean}</p>
      <p>Max: {stats.max}</p>
      <p>Min: {stats.min}</p>
    </div>
  );
}

// Optimized: Only recalculates when dependencies change
export function DataVisualizationOptimized({ data, threshold }: DataVisualizationProps) {
  // ✅ Only recalculates when data or threshold changes
  const processedData = useMemo(() => {
    console.log('Processing data...');
    return data
      .filter(x => x > threshold)
      .map(x => x * 2)
      .sort((a, b) => b - a);
  }, [data, threshold]);

  const stats = useMemo(() => {
    console.log('Calculating stats...');
    return {
      mean: processedData.reduce((a, b) => a + b, 0) / processedData.length,
      max: Math.max(...processedData),
      min: Math.min(...processedData)
    };
  }, [processedData]);

  return (
    <div>
      <p>Mean: {stats.mean}</p>
      <p>Max: {stats.max}</p>
      <p>Min: {stats.min}</p>
    </div>
  );
}

// ============================================================================
// Example 4: Debounced Search Input
// ============================================================================

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInputOptimized({ onSearch }: SearchInputProps) {
  const [inputValue, setInputValue] = useState('');

  // ✅ Debounce search to avoid excessive API calls
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      console.log('Searching for:', query);
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}

// ============================================================================
// Example 5: Virtual List for Large Datasets
// ============================================================================

interface VirtualListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export function VirtualList({ items, itemHeight, containerHeight, renderItem }: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate which items to render
  const { visibleItems, offsetY } = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      visibleItems: items.slice(startIndex, endIndex),
      offsetY: startIndex * itemHeight
    };
  }, [scrollTop, items, itemHeight, containerHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 6: Code Splitting with React.lazy
// ============================================================================

// Placeholder for heavy component (in real app, this would be in separate file)
const HeavyChartComponent = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Heavy Chart Component</h3>
      <p>This would be a large charting library like Chart.js or D3</p>
    </div>
  );
};

// ✅ Only load heavy component when needed
const HeavyChart = React.lazy(() => 
  Promise.resolve({ default: HeavyChartComponent })
);

export function DashboardOptimized() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(!showChart)}>
        Toggle Chart
      </button>
      
      {showChart && (
        <React.Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </React.Suspense>
      )}
    </div>
  );
}

// ============================================================================
// Example 7: Cached Data Fetching Hook
// ============================================================================

const dataCache = new LRUCache<string, any>(100);

export function useCachedFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = dataCache.get(url);
    if (cached) {
      setData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      dataCache.set(url, result);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Usage
export function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useCachedFetch<any>(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return <div>{data.name}</div>;
}

// ============================================================================
// Example 8: Performance Monitoring HOC
// ============================================================================

export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return memo(function PerformanceTracked(props: P) {
    const tracker = useMemo(() => new PerformanceTracker(), []);
    const renderCount = React.useRef(0);

    React.useEffect(() => {
      renderCount.current += 1;
      
      if (renderCount.current > 10) {
        console.warn(`${componentName} has rendered ${renderCount.current} times`);
      }
    });

    tracker.start('render');
    const component = <Component {...props} />;
    const renderTime = tracker.end('render', false);

    if (renderTime > 16) { // > 16ms is one frame
      console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms`);
    }

    return component;
  });
}

// Usage
const MonitoredUserList = withPerformanceTracking(UserListOptimized, 'UserList');

// ============================================================================
// Example 9: Optimized Form with Multiple Fields
// ============================================================================

interface FormData {
  name: string;
  email: string;
  bio: string;
}

export function OptimizedForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    bio: ''
  });

  // ✅ Single callback for all fields instead of one per field
  const handleChange = useCallback((field: keyof FormData) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };
  }, []);

  // ✅ Debounced auto-save
  const autoSave = useMemo(
    () => debounce((data: FormData) => {
      console.log('Auto-saving...', data);
      // API call to save
    }, 1000),
    []
  );

  React.useEffect(() => {
    autoSave(formData);
  }, [formData, autoSave]);

  return (
    <form>
      <input
        type="text"
        value={formData.name}
        onChange={handleChange('name')}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        placeholder="Email"
      />
      <textarea
        value={formData.bio}
        onChange={handleChange('bio')}
        placeholder="Bio"
      />
    </form>
  );
}

// ============================================================================
// Performance Tips Summary
// ============================================================================

/**
 * 1. Use React.memo for components that render often with same props
 * 2. Use useCallback for functions passed to child components
 * 3. Use useMemo for expensive computations
 * 4. Debounce user input handlers
 * 5. Use virtual lists for long lists (>100 items)
 * 6. Code split heavy components with React.lazy
 * 7. Cache API responses
 * 8. Monitor component render performance
 * 9. Avoid inline object/array creation in render
 * 10. Keep component trees shallow
 */
