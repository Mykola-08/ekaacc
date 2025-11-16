import { supabase } from '@/lib/supabase';

export interface UserInteraction {
  id?: string;
  user_id: string;
  interaction_type: 'session_start' | 'session_end' | 'page_view' | 'button_click' | 'form_submission' | 'message_sent' | 'appointment_booked' | 'exercise_completed' | 'mood_logged' | 'crisis_interaction';
  page_path?: string;
  element_id?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  session_id: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  user_agent: string;
}

export interface BehavioralPattern {
  id?: string;
  user_id: string;
  pattern_type: 'engagement_decline' | 'mood_deterioration' | 'session_frequency_drop' | 'crisis_pattern' | 'positive_progress' | 'goal_achievement' | 'adherence_increase';
  confidence_score: number;
  evidence: string[];
  severity: 'low' | 'medium' | 'high';
  first_detected: Date;
  last_updated: Date;
  status: 'active' | 'resolved' | 'archived';
}

export interface PredictiveInsight {
  id?: string;
  user_id: string;
  insight_type: 'potential_crisis' | 'relapse_risk' | 'treatment_resistance' | 'engagement_decline' | 'positive_outcome';
  probability: number;
  contributing_factors: string[];
  recommended_actions: string[];
  timeframe: 'immediate' | 'short_term' | 'long_term';
  created_at: Date;
  expires_at: Date;
}

