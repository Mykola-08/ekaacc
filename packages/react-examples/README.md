# @ekaacc/react-examples

React performance optimization examples and patterns for the ekaacc monorepo.

## Features

Reference implementations for:
- Component memoization (React.memo, useCallback, useMemo)
- Debounced search and auto-save
- Virtual list rendering
- Code splitting with React.lazy
- Performance monitoring HOC

## Installation

This package is part of the ekaacc monorepo and is automatically available to all apps via workspace dependencies.

## Usage

```typescript
import { 
  UserListOptimized,
  SearchInputOptimized,
  VirtualList,
  withPerformanceTracking
} from '@ekaacc/react-examples';

// Use optimized components as reference for your own implementations
```

## Note

These are reference examples, not production components. Use them as patterns to implement in your own components.

## Documentation

See `PERFORMANCE_UTILS_EXAMPLES.md` in the repository root for usage examples.
