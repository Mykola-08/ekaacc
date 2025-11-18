import { createClient } from '@supabase/supabase-js';
import { AISDKNextService } from './ai-sdk-next-service';

interface UserInteraction {
  id: string;
  userId: string;
  type: 'page_view' | 'click' | 'form_submit' | 'session_start' | 'session_end' | 'goal_update' | 'journal_entry' | 'mood_entry';
  timestamp: Date;
  metadata: Record<string, any>;
  context: {
    page?: string;
    section?: string;
    component?: string;
    previousPage?: string;
    timeOnPage?: number;
  };
}

interface UserBehaviorPattern {
  id: string;
  userId: string;
  patternType: 'navigation' | 'engagement' | 'content_preference' | 'timing' | 'therapy_response';
  pattern: {
    frequency: number;
    confidence: number;
    characteristics: Record<string, any>;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  firstObserved: Date;
  lastUpdated: Date;
  significance: 'low' | 'medium' | 'high';
}

interface AIPersonalizationProfile {
  userId: string;
  behaviorPatterns: UserBehaviorPattern[];
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'supportive' | 'direct';
    contentFormat: 'text' | 'visual' | 'interactive' | 'mixed';
    interactionFrequency: 'minimal' | 'moderate' | 'frequent';
    proactiveLevel: 'low' | 'medium' | 'high';
    notificationTiming: 'immediate' | 'digest' | 'scheduled';
  };
  wellnessInsights: {
    moodPatterns: {
      stability: number;
      triggers: string[];
      improvements: string[];
      predictedTrend: 'improving' | 'declining' | 'stable';
    };
    therapyEffectiveness: {
      techniques: Array<{
        name: string;
        effectiveness: number;
        frequency: number;
        lastUsed: Date;
      }>;
      preferredModalities: string[];
      responseTime: number;
    };
    optimalConditions: {
      sessionTiming: string[];
      environment: string[];
      supportLevel: string;
    };
  };
  adaptiveSettings: {
    learningRate: number;
    confidenceThreshold: number;
    updateFrequency: number;
    privacyLevel: 'minimal' | 'balanced' | 'comprehensive';
  };
  lastUpdated: Date;
}

interface PersonalizationRequest {
  userId: string;
  context: {
    currentPage: string;
    recentActivity: UserInteraction[];
    subscriptionTier: 'basic' | 'premium' | 'vip';
  };
  preferences: {
    maxInsights: number;
    confidenceThreshold: number;
    includePredictions: boolean;
    privacyLevel: 'minimal' | 'balanced' | 'comprehensive';
  };
}

export class AIPersonalizationService {
  private supabase: any;
  private aiService: AISDKNextService;
  private learningModels: Map<string, any>;
  private userProfiles: Map<string, AIPersonalizationProfile>;

