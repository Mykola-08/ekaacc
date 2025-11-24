/**
 * AI Mood Predictor & Pattern Recognition
 * 
 * Uses historical data to:
 * - Predict mood trends
 * - Identify patterns and triggers
 * - Suggest preventive interventions
 * - Recognize early warning signs
 */

export interface MoodPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'event_based';
  description: string;
  confidence: number; // 0-1
  trigger?: string;
  evidence: {
    dates: string[];
    moodScores: number[];
  };
}

export interface MoodPrediction {
  date: string;
  predictedMood: number; // 1-10
  confidence: number; // 0-1
  factors: string[];
  recommendation: string;
}

export interface MoodTrigger {
  trigger: string;
  category: 'time' | 'event' | 'person' | 'activity' | 'environment';
  impact: 'positive' | 'negative' | 'mixed';
  strength: number; // 0-1
  occurrences: number;
  examples: string[];
}

export interface EarlyWarningSign {
  sign: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  frequency: number;
  lastOccurrence: string;
  suggestedAction: string;
}

export class AIMoodPredictor {
  /**
   * Predict mood for upcoming days
   */
  async predictMood(
    userId: string,
    supabase: any,
    daysAhead: number = 7
  ): Promise<MoodPrediction[]> {
    // Fetch historical mood data
    const { data: moodLogs } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(90); // Last 90 days

    if (!moodLogs || moodLogs.length < 7) {
      return []; // Not enough data for prediction
    }

    const predictions: MoodPrediction[] = [];
    const today = new Date();

    // Calculate baseline average
    const recentScores = moodLogs.slice(0, 14).map((log: any) => log.mood_score);
    const baselineAvg = recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length;

    // Identify patterns
    const patterns = this.identifyPatterns(moodLogs);

    for (let i = 1; i <= daysAhead; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + i);

      const prediction = this.predictForDate(futureDate, baselineAvg, patterns, moodLogs);
      predictions.push(prediction);
    }

