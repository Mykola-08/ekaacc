/**
 * @ekaacc/ai-services
 * 
 * Shared AI services for personalization and background monitoring.
 */

export { AIPersonalizationService } from './ai-personalization-service';
export { AIBackgroundMonitor } from './ai-background-monitor';
export { AIServiceOptimizer, aiOptimizer } from './ai-optimizer';

// Re-export types
export type {
  QueryComplexity,
  CachedResponse,
  OptimizedModelSelection
} from './ai-optimizer';
