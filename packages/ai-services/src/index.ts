/**
 * @ekaacc/ai-services
 * 
 * Shared AI services for personalization, monitoring, and wellness features.
 */

export { AIPersonalizationService } from './ai-personalization-service';
export { AIBackgroundMonitor } from './ai-background-monitor';
export { AIServiceOptimizer, aiOptimizer } from './ai-optimizer';
export { AIWellnessCoach, wellnessCoach } from './ai-wellness-coach';
export { AIJournalAnalyzer, journalAnalyzer } from './ai-journal-analyzer';
export { AIMoodPredictor, moodPredictor } from './ai-mood-predictor';
export { AILearningPathGenerator, learningPathGenerator } from './ai-learning-path-generator';
export { AIMemoryService } from './ai-memory-service';
export { AIContentModerator, contentModerator } from './ai-content-moderator';
export { AIConversationService, conversationService } from './ai-conversation-service';
export { HuggingFaceAgent, hfAgent } from './hf-agent';

// Re-export types
export type {
  QueryComplexity,
  CachedResponse,
  OptimizedModelSelection
} from './ai-optimizer';

export type {
  WellnessMetrics,
  WellnessRecommendation,
  CheckInMessage
} from './ai-wellness-coach';

export type {
  JournalSentiment,
  JournalTheme,
  CognitiveDistortion,
  JournalInsight,
  JournalAnalysis
} from './ai-journal-analyzer';

export type {
  MoodPattern,
  MoodPrediction,
  MoodTrigger,
  EarlyWarningSign
} from './ai-mood-predictor';

export type {
  LearningPathRecommendation,
  CourseRecommendation
} from './ai-learning-path-generator';

export type {
  ModerationResult,
  ModerationCategory,
  CrisisIndicator
} from './ai-content-moderator';

export type {
  ConversationMessage,
  ConversationContext,
  ConversationResponse
} from './ai-conversation-service';

