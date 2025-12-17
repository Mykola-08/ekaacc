/**
 * AI Content Moderator
 * 
 * Provides AI-powered content moderation for:
 * - Community posts
 * - Journal entries (for crisis detection)
 * - Messages
 * - Comments
 */

export interface ModerationResult {
  safe: boolean;
  confidence: number; // 0-100
  categories: ModerationCategory[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction: 'allow' | 'review' | 'block' | 'escalate';
  reasoning: string;
  flaggedContent?: string[];
}

export interface ModerationCategory {
  type: 'harassment' | 'hate-speech' | 'self-harm' | 'violence' | 'sexual-content' | 'spam' | 'misinformation';
  detected: boolean;
  confidence: number;
  details?: string;
}

export interface CrisisIndicator {
  detected: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'emergency';
  indicators: string[];
  recommendedAction: string;
  supportResources: string[];
}

export class AIContentModerator {
  private crisisKeywords: Set<string>;
  private harmKeywords: Set<string>;
  private spamIndicators: RegExp[];

  constructor() {
    // Crisis detection keywords
    this.crisisKeywords = new Set([
      'suicide', 'kill myself', 'end it all', 'want to die',
      'no reason to live', 'better off dead', 'goodbye cruel world',
      'self-harm', 'cutting', 'overdose', 'hurt myself'
    ]);

    // Harmful content keywords
    this.harmKeywords = new Set([
      'hate', 'discriminate', 'attack', 'threat',
      'harassment', 'bully', 'abuse', 'violent'
    ]);

    // Spam indicators
    this.spamIndicators = [
      /https?:\/\/[^\s]+/gi, // Multiple URLs
      /\b(?:click here|buy now|limited offer|act now)\b/gi,
      /(.)\1{10,}/g, // Repeated characters
    ];
  }

  /**
   * Moderate content for safety and appropriateness
   */
  async moderateContent(content: string, context?: {
    userId?: string;
    contentType?: 'post' | 'comment' | 'journal' | 'message';
    previousFlags?: number;
  }): Promise<ModerationResult> {
    const categories: ModerationCategory[] = [];
    let severity: ModerationResult['severity'] = 'low';
    let suggestedAction: ModerationResult['suggestedAction'] = 'allow';

    // Check for self-harm/crisis
    const crisisCheck = this.detectCrisisIndicators(content);
    if (crisisCheck.detected) {
      categories.push({
        type: 'self-harm',
        detected: true,
        confidence: crisisCheck.severity === 'emergency' ? 95 : 80,
        details: `Crisis severity: ${crisisCheck.severity}`
      });
      severity = 'critical';
      suggestedAction = 'escalate';
    }

    // Check for harassment/hate speech
    const harassmentScore = this.detectHarassment(content);
    if (harassmentScore > 0.7) {
      categories.push({
        type: 'harassment',
        detected: true,
        confidence: harassmentScore * 100,
        details: 'Potentially harmful language detected'
      });
      severity = harassmentScore > 0.9 ? 'high' : 'medium';
      suggestedAction = harassmentScore > 0.9 ? 'block' : 'review';
    }

    // Check for spam
    const spamScore = this.detectSpam(content);
    if (spamScore > 0.6) {
      categories.push({
        type: 'spam',
        detected: true,
        confidence: spamScore * 100,
        details: 'Spam characteristics detected'
      });
      if (severity === 'low') severity = 'medium';
      if (suggestedAction === 'allow') suggestedAction = 'review';
    }

    // Adjust for repeat offender
    if (context?.previousFlags && context.previousFlags > 2) {
      if (severity === 'low') severity = 'medium';
      if (suggestedAction === 'allow') suggestedAction = 'review';
    }

    const safe = !categories.some(c => c.detected && c.confidence > 70);
    const confidence = this.calculateConfidence(categories);

    return {
      safe,
      confidence,
      categories,
      severity,
      suggestedAction,
      reasoning: this.generateReasoning(categories, severity),
      flaggedContent: this.extractFlaggedContent(content, categories)
    };
  }

  /**
   * Detect crisis indicators in content (critical for mental health platform)
   */
  detectCrisisIndicators(content: string): CrisisIndicator {
    const lowerContent = content.toLowerCase();
    const indicators: string[] = [];
    let severity: CrisisIndicator['severity'] = 'none';

    // Check for explicit crisis keywords
    for (const keyword of this.crisisKeywords) {
      if (lowerContent.includes(keyword)) {
        indicators.push(keyword);
      }
    }

    // Determine severity
    if (indicators.length === 0) {
      severity = 'none';
    } else if (indicators.length === 1) {
      severity = 'mild';
    } else if (indicators.length <= 3) {
      severity = 'moderate';
    } else if (indicators.length <= 5) {
      severity = 'severe';
    } else {
      severity = 'emergency';
    }

    // Check for plan indicators (increases severity)
    const planIndicators = ['plan', 'method', 'how to', 'when to'];
    const hasPlan = planIndicators.some(p => lowerContent.includes(p));
    if (hasPlan && severity !== 'none') {
      severity = severity === 'mild' ? 'moderate' : 
                severity === 'moderate' ? 'severe' : 'emergency';
    }

    return {
      detected: indicators.length > 0,
      severity,
      indicators,
      recommendedAction: this.getRecommendedAction(severity),
      supportResources: this.getSupportResources(severity)
    };
  }

