// Behavioral Tracking Service - User Interaction Analytics
import { supabaseAdmin } from '@/lib/platform/supabase';

export interface UserInteraction {
  user_id: string;
  interaction_type: string;
  pattern_type?: string;
  page_path?: string;
  element_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface BehavioralPattern {
  type: string;
  pattern_type?: string;
  frequency: number;
  lastOccurrence: string;
}

export interface BehavioralInsight {
  category: string;
  description: string;
  score: number;
}

export class BehavioralTrackingService {
  private static instance: BehavioralTrackingService;

  static getInstance(): BehavioralTrackingService {
    if (!BehavioralTrackingService.instance) {
      BehavioralTrackingService.instance = new BehavioralTrackingService();
    }
    return BehavioralTrackingService.instance;
  }

  async trackInteraction(interaction: UserInteraction): Promise<void> {
    try {
      await supabaseAdmin.from('user_interactions').insert({
        user_id: interaction.user_id,
        interaction_type: interaction.interaction_type,
        metadata: interaction.metadata || {},
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  }

  async getUserBehavioralInsights(userId: string): Promise<{
    patterns: BehavioralPattern[];
    insights: BehavioralInsight[];
    recentInteractions: UserInteraction[];
  }> {
    try {
      // Get recent interactions
      const { data: interactions } = await supabaseAdmin
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      const recentInteractions = (interactions || []) as UserInteraction[];

      // Analyze patterns from interactions
      const patternMap = new Map<string, { count: number; lastSeen: string }>();
      for (const interaction of recentInteractions) {
        const existing = patternMap.get(interaction.interaction_type);
        if (!existing) {
          patternMap.set(interaction.interaction_type, {
            count: 1,
            lastSeen: interaction.created_at || '',
          });
        } else {
          existing.count++;
        }
      }

      const patterns: BehavioralPattern[] = Array.from(patternMap.entries()).map(
        ([type, data]) => ({
          type,
          frequency: data.count,
          lastOccurrence: data.lastSeen,
        })
      );

      // Generate basic insights
      const insights: BehavioralInsight[] = [];
      if (recentInteractions.length > 50) {
        insights.push({
          category: 'engagement',
          description: 'High activity user',
          score: 0.8,
        });
      }

      return { patterns, insights, recentInteractions: recentInteractions.slice(0, 10) };
    } catch (error) {
      console.error('Failed to get behavioral insights:', error);
      return { patterns: [], insights: [], recentInteractions: [] };
    }
  }
}