export class BehavioralTrackingService {
  private static instance: BehavioralTrackingService;
  private sessionId: string;
  private deviceType: 'desktop' | 'mobile' | 'tablet';

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.deviceType = this.detectDeviceType();
  }

  static getInstance(): BehavioralTrackingService {
    if (!this.instance) {
      this.instance = new BehavioralTrackingService();
    }
    return this.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  async trackInteraction(interaction: Omit<UserInteraction, 'id' | 'session_id' | 'device_type' | 'user_agent' | 'timestamp'>): Promise<void> {
    try {
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent : 'server';
      
      const interactionData: UserInteraction = {
        ...interaction,
        session_id: this.sessionId,
        device_type: this.deviceType,
        user_agent: userAgent,
        timestamp: new Date()
      };

      const { error } = await supabase
        .from('user_interactions')
        .insert(interactionData);

      if (error) {
        console.error('Error tracking interaction:', error);
        return;
      }

      // Trigger real-time analysis for critical interactions
      if (interaction.interaction_type === 'crisis_interaction' || 
          interaction.interaction_type === 'mood_logged') {
        this.analyzeBehaviorInRealTime(interaction.user_id);
      }
    } catch (error) {
      console.error('Error in trackInteraction:', error);
    }
  }

  async analyzeBehaviorInRealTime(userId: string): Promise<void> {
    try {
      // Get recent interactions (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const { data: interactions, error } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', sevenDaysAgo.toISOString())
        .order('timestamp', { ascending: false });

      if (error || !interactions) {
        console.error('Error fetching interactions:', error);
        return;
      }

      // Analyze patterns
      const patterns = await this.analyzePatterns(interactions);
      
      // Store detected patterns
      for (const pattern of patterns) {
        await this.storeBehavioralPattern(pattern);
      }

      // Generate predictive insights
      const insights = await this.generatePredictiveInsights(interactions);
      
      for (const insight of insights) {
        await this.storePredictiveInsight(insight);
      }

      // Trigger alerts for high-severity patterns
      const highSeverityPatterns = patterns.filter(p => p.severity === 'high');
      if (highSeverityPatterns.length > 0) {
        this.triggerHighSeverityAlert(userId, highSeverityPatterns);
      }
    } catch (error) {
      console.error('Error in analyzeBehaviorInRealTime:', error);
    }
  }

  private async analyzePatterns(interactions: UserInteraction[]): Promise<BehavioralPattern[]> {
    const patterns: BehavioralPattern[] = [];
    const userId = interactions[0]?.user_id;
    
    if (!userId) return patterns;

    // Analyze engagement decline
    const engagementPattern = this.analyzeEngagementDecline(interactions, userId);
    if (engagementPattern) patterns.push(engagementPattern);

    // Analyze mood patterns
    const moodPattern = this.analyzeMoodPatterns(interactions, userId);
    if (moodPattern) patterns.push(moodPattern);

    // Analyze session frequency
    const sessionPattern = this.analyzeSessionFrequency(interactions, userId);
    if (sessionPattern) patterns.push(sessionPattern);

    // Analyze crisis patterns
    const crisisPattern = this.analyzeCrisisPatterns(interactions, userId);
    if (crisisPattern) patterns.push(crisisPattern);

    // Analyze positive progress
    const positivePattern = this.analyzePositiveProgress(interactions, userId);
    if (positivePattern) patterns.push(positivePattern);

    return patterns;
  }

  private analyzeEngagementDecline(interactions: UserInteraction[], userId: string): BehavioralPattern | null {
    const recentInteractions = interactions.filter(i => 
      new Date(i.timestamp) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    );

    const olderInteractions = interactions.filter(i => 
      new Date(i.timestamp) <= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) &&
      new Date(i.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentInteractions.length < olderInteractions.length * 0.5) {
      return {
        user_id: userId,
        pattern_type: 'engagement_decline',
        confidence_score: 0.8,
        evidence: [
          `Recent interactions: ${recentInteractions.length}`,
          `Previous interactions: ${olderInteractions.length}`,
          `Decline rate: ${((1 - recentInteractions.length / olderInteractions.length) * 100).toFixed(1)}%`
        ],
        severity: 'medium',
        first_detected: new Date(),
        last_updated: new Date(),
        status: 'active'
      };
    }

    return null;
  }

  private analyzeMoodPatterns(interactions: UserInteraction[], userId: string): BehavioralPattern | null {
    const moodLogs = interactions.filter(i => i.interaction_type === 'mood_logged');
    
    if (moodLogs.length < 3) return null;

    // Simple mood analysis based on metadata
    const recentMoods = moodLogs.slice(0, 5).map(log => log.metadata?.mood || 'neutral');
    const negativeMoods = recentMoods.filter(mood => ['sad', 'anxious', 'angry', 'depressed'].includes(mood));

    if (negativeMoods.length >= recentMoods.length * 0.6) {
      return {
        user_id: userId,
        pattern_type: 'mood_deterioration',
        confidence_score: 0.75,
        evidence: [
          `Recent mood entries: ${recentMoods.length}`,
          `Negative moods: ${negativeMoods.length}`,
          `Mood trend: ${recentMoods.join(' → ')}`
        ],
        severity: 'high',
        first_detected: new Date(),
        last_updated: new Date(),
        status: 'active'
      };
    }

    return null;
  }

  private analyzeSessionFrequency(interactions: UserInteraction[], userId: string): BehavioralPattern | null {
    const sessionStarts = interactions.filter(i => i.interaction_type === 'session_start');
    
    if (sessionStarts.length < 2) return null;

    const recentSessions = sessionStarts.filter(s => 
      new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentSessions.length === 0) {
      return {
        user_id: userId,
        pattern_type: 'session_frequency_drop',
        confidence_score: 0.85,
        evidence: [
          'No sessions in the last 7 days',
          `Last session: ${sessionStarts[0]?.timestamp || 'unknown'}`
        ],
        severity: 'high',
        first_detected: new Date(),
        last_updated: new Date(),
        status: 'active'
      };
    }

    return null;
  }

  private analyzeCrisisPatterns(interactions: UserInteraction[], userId: string): BehavioralPattern | null {
    const crisisInteractions = interactions.filter(i => i.interaction_type === 'crisis_interaction');
    
    if (crisisInteractions.length === 0) return null;

    const recentCrisis = crisisInteractions.filter(c => 
      new Date(c.timestamp) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    );

    if (recentCrisis.length > 0) {
      return {
        user_id: userId,
        pattern_type: 'crisis_pattern',
        confidence_score: 0.95,
        evidence: [
          `Crisis interactions in last 3 days: ${recentCrisis.length}`,
          `Total crisis interactions: ${crisisInteractions.length}`
        ],
        severity: 'high',
        first_detected: new Date(),
        last_updated: new Date(),
        status: 'active'
      };
    }

    return null;
  }

  private analyzePositiveProgress(interactions: UserInteraction[], userId: string): BehavioralPattern | null {
    const exerciseCompletions = interactions.filter(i => i.interaction_type === 'exercise_completed');
    const goalAchievements = interactions.filter(i => i.interaction_type === 'goal_achievement');
    
    if (exerciseCompletions.length + goalAchievements.length < 2) return null;

    const recentProgress = [...exerciseCompletions, ...goalAchievements].filter(p => 
      new Date(p.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentProgress.length >= 3) {
      return {
        user_id: userId,
        pattern_type: 'positive_progress',
        confidence_score: 0.8,
        evidence: [
          `Recent exercises completed: ${exerciseCompletions.length}`,
          `Recent goals achieved: ${goalAchievements.length}`,
          `Total progress activities: ${recentProgress.length}`
        ],
        severity: 'low',
        first_detected: new Date(),
        last_updated: new Date(),
        status: 'active'
      };
    }

    return null;
  }

  private async generatePredictiveInsights(interactions: UserInteraction[]): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    const userId = interactions[0]?.user_id;
    
    if (!userId) return insights;

    // Predict relapse risk based on mood and engagement patterns
    const relapseInsight = this.predictRelapseRisk(interactions, userId);
    if (relapseInsight) insights.push(relapseInsight);

    // Predict engagement decline
    const engagementInsight = this.predictEngagementDecline(interactions, userId);
    if (engagementInsight) insights.push(engagementInsight);

    // Predict positive outcomes
    const positiveInsight = this.predictPositiveOutcomes(interactions, userId);
    if (positiveInsight) insights.push(positiveInsight);

    return insights;
  }

  private predictRelapseRisk(interactions: UserInteraction[], userId: string): PredictiveInsight | null {
    const moodLogs = interactions.filter(i => i.interaction_type === 'mood_logged');
    const sessionStarts = interactions.filter(i => i.interaction_type === 'session_start');
    
    if (moodLogs.length < 3) return null;

    const recentMoods = moodLogs.slice(0, 7).map(log => log.metadata?.mood || 'neutral');
    const negativeMoods = recentMoods.filter(mood => ['sad', 'anxious', 'angry', 'depressed'].includes(mood));
    
    const recentSessions = sessionStarts.filter(s => 
      new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    let riskProbability = 0;
    const factors: string[] = [];
    const actions: string[] = [];

    if (negativeMoods.length >= recentMoods.length * 0.7) {
      riskProbability += 0.4;
      factors.push('High frequency of negative mood entries');
      actions.push('Schedule additional check-in session');
      actions.push('Provide mood stabilization resources');
    }

    if (recentSessions.length <= 1) {
      riskProbability += 0.3;
      factors.push('Low session frequency');
      actions.push('Reach out to re-engage patient');
      actions.push('Offer flexible scheduling options');
    }

    if (riskProbability > 0.5) {
      return {
        user_id: userId,
        insight_type: 'relapse_risk',
        probability: Math.min(riskProbability, 0.9),
        contributing_factors: factors,
        recommended_actions: actions,
        timeframe: 'short_term',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    }

    return null;
  }

  private predictEngagementDecline(interactions: UserInteraction[], userId: string): PredictiveInsight | null {
    const recentInteractions = interactions.filter(i => 
      new Date(i.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const olderInteractions = interactions.filter(i => 
      new Date(i.timestamp) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
      new Date(i.timestamp) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    );

    if (recentInteractions.length < olderInteractions.length * 0.4) {
      return {
        user_id: userId,
        insight_type: 'engagement_decline',
        probability: 0.8,
        contributing_factors: [
          'Significant drop in platform usage',
          'Reduced interaction frequency'
        ],
        recommended_actions: [
          'Send personalized re-engagement message',
          'Offer new therapeutic activities',
          'Schedule follow-up consultation'
        ],
        timeframe: 'immediate',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      };
    }

    return null;
  }

  private predictPositiveOutcomes(interactions: UserInteraction[], userId: string): PredictiveInsight | null {
    const exerciseCompletions = interactions.filter(i => i.interaction_type === 'exercise_completed');
    const goalAchievements = interactions.filter(i => i.interaction_type === 'goal_achievement');
    const moodLogs = interactions.filter(i => i.interaction_type === 'mood_logged');
    
    if (exerciseCompletions.length + goalAchievements.length < 3) return null;

    const recentMoods = moodLogs.slice(0, 5).map(log => log.metadata?.mood || 'neutral');
    const positiveMoods = recentMoods.filter(mood => ['happy', 'content', 'excited', 'grateful'].includes(mood));

    if (positiveMoods.length >= recentMoods.length * 0.6 && (exerciseCompletions.length + goalAchievements.length) >= 5) {
      return {
        user_id: userId,
        insight_type: 'positive_outcome',
        probability: 0.85,
        contributing_factors: [
          'Consistent exercise completion',
          'Regular goal achievement',
          'Positive mood trends'
        ],
        recommended_actions: [
          'Continue current treatment plan',
          'Introduce advanced therapeutic techniques',
          'Celebrate progress with patient'
        ],
        timeframe: 'long_term',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
    }

    return null;
  }

  private async storeBehavioralPattern(pattern: BehavioralPattern): Promise<void> {
    try {
      // Check if similar pattern already exists
      const { data: existingPatterns } = await supabase
        .from('behavioral_patterns')
        .select('*')
        .eq('user_id', pattern.user_id)
        .eq('pattern_type', pattern.pattern_type)
        .eq('status', 'active');

      if (existingPatterns && existingPatterns.length > 0) {
        // Update existing pattern
        await supabase
          .from('behavioral_patterns')
          .update({
            confidence_score: pattern.confidence_score,
            evidence: pattern.evidence,
            last_updated: new Date()
          })
          .eq('id', existingPatterns[0].id);
      } else {
        // Create new pattern
        await supabase
          .from('behavioral_patterns')
          .insert(pattern);
      }
    } catch (error) {
      console.error('Error storing behavioral pattern:', error);
    }
  }

  private async storePredictiveInsight(insight: PredictiveInsight): Promise<void> {
    try {
      await supabase
        .from('predictive_insights')
        .insert(insight);
    } catch (error) {
      console.error('Error storing predictive insight:', error);
    }
  }

  private triggerHighSeverityAlert(userId: string, patterns: BehavioralPattern[]): void {
    // This would typically integrate with a notification system
    console.warn(`High severity behavioral patterns detected for user ${userId}:`, patterns);
    
    // Could emit events, send notifications, etc.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('behavioral-alert', {
        detail: { userId, patterns, severity: 'high' }
      }));
    }
  }

  async getUserBehavioralInsights(userId: string): Promise<{
    patterns: BehavioralPattern[];
    insights: PredictiveInsight[];
    recentInteractions: UserInteraction[];
  }> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [patternsResult, insightsResult, interactionsResult] = await Promise.all([
        supabase
          .from('behavioral_patterns')
          .select('*')
          .eq('user_id', userId)
          .gte('first_detected', thirtyDaysAgo.toISOString())
          .order('first_detected', { ascending: false }),
        
        supabase
          .from('predictive_insights')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false }),
        
        supabase
          .from('user_interactions')
          .select('*')
          .eq('user_id', userId)
          .gte('timestamp', thirtyDaysAgo.toISOString())
          .order('timestamp', { ascending: false })
          .limit(50)
      ]);

      return {
        patterns: patternsResult.data || [],
        insights: insightsResult.data || [],
        recentInteractions: interactionsResult.data || []
      };
    } catch (error) {
      console.error('Error getting behavioral insights:', error);
      return { patterns: [], insights: [], recentInteractions: [] };
    }
  }

  async markPatternAsResolved(patternId: string): Promise<void> {
    try {
      await supabase
        .from('behavioral_patterns')
        .update({ status: 'resolved', last_updated: new Date() })
        .eq('id', patternId);
    } catch (error) {
      console.error('Error marking pattern as resolved:', error);
    }
  }

  async dismissInsight(insightId: string): Promise<void> {
    try {
      await supabase
        .from('predictive_insights')
        .update({ expires_at: new Date() }) // Expire immediately
        .eq('id', insightId);
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  }
}