  /**
   * Detect harassment or hate speech
   */
  private detectHarassment(content: string): number {
    const lowerContent = content.toLowerCase();
    let score = 0;
    let matchCount = 0;

    // Check harmful keywords
    for (const keyword of this.harmKeywords) {
      if (lowerContent.includes(keyword)) {
        matchCount++;
        score += 0.2;
      }
    }

    // Check for targeted language
    const personalAttacks = [
      /you are (stupid|dumb|worthless|useless)/gi,
      /nobody likes you/gi,
      /go (kill|hurt) yourself/gi,
      /you should (die|disappear)/gi
    ];

    for (const pattern of personalAttacks) {
      if (pattern.test(content)) {
        score += 0.4;
      }
    }

    // Check for excessive caps (shouting)
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.5 && content.length > 20) {
      score += 0.1;
    }

    return Math.min(score, 1);
  }

  /**
   * Detect spam content
   */
  private detectSpam(content: string): number {
    let score = 0;

    // Check spam indicators
    for (const pattern of this.spamIndicators) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        score += 0.3 * matches.length;
      }
    }

    // Check for repetitive content
    const words = content.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const repetitionRatio = 1 - (uniqueWords.size / words.length);
    if (repetitionRatio > 0.7) {
      score += 0.4;
    }

    return Math.min(score, 1);
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(categories: ModerationCategory[]): number {
    if (categories.length === 0) return 95; // High confidence in safe content
    
    const avgConfidence = categories
      .filter(c => c.detected)
      .reduce((sum, c) => sum + c.confidence, 0) / 
      categories.filter(c => c.detected).length || 0;

    return Math.round(avgConfidence);
  }

  /**
   * Generate human-readable reasoning
   */
  private generateReasoning(categories: ModerationCategory[], severity: string): string {
    const detected = categories.filter(c => c.detected);
    
    if (detected.length === 0) {
      return 'Content appears safe and appropriate.';
    }

    const types = detected.map(c => c.type).join(', ');
    return `Detected potential ${types}. Severity: ${severity}. Recommended action based on content analysis.`;
  }

  /**
   * Extract flagged content portions
   */
  private extractFlaggedContent(content: string, categories: ModerationCategory[]): string[] | undefined {
    const flagged: string[] = [];
    const lowerContent = content.toLowerCase();

    // Extract sentences with harmful keywords
    const sentences = content.split(/[.!?]+/);
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      for (const keyword of [...this.crisisKeywords, ...this.harmKeywords]) {
        if (lowerSentence.includes(keyword)) {
          flagged.push(sentence.trim());
          break;
        }
      }
    }

    return flagged.length > 0 ? [...new Set(flagged)] : undefined;
  }

  /**
   * Get recommended action based on crisis severity
   */
  private getRecommendedAction(severity: CrisisIndicator['severity']): string {
    switch (severity) {
      case 'emergency':
      case 'severe':
        return 'Immediate intervention required. Alert crisis team and provide emergency resources.';
      case 'moderate':
        return 'Monitor closely and provide support resources. Consider therapist outreach.';
      case 'mild':
        return 'Flag for review and display wellness resources.';
      default:
        return 'No action needed.';
    }
  }

  /**
   * Get support resources based on crisis severity
   */
  private getSupportResources(severity: CrisisIndicator['severity']): string[] {
    const resources = [];

    if (severity !== 'none') {
      resources.push('National Suicide Prevention Lifeline: 988');
      resources.push('Crisis Text Line: Text HOME to 741741');
      resources.push('International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/');
    }

    if (severity === 'moderate' || severity === 'severe' || severity === 'emergency') {
      resources.push('Emergency Services: 911');
      resources.push('SAMHSA National Helpline: 1-800-662-4357');
    }

    return resources;
  }

  /**
   * Batch moderation for multiple contents
   */
  async moderateBatch(contents: string[], context?: any): Promise<ModerationResult[]> {
    return Promise.all(contents.map(content => this.moderateContent(content, context)));
  }
}

// Export singleton instance
export const contentModerator = new AIContentModerator();
