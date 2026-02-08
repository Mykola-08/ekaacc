/**
 * AI Services Index
 * Central export point for all AI-related services
 *
 * These services provide comprehensive AI features including:
 * - Chat tools for LLM interactions
 * - Memory and context management
 * - Wellness tracking and analysis
 * - Personalized recommendations
 * - User insights and analytics
 */

// AI Tools - Functions exposed to the LLM
export { aiTools, toolCategories } from './ai-tools';

// Memory Service - Persistent memory and conversation history
export {
  createMemory,
  getRecentMemories,
  getImportantMemories,
  updateMemoryImportance,
  deleteMemory,
  getOrCreateConversation,
  saveMessage,
  getConversationMessages,
  getUserConversations,
  buildMemoryContext,
  extractMemoriesFromMessage,
  logAIInteraction,
  type MemoryType,
  type UserMemory,
  type ConversationMessage,
  type Conversation,
} from './ai-memory-service';

// Insights Service - AI-generated insights and analytics
export {
  getActiveInsights,
  createInsight,
  calculateWellnessScore,
  detectBehavioralPatterns,
  generateInsights,
  completeActionItem,
  dismissInsight,
  getAIUserProfile,
  updateAIUserProfile,
  type InsightType,
  type InsightPriority,
  type AIInsight,
  type ActionItem,
  type WellnessScore,
  type UserBehaviorPattern,
} from './ai-insights-service';

// Wellness Service - Mood and health tracking
export {
  createMoodEntry,
  getMoodEntries,
  getTodaysMoodEntry,
  getWellnessSummary,
  createWellnessGoal,
  getActiveGoals,
  updateGoalProgress,
  getMoodChartData,
  generateWellnessRecommendations,
  exportWellnessData,
  EMOTIONS,
  ACTIVITIES,
  type MoodLevel,
  type EnergyLevel,
  type StressLevel,
  type MoodEntry,
  type WellnessSummary,
  type WellnessGoal,
  type DailyCheckIn,
} from './wellness-service';

// Recommendation Engine - Personalized suggestions
export {
  getUserPreferences,
  generateServiceRecommendations,
  generateExerciseRecommendations,
  generateActionRecommendations,
  getAllRecommendations,
  logRecommendationInteraction,
  getRecommendationHistory,
  type RecommendationType,
  type RecommendationPriority,
  type Recommendation,
  type ServiceRecommendation,
  type ExerciseRecommendation,
  type UserPreferences,
} from './recommendation-engine';

// User Context Service - Comprehensive user data for AI
export {
  buildUserContext,
  formatContextForAI,
  extractAndStoreLearnings,
  updateUserBehaviorPatterns,
  type UserContext,
  type UserProfile,
  type UserPreferencesData,
  type WellnessContext,
  type BookingContext,
  type FinancialContext,
  type InteractionContext,
  type MemoryContext,
  type InsightContext,
  type ComputedContext,
} from './user-context-service';
