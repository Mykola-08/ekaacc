/**
 * AI Journal Analyzer
 * 
 * Analyzes journal entries to extract:
 * - Sentiment and emotional tone
 * - Recurring themes and patterns
 * - Cognitive distortions
 * - Progress indicators
 * - Actionable insights
 */

export interface JournalSentiment {
  overall: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  emotions: {
    emotion: string;
    intensity: number; // 0 to 1
  }[];
}

export interface JournalTheme {
  theme: string;
  frequency: number;
  sentiment: number; // -1 to 1
  keywords: string[];
  examples: string[];
}

export interface CognitiveDistortion {
  type: 'all_or_nothing' | 'overgeneralization' | 'mental_filter' | 'disqualifying_positive' | 'jumping_to_conclusions' | 'magnification' | 'emotional_reasoning' | 'should_statements' | 'labeling' | 'personalization';
  description: string;
  example: string;
  suggestion: string;
}

export interface JournalInsight {
  id: string;
  type: 'pattern' | 'progress' | 'concern' | 'strength' | 'suggestion';
  title: string;
  description: string;
  evidence: string[];
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface JournalAnalysis {
  entryId: string;
  sentiment: JournalSentiment;
  themes: JournalTheme[];
  cognitiveDistortions: CognitiveDistortion[];
  insights: JournalInsight[];
  progressIndicators: {
    selfAwareness: number; // 0-100
    emotionalRegulation: number; // 0-100
    problemSolving: number; // 0-100
    positiveThinking: number; // 0-100
  };
  suggestedActions: string[];
  analyzedAt: Date;
}

export class AIJournalAnalyzer {
  /**
   * Analyze a single journal entry
   */
  async analyzeEntry(
    entryId: string,
    content: string,
    mood?: string,
    moodScore?: number
  ): Promise<JournalAnalysis> {
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(content);

    // Extract themes
    const themes = this.extractThemes(content);

    // Detect cognitive distortions
    const cognitiveDistortions = this.detectCognitiveDistortions(content);

    // Generate insights
    const insights = this.generateInsights(content, sentiment, themes, cognitiveDistortions);

    // Calculate progress indicators
    const progressIndicators = this.calculateProgressIndicators(content, sentiment);

    // Generate suggested actions
    const suggestedActions = this.generateSuggestedActions(insights, cognitiveDistortions);

    return {
      entryId,
      sentiment,
      themes,
      cognitiveDistortions,
      insights,
      progressIndicators,
      suggestedActions,
      analyzedAt: new Date()
    };
  }

  /**
   * Analyze sentiment of text
   */
  private analyzeSentiment(text: string): JournalSentiment {
    const lowerText = text.toLowerCase();

    // Emotion keywords
    const emotionKeywords = {
      joy: ['happy', 'joyful', 'excited', 'delighted', 'cheerful', 'glad', 'pleased', 'content'],
      sadness: ['sad', 'unhappy', 'depressed', 'down', 'miserable', 'heartbroken', 'disappointed'],
      anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 'fearful', 'scared'],
      anger: ['angry', 'frustrated', 'annoyed', 'irritated', 'furious', 'mad', 'upset'],
      calm: ['calm', 'peaceful', 'relaxed', 'tranquil', 'serene', 'composed'],
      hope: ['hopeful', 'optimistic', 'encouraged', 'inspired', 'motivated'],
      gratitude: ['grateful', 'thankful', 'appreciative', 'blessed'],
      loneliness: ['lonely', 'isolated', 'alone', 'disconnected']
    };

    // Positive and negative indicators
    const positiveWords = ['better', 'good', 'great', 'amazing', 'wonderful', 'love', 'beautiful', 'success', 'progress', 'improvement'];
    const negativeWords = ['worse', 'bad', 'terrible', 'awful', 'hate', 'fail', 'failure', 'struggle', 'difficult', 'hard'];

