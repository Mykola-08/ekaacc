import { AIPersonalizationService } from './ai-personalization-service';
import { AISDKNextService } from './ai-sdk-next-service';

interface MonitoringConfig {
  enabled: boolean;
  monitoringLevel: 'minimal' | 'moderate' | 'comprehensive';
  updateInterval: number; // milliseconds
  privacyLevel: 'minimal' | 'balanced' | 'comprehensive';
  proactiveInsights: boolean;
  realTimeAlerts: boolean;
}

interface BackgroundAIInsight {
  id: string;
  userId: string;
  type: 'wellness_deterioration' | 'engagement_decline' | 'session_abnormality' | 'mood_pattern_change' | 'therapy_effectiveness' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  timestamp: Date;
  suggestedActions: string[];
  requiresIntervention: boolean;
  context: {
    page: string;
    recentActivity: string[];
    relevantMetrics: Record<string, any>;
  };
}

interface UserActivitySnapshot {
  userId: string;
  timestamp: Date;
  currentPage: string;
  sessionDuration: number;
  recentInteractions: string[];
  recentActivity?: any[]; // Recent user activity data
  moodIndicators: {
    recentMoodEntries: number[];
    averageMood: number;
    moodTrend: 'improving' | 'declining' | 'stable';
  };
  engagementMetrics: {
    pageViews: number;
    clicks: number;
    timeOnPage: number;
    scrollDepth: number;
  };
  wellnessMetrics: {
    journalEntries: number;
    goalUpdates: number;
    sessionCompletions: number;
  };
}

export class AIBackgroundMonitor {
  private personalizationService: AIPersonalizationService;
  private aiService: AISDKNextService;
  private monitoringConfigs: Map<string, MonitoringConfig>;
  private userActivitySnapshots: Map<string, UserActivitySnapshot[]>;
  private monitoringIntervals: Map<string, NodeJS.Timeout>;
  private activeInsights: Map<string, BackgroundAIInsight[]>;
  private alertCallbacks: Map<string, (insight: BackgroundAIInsight) => void>;

  constructor() {
    this.personalizationService = new AIPersonalizationService();
    this.aiService = AISDKNextService.getInstance();
    this.monitoringConfigs = new Map();
    this.userActivitySnapshots = new Map();
    this.monitoringIntervals = new Map();
    this.activeInsights = new Map();
    this.alertCallbacks = new Map();
  }

  async initializeMonitoring(userId: string, config?: Partial<MonitoringConfig>): Promise<void> {
    const defaultConfig: MonitoringConfig = {
      enabled: true,
      monitoringLevel: 'moderate',
      updateInterval: 30000, // 30 seconds
      privacyLevel: 'balanced',
      proactiveInsights: true,
      realTimeAlerts: true
    };

    const userConfig = { ...defaultConfig, ...config };
    this.monitoringConfigs.set(userId, userConfig);

    // Initialize user profile if needed
    await this.personalizationService.initializeUserProfile(userId);

    // Start monitoring if enabled
    if (userConfig.enabled) {
      this.startMonitoring(userId, userConfig);
    }

    console.log(`AI Background Monitor initialized for user ${userId}`);
  }

