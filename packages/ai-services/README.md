# @ekaacc/ai-services

Shared AI services for personalization and background monitoring across the ekaacc monorepo.

## Features

- **AIPersonalizationService**: User behavior analysis and personalization
  - LRU cache with TTL for profiles
  - Therapy patterns caching
  - Single-pass data extraction
  - Bounded growth with auto-cleanup

- **AIBackgroundMonitor**: Background monitoring and insights
  - Memory leak prevention with proper cleanup
  - Retry logic with configurable attempts
  - Resource tracking and statistics

- **AIMemoryService**: Long-term memory and RAG capabilities
  - Store and retrieve user memories using Vector Search
  - Integrate with Supabase Edge Functions for secure embedding generation
  - Semantic search for journal entries and user context

## Installation

This package is part of the ekaacc monorepo and is automatically available to all apps via workspace dependencies.

## Usage

```typescript
import { AIPersonalizationService, AIBackgroundMonitor } from '@ekaacc/ai-services';

// Use personalization service
const personalization = new AIPersonalizationService();
await personalization.initializeUserProfile(userId);

// Use background monitor
const monitor = new AIBackgroundMonitor();
await monitor.initializeMonitoring(userId, {
  enabled: true,
  monitoringLevel: 'moderate'
});
```

## Documentation

See `PERFORMANCE_IMPROVEMENTS.md` in the repository root for detailed documentation.
