# Performance Optimizations

This project includes several performance optimizations to improve app speed and user experience.

## Optimistic UI

We use the `useOptimisticAction` hook to provide immediate feedback to users while server actions are processing.

### Usage

```tsx
import { useOptimisticAction } from '@/hooks/useOptimisticAction';

// ... inside component
const { state, runAction } = useOptimisticAction(initialState, (currentState, optimisticValue) => {
  return { ...currentState, ...optimisticValue };
});
```

## Predictive Prefetching

We use a "prediction algorithm" based on mouse movement to prefetch pages before the user clicks. This significantly reduces perceived latency.

### Usage

Use the `PredictiveLink` component instead of the standard `Link` component for critical navigation paths.

```tsx
import { PredictiveLink } from '@/components/PredictiveLink';

<PredictiveLink href="/dashboard" prefetchThreshold={200}>
  Go to Dashboard
</PredictiveLink>
```

The `prefetchThreshold` prop controls how far (in pixels) the mouse needs to be from the element to trigger the prefetch. The default is 150px.

### How it works

The `usePredictivePrefetch` hook tracks mouse movements. If the mouse is within the threshold distance of the target element, it triggers `router.prefetch()`. This ensures the page resources are loaded by the time the user actually clicks.