  getSupabaseClient(): any {
    return this.supabase;
  }

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.aiService = AISDKNextService.getInstance();
    this.learningModels = new Map();
    this.userProfiles = new Map();
  }

  async initializeUserProfile(userId: string): Promise<AIPersonalizationProfile> {
    // Check if profile exists
    const existingProfile = await this.getUserProfile(userId);
    if (existingProfile) {
      return existingProfile;
    }

    // Create default profile
    const defaultProfile: AIPersonalizationProfile = {
      userId,
      behaviorPatterns: [],
      preferences: {
        communicationStyle: 'supportive',
        contentFormat: 'mixed',
        interactionFrequency: 'moderate',
        proactiveLevel: 'medium',
        notificationTiming: 'digest'
      },
      wellnessInsights: {
        moodPatterns: {
          stability: 50,
          triggers: [],
          improvements: [],
          predictedTrend: 'stable'
        },
        therapyEffectiveness: {
          techniques: [],
          preferredModalities: [],
          responseTime: 24
        },
        optimalConditions: {
          sessionTiming: [],
          environment: [],
          supportLevel: 'moderate'
        }
      },
      adaptiveSettings: {
        learningRate: 0.1,
        confidenceThreshold: 0.7,
        updateFrequency: 24,
        privacyLevel: 'balanced'
      },
      lastUpdated: new Date()
    };

    await this.saveUserProfile(defaultProfile);
    return defaultProfile;
  }

  async trackUserInteraction(interaction: UserInteraction): Promise<void> {
    try {
      // Store interaction in database
      await this.supabase
        .from('user_interactions')
        .insert({
          user_id: interaction.userId,
          interaction_type: interaction.type,
          timestamp: interaction.timestamp,
          metadata: interaction.metadata,
          context: interaction.context
        });

      // Update user profile with new interaction
      await this.updateUserProfileFromInteraction(interaction);

      // Trigger pattern analysis if needed
      await this.analyzeUserPatterns(interaction.userId);
    } catch (error) {
      console.error('Error tracking user interaction:', error);
    }
  }

  private async updateUserProfileFromInteraction(interaction: UserInteraction): Promise<void> {
    const profile = await this.getUserProfile(interaction.userId);
    if (!profile) return;

    // Update behavior patterns based on interaction
    const updatedProfile = this.extractPatternsFromInteraction(profile, interaction);
    
    // Apply privacy settings
    const filteredProfile = this.applyPrivacySettings(updatedProfile);
    
    await this.saveUserProfile(filteredProfile);
  }

  private extractPatternsFromInteraction(
    profile: AIPersonalizationProfile, 
    interaction: UserInteraction
  ): AIPersonalizationProfile {
    const updatedProfile = { ...profile };

    // Extract navigation patterns
    if (interaction.type === 'page_view') {
      this.updateNavigationPattern(updatedProfile, interaction);
    }

    // Extract engagement patterns
    if (interaction.type === 'session_start' || interaction.type === 'session_end') {
      this.updateEngagementPattern(updatedProfile, interaction);
    }

    // Extract content preferences
    if (interaction.type === 'click' || interaction.type === 'form_submit') {
      this.updateContentPreferencePattern(updatedProfile, interaction);
    }

    // Extract therapy response patterns
    if (interaction.type === 'goal_update' || interaction.type === 'journal_entry' || interaction.type === 'mood_entry') {
      this.updateTherapyResponsePattern(updatedProfile, interaction);
    }

    // Extract timing patterns
    this.updateTimingPattern(updatedProfile, interaction);

    updatedProfile.lastUpdated = new Date();
    return updatedProfile;
  }

  private updateNavigationPattern(profile: AIPersonalizationProfile, interaction: UserInteraction): void {
    const page = interaction.context.page;
    if (!page) return;

    const existingPattern = profile.behaviorPatterns.find(
      p => p.patternType === 'navigation' && p.pattern.characteristics.page === page
    );

    if (existingPattern) {
      existingPattern.pattern.frequency++;
      existingPattern.pattern.confidence = Math.min(1.0, existingPattern.pattern.confidence + 0.05);
      existingPattern.lastUpdated = new Date();
    } else {
      profile.behaviorPatterns.push({
        id: `nav_${page}_${Date.now()}`,
        userId: profile.userId,
        patternType: 'navigation',
        pattern: {
          frequency: 1,
          confidence: 0.5,
          characteristics: { page, section: interaction.context.section },
          trend: 'increasing'
        },
        firstObserved: new Date(),
        lastUpdated: new Date(),
        significance: 'medium'
      });
    }
  }

  private updateEngagementPattern(profile: AIPersonalizationProfile, interaction: UserInteraction): void {
    const sessionDuration = interaction.context.timeOnPage || 0;
    
    const engagementLevel = sessionDuration > 300 ? 'high' : sessionDuration > 120 ? 'medium' : 'low';
    
    const existingPattern = profile.behaviorPatterns.find(
      p => p.patternType === 'engagement'
    );

    if (existingPattern) {
      existingPattern.pattern.characteristics.engagementLevel = engagementLevel;
      existingPattern.pattern.characteristics.averageDuration = 
        (existingPattern.pattern.characteristics.averageDuration + sessionDuration) / 2;
      existingPattern.lastUpdated = new Date();
    } else {
      profile.behaviorPatterns.push({
        id: `engagement_${Date.now()}`,
        userId: profile.userId,
        patternType: 'engagement',
        pattern: {
          frequency: 1,
          confidence: 0.7,
          characteristics: { engagementLevel, averageDuration: sessionDuration },
          trend: 'stable'
        },
        firstObserved: new Date(),
        lastUpdated: new Date(),
        significance: 'high'
      });
    }
  }

  private updateContentPreferencePattern(profile: AIPersonalizationProfile, interaction: UserInteraction): void {
    const contentType = interaction.metadata.contentType || interaction.context.component;
    if (!contentType) return;

    const existingPattern = profile.behaviorPatterns.find(
      p => p.patternType === 'content_preference' && p.pattern.characteristics.contentType === contentType
    );

    if (existingPattern) {
      existingPattern.pattern.frequency++;
      existingPattern.pattern.confidence = Math.min(1.0, existingPattern.pattern.confidence + 0.1);
      existingPattern.lastUpdated = new Date();
    } else {
      profile.behaviorPatterns.push({
        id: `content_${contentType}_${Date.now()}`,
        userId: profile.userId,
        patternType: 'content_preference',
        pattern: {
          frequency: 1,
          confidence: 0.6,
          characteristics: { contentType, interactionType: interaction.type },
          trend: 'increasing'
        },
        firstObserved: new Date(),
        lastUpdated: new Date(),
        significance: 'medium'
      });
    }
  }

  private updateTherapyResponsePattern(profile: AIPersonalizationProfile, interaction: UserInteraction): void {
    if (interaction.type === 'mood_entry') {
      const moodLevel = interaction.metadata.moodLevel;
      if (moodLevel !== undefined) {
        profile.wellnessInsights.moodPatterns.stability = this.calculateMoodStability(profile, moodLevel);
        
        if (moodLevel < 3) {
          profile.wellnessInsights.moodPatterns.triggers.push(interaction.metadata.trigger || 'unknown');
        } else if (moodLevel > 7) {
          profile.wellnessInsights.moodPatterns.improvements.push(interaction.metadata.activity || 'unknown');
        }
      }
    }

    if (interaction.type === 'goal_update') {
      const technique = interaction.metadata.technique;
      const effectiveness = interaction.metadata.effectiveness || 5;
      
      const existingTechnique = profile.wellnessInsights.therapyEffectiveness.techniques.find(
        t => t.name === technique
      );

      if (existingTechnique) {
        existingTechnique.effectiveness = (existingTechnique.effectiveness + effectiveness) / 2;
        existingTechnique.frequency++;
        existingTechnique.lastUsed = new Date();
      } else {
        profile.wellnessInsights.therapyEffectiveness.techniques.push({
          name: technique,
          effectiveness,
          frequency: 1,
          lastUsed: new Date()
        });
      }
    }
  }

  private updateTimingPattern(profile: AIPersonalizationProfile, interaction: UserInteraction): void {
    const hour = interaction.timestamp.getHours();
    const dayOfWeek = interaction.timestamp.getDay();

    const existingPattern = profile.behaviorPatterns.find(
      p => p.patternType === 'timing'
    );

    if (existingPattern) {
      const timingData = existingPattern.pattern.characteristics;
      if (!timingData.activeHours) timingData.activeHours = {};
      if (!timingData.activeDays) timingData.activeDays = {};

      timingData.activeHours[hour] = (timingData.activeHours[hour] || 0) + 1;
      timingData.activeDays[dayOfWeek] = (timingData.activeDays[dayOfWeek] || 0) + 1;

      existingPattern.lastUpdated = new Date();
    } else {
      profile.behaviorPatterns.push({
        id: `timing_${Date.now()}`,
        userId: profile.userId,
        patternType: 'timing',
        pattern: {
          frequency: 1,
          confidence: 0.5,
          characteristics: {
            activeHours: { [hour]: 1 },
            activeDays: { [dayOfWeek]: 1 }
          },
          trend: 'stable'
        },
        firstObserved: new Date(),
        lastUpdated: new Date(),
        significance: 'medium'
      });
    }
  }

  private calculateMoodStability(profile: AIPersonalizationProfile, currentMood: number): number {
    // Simple mood stability calculation based on recent entries
    const recentMoods = profile.behaviorPatterns
      .filter(p => p.patternType === 'therapy_response')
      .slice(-10)
      .map(p => p.pattern.characteristics.moodLevel)
      .filter(mood => mood !== undefined);

    if (recentMoods.length === 0) return 50;

    const variance = this.calculateVariance(recentMoods);
    const stability = Math.max(0, 100 - (variance * 10));
    
    return Math.round(stability);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private applyPrivacySettings(profile: AIPersonalizationProfile): AIPersonalizationProfile {
    const privacyLevel = profile.adaptiveSettings.privacyLevel;
    
    if (privacyLevel === 'minimal') {
      // Remove sensitive data
      return {
        ...profile,
        behaviorPatterns: profile.behaviorPatterns.filter(p => p.significance !== 'high'),
        wellnessInsights: {
          ...profile.wellnessInsights,
          moodPatterns: {
            stability: profile.wellnessInsights.moodPatterns.stability,
            triggers: [],
            improvements: [],
            predictedTrend: profile.wellnessInsights.moodPatterns.predictedTrend
          }
        }
      };
    }
    
    return profile;
  }

  async getPersonalizedInsights(request: PersonalizationRequest): Promise<AIInsight[]> {
    const profile = await this.getUserProfile(request.userId);
    if (!profile) {
      return [];
    }

    // Use AI to generate personalized insights based on user profile
    const aiContext = {
      userProfile: profile,
      recentActivity: request.context.recentActivity,
      subscriptionTier: request.context.subscriptionTier,
      preferences: request.preferences
    };

    try {
      const aiResponse = await this.aiService.generateWellnessInsights({
        userData: {
          name: profile.name || 'User',
          sessionsCompleted: profile.sessionsCompleted || 0,
          mood: 'neutral',
          goals: profile.goals || 'Wellness improvement'
        },
        context: aiContext
      });
      
      // Convert string insights to AIInsight format
      const insights: AIInsight[] = aiResponse.map((insight, index) => ({
        id: `insight-${Date.now()}-${index}`,
        userId: request.userId,
        type: 'recommendation',
        title: insight.split(':')[0] || 'Wellness Insight',
        description: insight,
        severity: 'low',
        confidence: 0.8,
        timestamp: new Date(),
        suggestedActions: [],
        requiresIntervention: false,
        context: {
          page: 'dashboard',
          recentActivity: [],
          relevantMetrics: {}
        }
      }));
      
      return this.filterInsightsByPrivacy(insights, request.preferences.privacyLevel);
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return this.generateFallbackInsights(profile, request);
    }
  }

  private filterInsightsByPrivacy(insights: AIInsight[], privacyLevel: string): AIInsight[] {
    if (privacyLevel === 'minimal') {
      return insights.filter(insight => 
        !insight.description.toLowerCase().includes('mood') &&
        !insight.description.toLowerCase().includes('emotion') &&
        !insight.description.toLowerCase().includes('personal')
      );
    }
    
    return insights;
  }

  private generateFallbackInsights(profile: AIPersonalizationProfile, request: PersonalizationRequest): AIInsight[] {
    // Generate basic insights based on behavior patterns
    const insights: AIInsight[] = [];

    // Navigation pattern insights
    const navigationPatterns = profile.behaviorPatterns.filter(p => p.patternType === 'navigation');
    if (navigationPatterns.length > 0) {
      const mostVisited = navigationPatterns.reduce((prev, current) => 
        prev.pattern.frequency > current.pattern.frequency ? prev : current
      );
      
      insights.push({
        id: `nav_${Date.now()}`,
        type: 'recommendation',
        title: 'Navigation Pattern Detected',
        description: `You frequently visit ${mostVisited.pattern.characteristics.page} pages. Consider bookmarking frequently used sections.`,
        confidence: Math.round(mostVisited.pattern.confidence * 100),
        timestamp: new Date(),
        actionItems: ['Bookmark frequently used pages', 'Customize your dashboard for quick access'],
        metadata: { pattern: 'navigation', page: mostVisited.pattern.characteristics.page }
      });
    }

    // Engagement pattern insights
    const engagementPattern = profile.behaviorPatterns.find(p => p.patternType === 'engagement');
    if (engagementPattern) {
      const engagementLevel = engagementPattern.pattern.characteristics.engagementLevel;
      insights.push({
        id: `engagement_${Date.now()}`,
        type: 'wellness',
        title: 'Engagement Level Analysis',
        description: `Your engagement level is ${engagementLevel}. Keep up the consistent usage!`,
        confidence: 75,
        timestamp: new Date(),
        actionItems: engagementLevel === 'high' ? 
          ['Maintain your current routine', 'Consider sharing your success'] :
          ['Try setting reminders', 'Explore new features'],
        metadata: { pattern: 'engagement', level: engagementLevel }
      });
    }

    return insights.slice(0, request.preferences.maxInsights);
  }

  async updatePrivacySettings(userId: string, privacyLevel: 'minimal' | 'balanced' | 'comprehensive'): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return;

    profile.adaptiveSettings.privacyLevel = privacyLevel;
    profile.lastUpdated = new Date();
    
    await this.saveUserProfile(profile);
  }

  // Public method to get personalization profile
  async getPersonalizationProfile(userId: string): Promise<AIPersonalizationProfile | null> {
    return this.getUserProfile(userId);
  }

  private async getUserProfile(userId: string): Promise<AIPersonalizationProfile | null> {
    // Check cache first
    const cachedProfile = this.userProfiles.get(userId);
    if (cachedProfile) {
      return cachedProfile;
    }

    // Load from database
    try {
      const { data, error } = await this.supabase
        .from('ai_personalization_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      const profile: AIPersonalizationProfile = {
        userId: data.user_id,
        behaviorPatterns: data.behavior_patterns || [],
        preferences: data.preferences || {},
        wellnessInsights: data.wellness_insights || {},
        adaptiveSettings: data.adaptive_settings || {},
        lastUpdated: new Date(data.last_updated)
      };

      // Cache the profile
      this.userProfiles.set(userId, profile);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  private async saveUserProfile(profile: AIPersonalizationProfile): Promise<void> {
    // Update cache
    this.userProfiles.set(profile.userId, profile);

    // Save to database
    try {
      await this.supabase
        .from('ai_personalization_profiles')
        .upsert({
          user_id: profile.userId,
          behavior_patterns: profile.behaviorPatterns,
          preferences: profile.preferences,
          wellness_insights: profile.wellnessInsights,
          adaptive_settings: profile.adaptiveSettings,
          last_updated: profile.lastUpdated
        });
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  async analyzeUserPatterns(userId: string): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return;

    // Analyze recent interactions
    const { data: interactions } = await this.supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (!interactions || interactions.length === 0) return;

    // Update patterns based on recent data
    const updatedProfile = await this.updatePatternsFromData(profile, interactions);
    
    // Generate new insights if patterns have changed significantly
    if (this.hasSignificantChanges(profile, updatedProfile)) {
      await this.generateNewInsights(userId, updatedProfile);
    }

    await this.saveUserProfile(updatedProfile);
  }

  private async updatePatternsFromData(
    profile: AIPersonalizationProfile, 
    interactions: any[]
  ): Promise<AIPersonalizationProfile> {
    const updatedProfile = { ...profile };

    // Analyze interaction frequency
    const dailyInteractions = this.groupByDay(interactions);
    const avgDailyInteractions = dailyInteractions.reduce((sum, day) => sum + day.count, 0) / dailyInteractions.length;

    // Update engagement pattern
    const engagementPattern = updatedProfile.behaviorPatterns.find(p => p.patternType === 'engagement');
    if (engagementPattern) {
      engagementPattern.pattern.characteristics.avgDailyInteractions = avgDailyInteractions;
      engagementPattern.pattern.trend = this.calculateTrend(dailyInteractions.map(d => d.count));
    }

    // Analyze timing patterns
    const hourlyDistribution = this.analyzeHourlyDistribution(interactions);
    const timingPattern = updatedProfile.behaviorPatterns.find(p => p.patternType === 'timing');
    if (timingPattern) {
      timingPattern.pattern.characteristics.hourlyDistribution = hourlyDistribution;
      timingPattern.pattern.characteristics.peakHours = this.findPeakHours(hourlyDistribution);
    }

    return updatedProfile;
  }

  private groupByDay(interactions: any[]): Array<{ date: string; count: number }> {
    const groups: Record<string, number> = {};
    
    interactions.forEach(interaction => {
      const date = new Date(interaction.timestamp).toISOString().split('T')[0];
      groups[date] = (groups[date] || 0) + 1;
    });

    return Object.entries(groups).map(([date, count]) => ({ date, count }));
  }

  private analyzeHourlyDistribution(interactions: any[]): Record<number, number> {
    const distribution: Record<number, number> = {};
    
    interactions.forEach(interaction => {
      const hour = new Date(interaction.timestamp).getHours();
      distribution[hour] = (distribution[hour] || 0) + 1;
    });

    return distribution;
  }

  private findPeakHours(distribution: Record<number, number>): number[] {
    const entries = Object.entries(distribution);
    const avg = entries.reduce((sum, [, count]) => sum + count, 0) / entries.length;
    
    return entries
      .filter(([, count]) => count > avg * 1.5)
      .map(([hour]) => parseInt(hour))
      .sort((a, b) => a - b);
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const recent = values.slice(-5);
    const avgRecent = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const avgEarlier = values.slice(0, -5).reduce((sum, val) => sum + val, 0) / Math.max(1, values.length - 5);
    
    const change = (avgRecent - avgEarlier) / avgEarlier;
    
    if (change > 0.2) return 'increasing';
    if (change < -0.2) return 'decreasing';
    return 'stable';
  }

  private hasSignificantChanges(oldProfile: AIPersonalizationProfile, newProfile: AIPersonalizationProfile): boolean {
    // Check if any major patterns have changed
    const oldEngagement = oldProfile.behaviorPatterns.find(p => p.patternType === 'engagement');
    const newEngagement = newProfile.behaviorPatterns.find(p => p.patternType === 'engagement');
    
    if (oldEngagement && newEngagement) {
      if (oldEngagement.pattern.trend !== newEngagement.pattern.trend) {
        return true;
      }
    }

    // Check if new significant patterns emerged
    const newSignificantPatterns = newProfile.behaviorPatterns.filter(
      p => p.significance === 'high' && !oldProfile.behaviorPatterns.find(op => op.id === p.id)
    );

    return newSignificantPatterns.length > 0;
  }

  private async generateNewInsights(userId: string, profile: AIPersonalizationProfile): Promise<void> {
    // Generate insights based on new patterns
    const insights = await this.getPersonalizedInsights({
      userId,
      context: {
        currentPage: 'dashboard',
        recentActivity: [],
        subscriptionTier: 'premium'
      },
      preferences: {
        maxInsights: 3,
        confidenceThreshold: 0.7,
        includePredictions: true,
        privacyLevel: profile.adaptiveSettings.privacyLevel
      }
    });

    // Store new insights
    for (const insight of insights) {
      await this.supabase
        .from('ai_insights')
        .insert({
          user_id: userId,
          insight_id: insight.id,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          action_items: insight.actionItems,
          metadata: insight.metadata
        });
    }
  }
}

interface AIInsight {
  id: string;
  type: 'wellness' | 'therapy' | 'progress' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
  actionItems?: string[];
  metadata?: Record<string, any>;
}