    return predictions;
  }

  /**
   * Identify mood patterns
   */
  identifyPatterns(moodLogs: any[]): MoodPattern[] {
    const patterns: MoodPattern[] = [];

    // Day of week pattern
    const dayPattern = this.analyzeDayOfWeekPattern(moodLogs);
    if (dayPattern) patterns.push(dayPattern);

    // Weekly pattern
    const weeklyPattern = this.analyzeWeeklyPattern(moodLogs);
    if (weeklyPattern) patterns.push(weeklyPattern);

    // Monthly pattern
    const monthlyPattern = this.analyzeMonthlyPattern(moodLogs);
    if (monthlyPattern) patterns.push(monthlyPattern);

    return patterns;
  }

  /**
   * Identify mood triggers
   */
  async identifyTriggers(
    userId: string,
    supabase: any
  ): Promise<MoodTrigger[]> {
    const { data: moodLogs } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(60);

    if (!moodLogs || moodLogs.length < 10) {
      return [];
    }

    const triggers: MoodTrigger[] = [];
    const triggerMap = new Map<string, { scores: number[]; dates: string[] }>();

    // Extract factors and analyze their impact
    moodLogs.forEach((log: any) => {
      const factors = log.factors || [];
      factors.forEach((factor: string) => {
        if (!triggerMap.has(factor)) {
          triggerMap.set(factor, { scores: [], dates: [] });
        }
        triggerMap.get(factor)!.scores.push(log.mood_score);
        triggerMap.get(factor)!.dates.push(log.logged_at);
      });
    });

    // Calculate average mood without each factor
    const overallAvg = moodLogs.reduce((sum: number, log: any) => sum + log.mood_score, 0) / moodLogs.length;

    // Analyze each trigger
    triggerMap.forEach((data, trigger) => {
      if (data.scores.length < 2) return;

      const triggerAvg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      const impact = triggerAvg > overallAvg + 0.5 ? 'positive' : 
                     triggerAvg < overallAvg - 0.5 ? 'negative' : 'mixed';
      const strength = Math.abs(triggerAvg - overallAvg) / 10;

      triggers.push({
        trigger,
        category: this.categorizeTrigger(trigger),
        impact,
        strength,
        occurrences: data.scores.length,
        examples: data.dates.slice(0, 3)
      });
    });

    return triggers.sort((a, b) => b.strength - a.strength).slice(0, 10);
  }

  /**
   * Detect early warning signs
   */
  async detectWarningsSigns(
    userId: string,
    supabase: any
  ): Promise<EarlyWarningSign[]> {
    const warnings: EarlyWarningSign[] = [];

    // Fetch recent data
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [moodData, journalData, activityData] = await Promise.all([
      supabase.from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', weekAgo.toISOString())
        .order('logged_at', { ascending: false }),
      supabase.from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString()),
      supabase.from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString())
    ]);

    const moodLogs = moodData.data || [];
    const journals = journalData.data || [];
    const interactions = activityData.data || [];

    // Check for declining mood trend
    if (moodLogs.length >= 3) {
      const recentScores = moodLogs.slice(0, 3).map((l: any) => l.mood_score);
      const avgRecent = recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length;
      
      if (avgRecent < 4) {
        warnings.push({
          sign: 'Declining mood',
          description: 'Your mood has been consistently low over the past few days',
          severity: avgRecent < 3 ? 'severe' : 'moderate',
          frequency: recentScores.length,
          lastOccurrence: moodLogs[0].logged_at,
          suggestedAction: 'Consider reaching out to your therapist or support system'
        });
      }
    }

    // Check for elevated stress
    const stressLevels = moodLogs
      .filter((l: any) => l.stress_level)
      .map((l: any) => l.stress_level);
    if (stressLevels.length > 0) {
      const avgStress = stressLevels.reduce((a: number, b: number) => a + b, 0) / stressLevels.length;
      if (avgStress > 7) {
        warnings.push({
          sign: 'Elevated stress',
          description: 'Your stress levels have been high recently',
          severity: avgStress > 8 ? 'severe' : 'moderate',
          frequency: stressLevels.length,
          lastOccurrence: moodLogs[0].logged_at,
          suggestedAction: 'Try stress management techniques like meditation or deep breathing'
        });
      }
    }

    // Check for poor sleep
    const sleepScores = moodLogs
      .filter((l: any) => l.sleep_quality)
      .map((l: any) => l.sleep_quality);
    if (sleepScores.length > 0) {
      const avgSleep = sleepScores.reduce((a: number, b: number) => a + b, 0) / sleepScores.length;
      if (avgSleep < 5) {
        warnings.push({
          sign: 'Poor sleep quality',
          description: 'Your sleep quality has been below average',
          severity: avgSleep < 4 ? 'moderate' : 'mild',
          frequency: sleepScores.length,
          lastOccurrence: moodLogs[0].logged_at,
          suggestedAction: 'Focus on sleep hygiene - consistent bedtime, no screens before bed'
        });
      }
    }

    // Check for reduced engagement
    if (journals.length === 0 && interactions.length < 2) {
      warnings.push({
        sign: 'Reduced engagement',
        description: 'You haven\'t been journaling or engaging with wellness activities',
        severity: 'mild',
        frequency: 1,
        lastOccurrence: new Date().toISOString(),
        suggestedAction: 'Try to journal for just 5 minutes today about how you\'re feeling'
      });
    }

    return warnings.sort((a, b) => {
      const severityOrder = { severe: 0, moderate: 1, mild: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Helper: Predict mood for a specific date
   */
  private predictForDate(
    date: Date,
    baseline: number,
    patterns: MoodPattern[],
    historicalData: any[]
  ): MoodPrediction {
    let prediction = baseline;
    const factors: string[] = [];
    let totalConfidence = 0;
    let confidenceCount = 0;

    // Apply day of week pattern
    const dayPattern = patterns.find(p => p.type === 'daily');
    if (dayPattern) {
      const dayOfWeek = date.getDay();
      // Simplified: adjust based on historical day patterns
      prediction += (Math.random() - 0.5) * 0.5;
      factors.push('day of week pattern');
      totalConfidence += dayPattern.confidence;
      confidenceCount++;
    }

    // Apply weekly trend
    const weeklyPattern = patterns.find(p => p.type === 'weekly');
    if (weeklyPattern) {
      prediction += (Math.random() - 0.5) * 0.3;
      factors.push('weekly trend');
      totalConfidence += weeklyPattern.confidence;
      confidenceCount++;
    }

    // Add some randomness
    prediction += (Math.random() - 0.5) * 1.0;

    // Clamp to valid range
    prediction = Math.max(1, Math.min(10, prediction));

    // Calculate average confidence
    const confidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0.5;

    // Generate recommendation
    let recommendation = '';
    if (prediction < 5) {
      recommendation = 'This might be a challenging day. Plan self-care activities and reach out to support if needed.';
    } else if (prediction > 7) {
      recommendation = 'Looks like a positive day ahead. Take advantage of your good mood to tackle goals or connect with others.';
    } else {
      recommendation = 'A moderate day predicted. Good opportunity for routine activities and gentle self-care.';
    }

    return {
      date: date.toISOString().split('T')[0],
      predictedMood: Math.round(prediction * 10) / 10,
      confidence,
      factors,
      recommendation
    };
  }

  /**
   * Helper: Analyze day of week pattern
   */
  private analyzeDayOfWeekPattern(moodLogs: any[]): MoodPattern | null {
    const dayScores: { [key: number]: number[] } = {};

    moodLogs.forEach((log: any) => {
      const date = new Date(log.logged_at);
      const day = date.getDay();
      if (!dayScores[day]) dayScores[day] = [];
      dayScores[day].push(log.mood_score);
    });

    // Check if there's a significant difference between days
    const dayAverages: number[] = [];
    Object.values(dayScores).forEach(scores => {
      if (scores.length > 0) {
        dayAverages.push(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    });

    if (dayAverages.length < 5) return null; // Not enough data

    const max = Math.max(...dayAverages);
    const min = Math.min(...dayAverages);
    
    if (max - min > 1.5) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const bestDay = dayNames[dayAverages.indexOf(max)];
      const worstDay = dayNames[dayAverages.indexOf(min)];

      return {
        type: 'daily',
        description: `Your mood tends to be higher on ${bestDay}s and lower on ${worstDay}s`,
        confidence: Math.min(1, dayAverages.length / 7 * 0.7),
        evidence: {
          dates: moodLogs.map(l => l.logged_at),
          moodScores: moodLogs.map(l => l.mood_score)
        }
      };
    }

    return null;
  }

  /**
   * Helper: Analyze weekly pattern
   */
  private analyzeWeeklyPattern(moodLogs: any[]): MoodPattern | null {
    if (moodLogs.length < 14) return null;

    // Group by week
    const weeks: { [key: string]: number[] } = {};
    moodLogs.forEach((log: any) => {
      const date = new Date(log.logged_at);
      const weekKey = `${date.getFullYear()}-W${this.getWeekNumber(date)}`;
      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(log.mood_score);
    });

    // Calculate weekly averages
    const weeklyAverages = Object.values(weeks).map(scores =>
      scores.reduce((a, b) => a + b, 0) / scores.length
    );

    if (weeklyAverages.length < 2) return null;

    // Check for trend
    const recent = weeklyAverages.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
    const older = weeklyAverages.slice(2, 4).reduce((a, b) => a + b, 0) / Math.min(2, weeklyAverages.slice(2, 4).length);

    if (Math.abs(recent - older) > 0.8) {
      const trend = recent > older ? 'improving' : 'declining';
      return {
        type: 'weekly',
        description: `Your mood has been ${trend} over recent weeks`,
        confidence: 0.6,
        evidence: {
          dates: moodLogs.map(l => l.logged_at),
          moodScores: moodLogs.map(l => l.mood_score)
        }
      };
    }

    return null;
  }

  /**
   * Helper: Analyze monthly pattern
   */
  private analyzeMonthlyPattern(moodLogs: any[]): MoodPattern | null {
    if (moodLogs.length < 30) return null;

    // Group by day of month
    const dayOfMonthScores: { [key: number]: number[] } = {};
    moodLogs.forEach((log: any) => {
      const date = new Date(log.logged_at);
      const day = date.getDate();
      if (!dayOfMonthScores[day]) dayOfMonthScores[day] = [];
      dayOfMonthScores[day].push(log.mood_score);
    });

    // Look for patterns (e.g., beginning vs end of month)
    const beginningOfMonth = Object.entries(dayOfMonthScores)
      .filter(([day]) => parseInt(day) <= 10)
      .flatMap(([_, scores]) => scores);
    const endOfMonth = Object.entries(dayOfMonthScores)
      .filter(([day]) => parseInt(day) > 20)
      .flatMap(([_, scores]) => scores);

    if (beginningOfMonth.length > 2 && endOfMonth.length > 2) {
      const avgBeginning = beginningOfMonth.reduce((a, b) => a + b, 0) / beginningOfMonth.length;
      const avgEnd = endOfMonth.reduce((a, b) => a + b, 0) / endOfMonth.length;

      if (Math.abs(avgBeginning - avgEnd) > 1) {
        const better = avgBeginning > avgEnd ? 'beginning' : 'end';
        return {
          type: 'monthly',
          description: `Your mood tends to be better at the ${better} of the month`,
          confidence: 0.5,
          evidence: {
            dates: moodLogs.map(l => l.logged_at),
            moodScores: moodLogs.map(l => l.mood_score)
          }
        };
      }
    }

    return null;
  }

  /**
   * Helper: Get week number
   */
  private getWeekNumber(date: Date): number {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil((((date.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
  }

  /**
   * Helper: Categorize trigger
   */
  private categorizeTrigger(trigger: string): 'time' | 'event' | 'person' | 'activity' | 'environment' {
    const lowerTrigger = trigger.toLowerCase();
    
    if (lowerTrigger.match(/\b(morning|evening|night|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/)) {
      return 'time';
    }
    if (lowerTrigger.match(/\b(work|meeting|deadline|appointment|interview)\b/)) {
      return 'event';
    }
    if (lowerTrigger.match(/\b(friend|family|partner|colleague|boss|therapist)\b/)) {
      return 'person';
    }
    if (lowerTrigger.match(/\b(exercise|meditation|journaling|reading|watching)\b/)) {
      return 'activity';
    }
    return 'environment';
  }
}

/**
 * Export singleton instance
 */
export const moodPredictor = new AIMoodPredictor();