  private startMonitoring(userId: string, config: MonitoringConfig): void {
    // Clear existing interval if any
    const existingInterval = this.monitoringIntervals.get(userId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Create new monitoring interval with error handling to prevent memory leaks
    const interval = setInterval(async () => {
      try {
        await this.performBackgroundAnalysis(userId);
      } catch (error) {
        console.error(`Critical error in monitoring for user ${userId}, stopping monitoring:`, error);
        // Stop monitoring on critical errors to prevent memory leaks
        this.stopMonitoring(userId);
      }
    }, config.updateInterval);

    this.monitoringIntervals.set(userId, interval);
  }

  async performBackgroundAnalysis(userId: string): Promise<void> {
    const config = this.monitoringConfigs.get(userId);
    if (!config || !config.enabled) return;

    try {
      // Capture current activity snapshot
      const snapshot = await this.captureActivitySnapshot(userId);
      
      // Store snapshot
      this.storeActivitySnapshot(userId, snapshot);

      // Analyze patterns and detect anomalies
      const insights = await this.analyzeUserPatterns(userId, snapshot);
      
      // Filter insights based on privacy level
      const filteredInsights = this.filterInsightsByPrivacy(insights, config.privacyLevel);

      // Store insights
      this.storeInsights(userId, filteredInsights);

      // Trigger alerts for high-severity insights
      if (config.realTimeAlerts) {
        this.triggerAlerts(userId, filteredInsights);
      }

      // Generate proactive recommendations
      if (config.proactiveInsights) {
        await this.generateProactiveRecommendations(userId, snapshot);
      }

    } catch (error) {
      console.error(`Error in background analysis for user ${userId}:`, error);
    }
  }

  private async captureActivitySnapshot(userId: string): Promise<UserActivitySnapshot> {
    const now = new Date();
    
    // Get recent interactions from personalization service
    const recentInteractions = await this.getRecentUserInteractions(userId);
    
    // Calculate metrics
    const sessionDuration = this.calculateSessionDuration(recentInteractions);
    const moodEntries = this.extractMoodData(recentInteractions);
    const engagementMetrics = this.calculateEngagementMetrics(recentInteractions);
    const wellnessMetrics = this.calculateWellnessMetrics(recentInteractions);

    return {
      userId,
      timestamp: now,
      currentPage: this.getCurrentPage(recentInteractions),
      sessionDuration,
      recentInteractions: recentInteractions.map(i => i.type),
      moodIndicators: {
        recentMoodEntries: moodEntries,
        averageMood: moodEntries.length > 0 ? moodEntries.reduce((a, b) => a + b, 0) / moodEntries.length : 5,
        moodTrend: this.calculateMoodTrend(moodEntries)
      },
      engagementMetrics,
      wellnessMetrics
    };
  }

  private async getRecentUserInteractions(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.personalizationService.getSupabaseClient()
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('timestamp', { ascending: false })
        .limit(50);

      return data || [];
    } catch (error) {
      console.error('Error fetching recent interactions:', error);
      return [];
    }
  }