    // Count emotion occurrences
    const emotions: { emotion: string; intensity: number }[] = [];
    let totalScore = 0;
    let wordCount = 0;

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      let count = 0;
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) count += matches.length;
      });

      if (count > 0) {
        emotions.push({
          emotion,
          intensity: Math.min(1, count / 5) // Normalize to 0-1
        });
        wordCount += count;
      }
    });

    // Calculate positive/negative balance
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) negativeCount += matches.length;
    });

    // Calculate overall sentiment score
    const sentimentBalance = positiveCount - negativeCount;
    const score = Math.max(-1, Math.min(1, sentimentBalance / 10));

    // Determine overall sentiment category
    let overall: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
    if (score > 0.5) overall = 'very_positive';
    else if (score > 0.1) overall = 'positive';
    else if (score > -0.1) overall = 'neutral';
    else if (score > -0.5) overall = 'negative';
    else overall = 'very_negative';

    return {
      overall,
      score,
      confidence: Math.min(1, wordCount / 10), // More words = higher confidence
      emotions: emotions.sort((a, b) => b.intensity - a.intensity).slice(0, 5)
    };
  }

  /**
   * Extract recurring themes from text
   */
  private extractThemes(text: string): JournalTheme[] {
    const lowerText = text.toLowerCase();
    
    const themeKeywords = {
      'work_stress': ['work', 'job', 'career', 'boss', 'colleague', 'deadline', 'project', 'meeting'],
      'relationships': ['relationship', 'partner', 'friend', 'family', 'spouse', 'boyfriend', 'girlfriend', 'parent'],
      'self_worth': ['self-esteem', 'confidence', 'worth', 'value', 'deserve', 'good enough', 'failure'],
      'health': ['health', 'exercise', 'sleep', 'diet', 'energy', 'tired', 'sick'],
      'anxiety': ['anxiety', 'worry', 'fear', 'panic', 'nervous', 'stressed'],
      'depression': ['depression', 'sad', 'hopeless', 'empty', 'numb'],
      'growth': ['growth', 'learn', 'progress', 'improve', 'develop', 'change'],
      'goals': ['goal', 'plan', 'achieve', 'accomplish', 'succeed'],
      'gratitude': ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate'],
      'challenges': ['challenge', 'difficult', 'hard', 'struggle', 'problem', 'issue']
    };

    const themes: JournalTheme[] = [];

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const matchedKeywords: string[] = [];
      let frequency = 0;

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          frequency += matches.length;
          if (!matchedKeywords.includes(keyword)) {
            matchedKeywords.push(keyword);
          }
        }
      });

      if (frequency > 0) {
        // Calculate sentiment for this theme
        const themeContext = this.extractThemeContext(text, matchedKeywords);
        const themeSentiment = this.analyzeSentiment(themeContext);

        themes.push({
          theme: theme.replace(/_/g, ' '),
          frequency,
          sentiment: themeSentiment.score,
          keywords: matchedKeywords.slice(0, 5),
          examples: this.extractThemeExamples(text, matchedKeywords)
        });
      }
    });

    return themes.sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  }

  /**
   * Detect cognitive distortions in text
   */
  private detectCognitiveDistortions(text: string): CognitiveDistortion[] {
    const distortions: CognitiveDistortion[] = [];
    const lowerText = text.toLowerCase();

    // All-or-nothing thinking
    if (lowerText.match(/\b(always|never|every time|completely|totally|absolutely|everyone|no one)\b/i)) {
      const match = text.match(/.{0,50}(always|never|every time|completely|totally|absolutely|everyone|no one).{0,50}/i);
      distortions.push({
        type: 'all_or_nothing',
        description: 'All-or-nothing thinking: Viewing situations in extreme, black-and-white terms.',
        example: match ? match[0] : '',
        suggestion: 'Try to notice the shades of gray. Are there exceptions? Is it possible that something could be partially true?'
      });
    }

    // Overgeneralization
    if (lowerText.match(/\b(everything|nothing|all|none)\b.{0,30}\b(is|are|was|were)\b/i)) {
      const match = text.match(/.{0,50}(everything|nothing|all|none).{0,50}(is|are|was|were).{0,50}/i);
      distortions.push({
        type: 'overgeneralization',
        description: 'Overgeneralization: Drawing broad conclusions from a single event.',
        example: match ? match[0] : '',
        suggestion: 'Consider specific instances. What evidence contradicts this generalization?'
      });
    }

    // Mental filter
    if (lowerText.match(/\b(only|just|merely)\b.{0,30}\b(negative|bad|wrong|problem)\b/i)) {
      const match = text.match(/.{0,50}(only|just|merely).{0,50}(negative|bad|wrong|problem).{0,50}/i);
      distortions.push({
        type: 'mental_filter',
        description: 'Mental filter: Focusing exclusively on negative details while filtering out positive aspects.',
        example: match ? match[0] : '',
        suggestion: 'Try to identify at least one positive aspect of the situation, no matter how small.'
      });
    }

    // Should statements
    if (lowerText.match(/\b(should|must|have to|need to|ought to)\b/i)) {
      const match = text.match(/.{0,50}(should|must|have to|need to|ought to).{0,50}/i);
      distortions.push({
        type: 'should_statements',
        description: 'Should statements: Using "should" and "must" creates unrealistic expectations and pressure.',
        example: match ? match[0] : '',
        suggestion: 'Replace "should" with "could" or "would like to." What would be more flexible and realistic?'
      });
    }

    // Emotional reasoning
    if (lowerText.match(/\bI feel.{0,20}(so|therefore|that means|which means)\b/i)) {
      const match = text.match(/.{0,50}I feel.{0,50}(so|therefore|that means|which means).{0,50}/i);
      distortions.push({
        type: 'emotional_reasoning',
        description: 'Emotional reasoning: Assuming that feelings reflect objective reality.',
        example: match ? match[0] : '',
        suggestion: 'Feelings are valid, but they aren\'t always facts. What objective evidence supports or contradicts this feeling?'
      });
    }

    // Labeling
    if (lowerText.match(/\bI('m| am).{0,20}(a |an )?(failure|loser|idiot|stupid|worthless|useless)\b/i)) {
      const match = text.match(/.{0,50}I('m| am).{0,50}(a |an )?(failure|loser|idiot|stupid|worthless|useless).{0,50}/i);
      distortions.push({
        type: 'labeling',
        description: 'Labeling: Attaching a negative label to yourself or others.',
        example: match ? match[0] : '',
        suggestion: 'Replace the label with a description of specific behaviors. You are not your actions or mistakes.'
      });
    }

    return distortions;
  }

  /**
   * Generate insights from analysis
   */
  private generateInsights(
    text: string,
    sentiment: JournalSentiment,
    themes: JournalTheme[],
    distortions: CognitiveDistortion[]
  ): JournalInsight[] {
    const insights: JournalInsight[] = [];

    // Sentiment-based insights
    if (sentiment.overall === 'very_negative' || sentiment.overall === 'negative') {
      insights.push({
        id: 'low_mood_detected',
        type: 'concern',
        title: 'Low mood detected',
        description: 'This entry reflects a challenging emotional state. Remember that difficult feelings are temporary.',
        evidence: [`Overall sentiment: ${sentiment.overall}`, `Sentiment score: ${sentiment.score.toFixed(2)}`],
        actionable: true,
        priority: 'high'
      });
    }

    // Theme-based insights
    const negativeThemes = themes.filter(t => t.sentiment < -0.3);
    if (negativeThemes.length > 0) {
      insights.push({
        id: 'recurring_challenges',
        type: 'pattern',
        title: 'Recurring challenges identified',
        description: `You mentioned ${negativeThemes.map(t => t.theme).join(', ')} in a negative context.`,
        evidence: negativeThemes.map(t => `${t.theme}: mentioned ${t.frequency} times`),
        actionable: true,
        priority: 'medium'
      });
    }

    // Positive emotions
    const positiveEmotions = sentiment.emotions.filter(e => 
      ['joy', 'calm', 'hope', 'gratitude'].includes(e.emotion) && e.intensity > 0.3
    );
    if (positiveEmotions.length > 0) {
      insights.push({
        id: 'positive_emotions',
        type: 'strength',
        title: 'Positive emotional experiences',
        description: `You expressed ${positiveEmotions.map(e => e.emotion).join(', ')}. These are strengths to build on.`,
        evidence: positiveEmotions.map(e => `${e.emotion}: intensity ${(e.intensity * 100).toFixed(0)}%`),
        actionable: false,
        priority: 'low'
      });
    }

    // Cognitive distortions
    if (distortions.length > 0) {
      insights.push({
        id: 'cognitive_patterns',
        type: 'pattern',
        title: 'Thinking patterns to explore',
        description: `Detected ${distortions.length} potential cognitive distortion(s) that might be affecting your perspective.`,
        evidence: distortions.map(d => d.type.replace(/_/g, ' ')),
        actionable: true,
        priority: 'medium'
      });
    }

    // Self-awareness indicators
    if (text.match(/\b(I (realize|recognize|notice|understand|see)|I'm (aware|conscious))\b/i)) {
      insights.push({
        id: 'self_awareness',
        type: 'progress',
        title: 'Strong self-awareness',
        description: 'You\'re demonstrating good self-reflection and awareness of your thoughts and feelings.',
        evidence: ['Evidence of metacognition and self-reflection'],
        actionable: false,
        priority: 'low'
      });
    }

    return insights;
  }

  /**
   * Calculate progress indicators
   */
  private calculateProgressIndicators(text: string, sentiment: JournalSentiment): {
    selfAwareness: number;
    emotionalRegulation: number;
    problemSolving: number;
    positiveThinking: number;
  } {
    let selfAwareness = 50;
    let emotionalRegulation = 50;
    let problemSolving = 50;
    let positiveThinking = 50;

    const lowerText = text.toLowerCase();

    // Self-awareness
    if (lowerText.match(/\b(I (feel|think|realize|notice|recognize|understand)|I'm (aware|learning))\b/i)) {
      selfAwareness += 20;
    }
    if (text.split(/[.!?]/).length > 5) selfAwareness += 10; // Detailed reflection

    // Emotional regulation
    if (lowerText.match(/\b(calm down|take a breath|manage|cope|handle|regulate)\b/i)) {
      emotionalRegulation += 20;
    }
    if (lowerText.match(/\b(but|however|although|despite)\b/i)) {
      emotionalRegulation += 10; // Considering alternative perspectives
    }

    // Problem-solving
    if (lowerText.match(/\b(solution|plan|try|attempt|could|might|option|alternative)\b/i)) {
      problemSolving += 20;
    }
    if (lowerText.match(/\b(will|going to|next|tomorrow|future)\b/i)) {
      problemSolving += 10; // Forward thinking
    }

    // Positive thinking
    if (sentiment.score > 0) {
      positiveThinking += sentiment.score * 30;
    }
    if (lowerText.match(/\b(grateful|thankful|appreciate|blessed|positive|hope|better)\b/i)) {
      positiveThinking += 20;
    }

    return {
      selfAwareness: Math.min(100, selfAwareness),
      emotionalRegulation: Math.min(100, emotionalRegulation),
      problemSolving: Math.min(100, problemSolving),
      positiveThinking: Math.min(100, positiveThinking)
    };
  }

  /**
   * Generate suggested actions based on analysis
   */
  private generateSuggestedActions(
    insights: JournalInsight[],
    distortions: CognitiveDistortion[]
  ): string[] {
    const actions: string[] = [];

    // Based on insights
    const highPriorityInsights = insights.filter(i => i.priority === 'high' && i.actionable);
    if (highPriorityInsights.some(i => i.type === 'concern')) {
      actions.push('Consider discussing these feelings with your therapist');
      actions.push('Practice self-compassion and remind yourself that difficult feelings are temporary');
    }

    // Based on distortions
    if (distortions.length > 0) {
      actions.push('Challenge cognitive distortions by looking for evidence');
      actions.push('Try reframing negative thoughts in a more balanced way');
    }

    // General suggestions
    if (actions.length < 3) {
      actions.push('Continue journaling regularly to track patterns');
      actions.push('Notice positive moments throughout your day');
      actions.push('Practice mindfulness to stay present with your emotions');
    }

    return actions.slice(0, 5);
  }

  /**
   * Helper: Extract context around theme keywords
   */
  private extractThemeContext(text: string, keywords: string[]): string {
    const sentences = text.split(/[.!?]+/);
    const relevant = sentences.filter(s => 
      keywords.some(kw => s.toLowerCase().includes(kw.toLowerCase()))
    );
    return relevant.join('. ');
  }

  /**
   * Helper: Extract example sentences for themes
   */
  private extractThemeExamples(text: string, keywords: string[]): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const examples: string[] = [];

    for (const sentence of sentences) {
      if (keywords.some(kw => sentence.toLowerCase().includes(kw.toLowerCase()))) {
        examples.push(sentence.trim());
        if (examples.length >= 2) break;
      }
    }

    return examples;
  }

  /**
   * Analyze journal trends over time
   */
  async analyzeTrends(
    userId: string,
    supabase: any,
    days: number = 30
  ): Promise<{
    overallTrend: 'improving' | 'stable' | 'declining';
    averageSentiment: number;
    topThemes: JournalTheme[];
    commonDistortions: string[];
    progressOverTime: {
      date: string;
      sentiment: number;
      selfAwareness: number;
    }[];
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: entries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (!entries || entries.length === 0) {
      return {
        overallTrend: 'stable',
        averageSentiment: 0,
        topThemes: [],
        commonDistortions: [],
        progressOverTime: []
      };
    }

    // Analyze each entry
    const analyses = await Promise.all(
      entries.map(async (entry: any) => 
        this.analyzeEntry(entry.id, entry.content, entry.mood, entry.mood_score)
      )
    );

    // Calculate average sentiment
    const avgSentiment = analyses.reduce((sum, a) => sum + a.sentiment.score, 0) / analyses.length;

    // Determine trend
    const recentAnalyses = analyses.slice(-7); // Last 7 entries
    const olderAnalyses = analyses.slice(0, Math.min(7, analyses.length - 7));
    
    const recentAvg = recentAnalyses.reduce((sum, a) => sum + a.sentiment.score, 0) / recentAnalyses.length;
    const olderAvg = olderAnalyses.length > 0
      ? olderAnalyses.reduce((sum, a) => sum + a.sentiment.score, 0) / olderAnalyses.length
      : recentAvg;

    let overallTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvg > olderAvg + 0.2) overallTrend = 'improving';
    else if (recentAvg < olderAvg - 0.2) overallTrend = 'declining';

    // Aggregate themes
    const themeMap = new Map<string, { frequency: number; sentiment: number }>();
    analyses.forEach(a => {
      a.themes.forEach((theme: any) => {
        const existing = themeMap.get(theme.theme);
        if (existing) {
          existing.frequency += theme.frequency;
          existing.sentiment += theme.sentiment;
        } else {
          themeMap.set(theme.theme, { frequency: theme.frequency, sentiment: theme.sentiment });
        }
      });
    });

    const topThemes: JournalTheme[] = Array.from(themeMap.entries())
      .map(([theme, data]) => ({
        theme,
        frequency: data.frequency,
        sentiment: data.sentiment / analyses.length,
        keywords: [],
        examples: []
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    // Common distortions
    const distortionMap = new Map<string, number>();
    analyses.forEach(a => {
      a.cognitiveDistortions.forEach((d: any) => {
        distortionMap.set(d.type, (distortionMap.get(d.type) || 0) + 1);
      });
    });

    const commonDistortions = Array.from(distortionMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => type.replace(/_/g, ' '));

    // Progress over time
    const progressOverTime = analyses.map((a, i) => ({
      date: entries[i].created_at,
      sentiment: a.sentiment.score,
      selfAwareness: a.progressIndicators.selfAwareness
    }));

    return {
      overallTrend,
      averageSentiment: avgSentiment,
      topThemes,
      commonDistortions,
      progressOverTime
    };
  }
}

/**
 * Export singleton instance
 */
export const journalAnalyzer = new AIJournalAnalyzer();