  private calculateSessionDuration(interactions: any[]): number {
    if (interactions.length === 0) return 0;
    
    const sessionStart = new Date(interactions[interactions.length - 1].timestamp);
    const sessionEnd = new Date(interactions[0].timestamp);
    
    return Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000); // seconds
  }

  private extractMoodData(interactions: any[]): number[] {
    // Optimized: Single pass instead of multiple filter/map chains
    const moodData: number[] = [];
    for (const interaction of interactions) {
      if (interaction.interaction_type === 'mood_entry') {
        const mood = interaction.metadata?.moodLevel || 5;
        if (mood >= 1 && mood <= 10) {
          moodData.push(mood);
        }
      }
    }
    return moodData;
  }

  private calculateEngagementMetrics(interactions: any[]): UserActivitySnapshot['engagementMetrics'] {
    const pageViews = interactions.filter(i => i.interaction_type === 'page_view').length;
    const clicks = interactions.filter(i => i.interaction_type === 'click').length;
    const timeOnPage = interactions.reduce((sum, i) => sum + (i.context?.timeOnPage || 0), 0);
    const scrollDepth = interactions.reduce((sum, i) => sum + (i.metadata?.scrollDepth || 0), 0) / Math.max(1, interactions.length);

    return {
      pageViews,
      clicks,
      timeOnPage,
      scrollDepth
    };
  }

  private calculateWellnessMetrics(interactions: any[]): UserActivitySnapshot['wellnessMetrics'] {
    const journalEntries = interactions.filter(i => i.interaction_type === 'journal_entry').length;
    const goalUpdates = interactions.filter(i => i.interaction_type === 'goal_update').length;
    const sessionCompletions = interactions.filter(i => i.interaction_type === 'session_end').length;

    return {
      journalEntries,
      goalUpdates,
      sessionCompletions
    };
  }

  private getCurrentPage(interactions: any[]): string {
    const pageView = interactions.find(i => i.interaction_type === 'page_view');
    return pageView?.context?.page || 'unknown';
  }

  private calculateMoodTrend(moodEntries: number[]): 'improving' | 'declining' | 'stable' {
    if (moodEntries.length < 3) return 'stable';

    const recent = moodEntries.slice(-3);
    const earlier = moodEntries.slice(0, -3);
    
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgEarlier = earlier.length > 0 ? earlier.reduce((a, b) => a + b, 0) / earlier.length : avgRecent;

    const change = avgRecent - avgEarlier;
    
    if (change > 0.5) return 'improving';
    if (change < -0.5) return 'declining';
    return 'stable';
  }

  private storeActivitySnapshot(userId: string, snapshot: UserActivitySnapshot): void {
    const snapshots = this.userActivitySnapshots.get(userId) || [];
    snapshots.unshift(snapshot);
    
    // Keep only last 100 snapshots
    if (snapshots.length > 100) {
      snapshots.splice(100);
    }
    
    this.userActivitySnapshots.set(userId, snapshots);
  }

  private async analyzeUserPatterns(userId: string, currentSnapshot: UserActivitySnapshot): Promise<BackgroundAIInsight[]> {
    const insights: BackgroundAIInsight[] = [];
    const snapshots = this.userActivitySnapshots.get(userId) || [];
    
    // Analyze mood patterns
    const moodInsights = this.analyzeMoodPatterns(currentSnapshot, snapshots);
    insights.push(...moodInsights);

    // Analyze engagement patterns
    const engagementInsights = this.analyzeEngagementPatterns(currentSnapshot, snapshots);
    insights.push(...engagementInsights);

    // Analyze wellness patterns
    const wellnessInsights = this.analyzeWellnessPatterns(currentSnapshot, snapshots);
    insights.push(...wellnessInsights);

    // Use AI for complex pattern analysis
    const aiInsights = await this.generateAIInsights(userId, currentSnapshot, snapshots);
    insights.push(...aiInsights);

    return insights;
  }

  private analyzeMoodPatterns(current: UserActivitySnapshot, historical: UserActivitySnapshot[]): BackgroundAIInsight[] {
    const insights: BackgroundAIInsight[] = [];

    // Check for significant mood decline
    if (current.moodIndicators.moodTrend === 'declining' && current.moodIndicators.averageMood < 4) {
      insights.push({
        id: `mood_decline_${Date.now()}`,
        userId: current.userId,
        type: 'wellness_deterioration',
        title: 'Mood Decline Detected',
        description: 'Your recent mood entries show a declining trend. Consider reaching out for support.',
        severity: 'high',
        confidence: 85,
        timestamp: new Date(),
        suggestedActions: [
          'Consider scheduling a therapy session',
          'Reach out to your support network',
          'Practice self-care activities',
          'Use grounding techniques'
        ],
        requiresIntervention: true,
        context: {
          page: current.currentPage,
          recentActivity: current.recentInteractions,
          relevantMetrics: {
            averageMood: current.moodIndicators.averageMood,
            moodTrend: current.moodIndicators.moodTrend,
            recentEntries: current.moodIndicators.recentMoodEntries.length
          }
        }
      });
    }

    // Check for mood stability
    if (current.moodIndicators.recentMoodEntries.length >= 5) {
      const variance = this.calculateMoodVariance(current.moodIndicators.recentMoodEntries);
      if (variance > 2) {
        insights.push({
          id: `mood_instability_${Date.now()}`,
          userId: current.userId,
          type: 'mood_pattern_change',
          title: 'Mood Instability Detected',
          description: 'Your mood patterns show significant variation. Consider tracking triggers.',
          severity: 'medium',
          confidence: 75,
          timestamp: new Date(),
          suggestedActions: [
            'Track mood triggers in your journal',
            'Review recent life events',
            'Consider stress management techniques',
            'Maintain consistent sleep schedule'
          ],
          requiresIntervention: false,
          context: {
            page: current.currentPage,
            recentActivity: (current.recentActivity || []) as string[],
            relevantMetrics: { moodVariance: variance }
          }
        });
      }
    }

    return insights;
  }

  private analyzeEngagementPatterns(current: UserActivitySnapshot, historical: UserActivitySnapshot[]): BackgroundAIInsight[] {
    const insights: BackgroundAIInsight[] = [];

    // Check for engagement decline
    if (historical.length >= 7) {
      const recentEngagement = historical.slice(0, 3).reduce((sum, s) => sum + s.engagementMetrics.pageViews, 0) / 3;
      const previousEngagement = historical.slice(3, 6).reduce((sum, s) => sum + s.engagementMetrics.pageViews, 0) / 3;

      if (recentEngagement < previousEngagement * 0.5) {
        insights.push({
          id: `engagement_decline_${Date.now()}`,
          userId: current.userId,
          type: 'engagement_decline',
          title: 'Engagement Decline Detected',
          description: 'Your recent app usage has significantly decreased. Is everything okay?',
          severity: 'medium',
          confidence: 80,
          timestamp: new Date(),
          suggestedActions: [
            'Consider setting app reminders',
            'Try exploring new features',
            'Review your wellness goals',
            'Reach out for support if needed'
          ],
          requiresIntervention: false,
          context: {
            page: current.currentPage,
            recentActivity: (current.recentActivity || []) as string[],
            relevantMetrics: {
              recentEngagement,
              previousEngagement,
              decline: ((previousEngagement - recentEngagement) / previousEngagement) * 100
            }
          }
        });
      }
    }

    // Check for session abnormalities
    if (current.sessionDuration > 3600) { // 1 hour
      insights.push({
        id: `long_session_${Date.now()}`,
        userId: current.userId,
        type: 'session_abnormality',
        title: 'Extended Session Detected',
        description: 'You\'ve been using the app for an extended period. Remember to take breaks.',
        severity: 'low',
        confidence: 90,
        timestamp: new Date(),
        suggestedActions: [
          'Take a short break',
          'Practice the 20-20-20 rule for screen time',
          'Stay hydrated',
          'Consider a brief walk'
        ],
        requiresIntervention: false,
        context: {
          page: current.currentPage,
          recentActivity: (current.recentActivity || []) as string[],
          relevantMetrics: { sessionDuration: current.sessionDuration }
        }
      });
    }

    return insights;
  }

  private analyzeWellnessPatterns(current: UserActivitySnapshot, historical: UserActivitySnapshot[]): BackgroundAIInsight[] {
    const insights: BackgroundAIInsight[] = [];

    // Check for wellness activity decline
    if (historical.length >= 7) {
      const recentWellness = current.wellnessMetrics;
      const avgHistoricalWellness = historical.slice(0, 7).reduce((sum, s) => ({
        journalEntries: sum.journalEntries + s.wellnessMetrics.journalEntries,
        goalUpdates: sum.goalUpdates + s.wellnessMetrics.goalUpdates,
        sessionCompletions: sum.sessionCompletions + s.wellnessMetrics.sessionCompletions
      }), { journalEntries: 0, goalUpdates: 0, sessionCompletions: 0 });

      avgHistoricalWellness.journalEntries /= 7;
      avgHistoricalWellness.goalUpdates /= 7;
      avgHistoricalWellness.sessionCompletions /= 7;

      if (recentWellness.journalEntries < avgHistoricalWellness.journalEntries * 0.3) {
        insights.push({
          id: `journal_decline_${Date.now()}`,
          userId: current.userId,
          type: 'wellness_deterioration',
          title: 'Journal Activity Decline',
          description: 'Your journaling activity has decreased significantly. Consider resuming your writing practice.',
          severity: 'low',
          confidence: 75,
          timestamp: new Date(),
          suggestedActions: [
            'Set a daily journaling reminder',
            'Start with brief entries',
            'Use journal prompts',
            'Try voice-to-text if writing feels difficult'
          ],
          requiresIntervention: false,
          context: {
            page: current.currentPage,
            recentActivity: (current.recentActivity || []) as string[],
            relevantMetrics: {
              recent: recentWellness.journalEntries,
              average: avgHistoricalWellness.journalEntries
            }
          }
        });
      }
    }

    return insights;
  }

  private async generateAIInsights(
    userId: string, 
    current: UserActivitySnapshot, 
    historical: UserActivitySnapshot[]
  ): Promise<BackgroundAIInsight[]> {
    try {
      const aiContext = {
        currentSnapshot: current,
        historicalSnapshots: historical.slice(0, 20), // Last 20 snapshots
        userProfile: await this.personalizationService.getPersonalizationProfile(userId),
        recentInteractions: current.recentInteractions
      };

      const aiInsights = await this.aiService.generateBackgroundInsights(aiContext);
      return aiInsights.map(insight => ({
        ...insight,
        userId,
        timestamp: new Date(),
        context: {
          page: current.currentPage,
          recentActivity: (current.recentActivity || []) as string[],
          relevantMetrics: (insight as any).context?.relevantMetrics || {}
        }
      } as BackgroundAIInsight));
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return [];
    }
  }

  private calculateMoodVariance(moodEntries: number[]): number {
    if (moodEntries.length === 0) return 0;
    
    const mean = moodEntries.reduce((a, b) => a + b, 0) / moodEntries.length;
    const variance = moodEntries.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / moodEntries.length;
    
    return Math.sqrt(variance);
  }

  private filterInsightsByPrivacy(insights: BackgroundAIInsight[], privacyLevel: string): BackgroundAIInsight[] {
    if (privacyLevel === 'minimal') {
      return insights.filter(insight => 
        insight.severity !== 'high' && 
        !insight.description.toLowerCase().includes('mood') &&
        !insight.description.toLowerCase().includes('emotion')
      );
    }
    
    if (privacyLevel === 'balanced') {
      return insights.filter(insight => insight.severity !== 'high');
    }
    
    return insights;
  }

  private storeInsights(userId: string, insights: BackgroundAIInsight[]): void {
    const existingInsights = this.activeInsights.get(userId) || [];
    
    // Add new insights
    const newInsights = [...insights, ...existingInsights];
    
    // Remove insights older than 7 days
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const filteredInsights = newInsights.filter(insight => 
      insight.timestamp > cutoffDate
    );
    
    // Keep only last 50 insights
    if (filteredInsights.length > 50) {
      filteredInsights.splice(50);
    }
    
    this.activeInsights.set(userId, filteredInsights);
  }

  private triggerAlerts(userId: string, insights: BackgroundAIInsight[]): void {
    const alertCallback = this.alertCallbacks.get(userId);
    if (!alertCallback) return;

    insights.forEach(insight => {
      if (insight.requiresIntervention || insight.severity === 'high') {
        alertCallback(insight);
      }
    });
  }

  private async generateProactiveRecommendations(userId: string, snapshot: UserActivitySnapshot): Promise<void> {
    try {
      const recommendations = await this.aiService.generateProactiveRecommendations({
        userId,
        currentSnapshot: snapshot,
        historicalSnapshots: this.userActivitySnapshots.get(userId) || []
      });

      // Store recommendations as insights
      const recommendationInsights: BackgroundAIInsight[] = recommendations.map(rec => ({
        id: `recommendation_${Date.now()}_${Math.random()}`,
        userId,
        type: 'recommendation',
        title: rec.title,
        description: rec.description,
        severity: 'low',
        confidence: rec.confidence || 70,
        timestamp: new Date(),
        suggestedActions: rec.actions || [],
        requiresIntervention: false,
        context: {
          page: snapshot.currentPage,
          recentActivity: snapshot.recentActivity || [],
          relevantMetrics: rec.metrics || {}
        }
      }));

      this.storeInsights(userId, recommendationInsights);
    } catch (error) {
      console.error('Error generating proactive recommendations:', error);
    }
  }

  // Public methods
  async updateMonitoringConfig(userId: string, updates: Partial<MonitoringConfig>): Promise<void> {
    const currentConfig = this.monitoringConfigs.get(userId);
    if (!currentConfig) return;

    const updatedConfig = { ...currentConfig, ...updates };
    this.monitoringConfigs.set(userId, updatedConfig);

    // Restart monitoring if interval changed
    if (updates.updateInterval && updates.updateInterval !== currentConfig.updateInterval) {
      this.startMonitoring(userId, updatedConfig);
    }
  }

  registerAlertCallback(userId: string, callback: (insight: BackgroundAIInsight) => void): void {
    this.alertCallbacks.set(userId, callback);
  }

  getActiveInsights(userId: string): BackgroundAIInsight[] {
    return this.activeInsights.get(userId) || [];
  }

  getRecentInsights(userId: string, limit: number = 10): BackgroundAIInsight[] {
    const insights = this.activeInsights.get(userId) || [];
    return insights.slice(0, limit);
  }

  clearInsights(userId: string): void {
    this.activeInsights.delete(userId);
  }

  stopMonitoring(userId: string): void {
    const interval = this.monitoringIntervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(userId);
    }
    
    // Clean up all resources for this user to prevent memory leaks
    this.monitoringConfigs.delete(userId);
    this.userActivitySnapshots.delete(userId);
    this.activeInsights.delete(userId);
    this.alertCallbacks.delete(userId);
    
    console.log(`AI Background Monitor stopped and cleaned up for user ${userId}`);
  }

  isMonitoring(userId: string): boolean {
    return this.monitoringIntervals.has(userId);
  }

  getMonitoringConfig(userId: string): MonitoringConfig | undefined {
    return this.monitoringConfigs.get(userId);
  }

  /**
   * Cleanup all monitoring for all users (for graceful shutdown)
   */
  stopAllMonitoring(): void {
    const userIds = Array.from(this.monitoringIntervals.keys());
    for (const userId of userIds) {
      this.stopMonitoring(userId);
    }
    console.log(`AI Background Monitor: All monitoring stopped, ${userIds.length} users cleaned up`);
  }

  /**
   * Get memory usage statistics for monitoring health
   */
  getMemoryStats(): {
    monitoredUsers: number;
    totalSnapshots: number;
    totalInsights: number;
    averageSnapshotsPerUser: number;
  } {
    const monitoredUsers = this.monitoringIntervals.size;
    let totalSnapshots = 0;
    let totalInsights = 0;

    for (const snapshots of this.userActivitySnapshots.values()) {
      totalSnapshots += snapshots.length;
    }

    for (const insights of this.activeInsights.values()) {
      totalInsights += insights.length;
    }

    return {
      monitoredUsers,
      totalSnapshots,
      totalInsights,
      averageSnapshotsPerUser: monitoredUsers > 0 ? totalSnapshots / monitoredUsers : 0
    };
  }
}