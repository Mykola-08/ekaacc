/**
 * AI Conversation Service
 * 
 * Advanced conversation management with:
 * - Context retention across sessions
 * - Personalized responses based on user history
 * - Sentiment-aware responses
 * - Multi-turn conversation support
 */

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    sentiment?: string;
    topics?: string[];
    intent?: string;
  };
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  messages: ConversationMessage[];
  userProfile?: {
    name?: string;
    preferences?: Record<string, any>;
    recentMood?: string;
    goals?: string[];
    concerns?: string[];
  };
  conversationState?: {
    activeTopics: string[];
    emotionalTone: 'supportive' | 'neutral' | 'energetic' | 'calming';
    userEngagement: number; // 0-100
  };
}

export interface ConversationResponse {
  response: string;
  context: ConversationContext;
  suggestions?: string[];
  followUpQuestions?: string[];
  resources?: {
    title: string;
    url?: string;
    description: string;
  }[];
}

export class AIConversationService {
  private readonly MAX_CONTEXT_MESSAGES = 20;
  private readonly MAX_CONTEXT_LENGTH = 4000; // tokens approximation
  
  /**
   * Generate a contextual response
   */
  async generateResponse(
    message: string,
    context: ConversationContext
  ): Promise<ConversationResponse> {
    // Add user message to context
    const userMessage: ConversationMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
      metadata: {
        sentiment: this.analyzeSentiment(message),
        topics: this.extractTopics(message),
        intent: this.detectIntent(message)
      }
    };

    context.messages.push(userMessage);

    // Trim context if needed
    this.trimContext(context);

    // Update conversation state
    this.updateConversationState(context);

    // Generate response
    const response = await this.generateContextualResponse(message, context);

    // Add assistant message to context
    const assistantMessage: ConversationMessage = {
      role: 'assistant',
      content: response.response,
      timestamp: Date.now()
    };

    context.messages.push(assistantMessage);

    return {
      ...response,
      context
    };
  }

  /**
   * Analyze sentiment of message
   */
  private analyzeSentiment(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Positive indicators
    const positiveWords = ['happy', 'great', 'good', 'better', 'improved', 'excited', 'grateful', 'thankful', 'love', 'joy'];
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;

    // Negative indicators
    const negativeWords = ['sad', 'bad', 'worse', 'terrible', 'awful', 'depressed', 'anxious', 'worried', 'scared', 'angry'];
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

    // Neutral indicators
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract topics from message
   */
  private extractTopics(message: string): string[] {
    const topics: string[] = [];
    const lowerMessage = message.toLowerCase();

    const topicKeywords: Record<string, string[]> = {
      'anxiety': ['anxiety', 'anxious', 'worried', 'stress', 'nervous'],
      'depression': ['depressed', 'depression', 'sad', 'hopeless', 'unmotivated'],
      'sleep': ['sleep', 'insomnia', 'tired', 'exhausted', 'rest'],
      'relationships': ['relationship', 'partner', 'friend', 'family', 'conflict'],
      'work': ['work', 'job', 'career', 'boss', 'colleague'],
      'exercise': ['exercise', 'workout', 'fitness', 'active', 'movement'],
      'meditation': ['meditate', 'meditation', 'mindfulness', 'breathing'],
      'therapy': ['therapy', 'therapist', 'counseling', 'session']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics;
  }

  /**
   * Detect user intent
   */
  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.match(/\b(help|support|need)\b/)) return 'seeking-help';
    if (lowerMessage.match(/\b(how|what|why|when|where)\b/)) return 'asking-question';
    if (lowerMessage.match(/\b(feel|feeling|felt)\b/)) return 'expressing-emotion';
    if (lowerMessage.match(/\b(want|goal|achieve|improve)\b/)) return 'setting-goal';
    if (lowerMessage.match(/\b(did|done|completed|accomplished)\b/)) return 'sharing-progress';
    
    return 'general-conversation';
  }

  /**
   * Trim context to stay within limits
   */
  private trimContext(context: ConversationContext): void {
    // Keep only recent messages
    if (context.messages.length > this.MAX_CONTEXT_MESSAGES) {
      // Always keep system messages
      const systemMessages = context.messages.filter(m => m.role === 'system');
      const recentMessages = context.messages
        .filter(m => m.role !== 'system')
        .slice(-this.MAX_CONTEXT_MESSAGES + systemMessages.length);
      
      context.messages = [...systemMessages, ...recentMessages];
    }

    // Estimate tokens and trim if needed (rough approximation: 1 token ≈ 4 characters)
    let totalLength = context.messages.reduce((sum, m) => sum + m.content.length, 0);
    while (totalLength > this.MAX_CONTEXT_LENGTH * 4 && context.messages.length > 5) {
      // Remove oldest non-system message
      const indexToRemove = context.messages.findIndex(m => m.role !== 'system');
      if (indexToRemove !== -1) {
        const removed = context.messages.splice(indexToRemove, 1)[0];
        totalLength -= removed.content.length;
      } else {
        break;
      }
    }
  }

  /**
   * Update conversation state based on recent messages
   */
  private updateConversationState(context: ConversationContext): void {
    if (!context.conversationState) {
      context.conversationState = {
        activeTopics: [],
        emotionalTone: 'neutral',
        userEngagement: 50
      };
    }

    const recentMessages = context.messages.slice(-5);
    
    // Update active topics
    const allTopics = recentMessages
      .flatMap(m => m.metadata?.topics || [])
      .filter((topic, index, array) => array.indexOf(topic) === index);
    context.conversationState.activeTopics = allTopics;

    // Update emotional tone based on recent sentiment
    const sentiments = recentMessages
      .filter(m => m.metadata?.sentiment)
      .map(m => m.metadata!.sentiment!);
    
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const positiveCount = sentiments.filter(s => s === 'positive').length;

    if (negativeCount > positiveCount) {
      context.conversationState.emotionalTone = 'supportive';
    } else if (positiveCount > negativeCount) {
      context.conversationState.emotionalTone = 'energetic';
    } else {
      context.conversationState.emotionalTone = 'neutral';
    }

    // Update engagement (based on message length and frequency)
    const avgMessageLength = recentMessages
      .filter(m => m.role === 'user')
      .reduce((sum, m) => sum + m.content.length, 0) / 
      Math.max(recentMessages.filter(m => m.role === 'user').length, 1);

    if (avgMessageLength > 100) {
      context.conversationState.userEngagement = Math.min(context.conversationState.userEngagement + 10, 100);
    } else if (avgMessageLength < 20) {
      context.conversationState.userEngagement = Math.max(context.conversationState.userEngagement - 10, 0);
    }
  }

  /**
   * Generate contextual response (placeholder - to be integrated with AI provider)
   */
  private async generateContextualResponse(
    message: string,
    context: ConversationContext
  ): Promise<Omit<ConversationResponse, 'context'>> {
    // This would call the actual AI service (OpenAI, Anthropic, etc.)
    // For now, return a structured template response

    const recentMessage = context.messages[context.messages.length - 1];
    const sentiment = recentMessage.metadata?.sentiment || 'neutral';
    const topics = recentMessage.metadata?.topics || [];
    const intent = recentMessage.metadata?.intent || 'general-conversation';

    let response = '';
    const suggestions: string[] = [];
    const followUpQuestions: string[] = [];
    const resources: ConversationResponse['resources'] = [];

    // Personalize based on context
    const userName = context.userProfile?.name || 'there';

    switch (intent) {
      case 'seeking-help':
        response = `I hear you, ${userName}. I'm here to support you. `;
        if (topics.includes('anxiety')) {
          response += 'It sounds like you\'re experiencing some anxiety. Let\'s explore some strategies together.';
          suggestions.push('Try a 5-minute breathing exercise', 'Journal your thoughts', 'Go for a short walk');
          resources.push({
            title: 'Anxiety Coping Strategies',
            description: 'Evidence-based techniques for managing anxiety'
          });
        }
        break;

      case 'expressing-emotion':
        if (sentiment === 'negative') {
          response = `Thank you for sharing how you're feeling, ${userName}. Your emotions are valid. `;
          followUpQuestions.push(
            'What do you think triggered these feelings?',
            'Have you experienced something similar before?'
          );
        } else if (sentiment === 'positive') {
          response = `That's wonderful to hear, ${userName}! `;
          followUpQuestions.push('What contributed to this positive feeling?');
        }
        break;

      case 'setting-goal':
        response = `Setting goals is a great step, ${userName}. `;
        suggestions.push('Break it down into smaller steps', 'Set a timeline', 'Track your progress');
        break;

      case 'sharing-progress':
        response = `Great job on making progress, ${userName}! Every step counts. `;
        followUpQuestions.push('How do you feel about your progress?', 'What\'s your next step?');
        break;

      default:
        response = `I'm here with you, ${userName}. `;
    }

    // Adjust tone based on conversation state
    if (context.conversationState?.emotionalTone === 'supportive') {
      response += ' Remember to be gentle with yourself.';
    }

    return {
      response,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
      resources: resources.length > 0 ? resources : undefined
    };
  }

  /**
   * Create a new conversation context
   */
  createContext(userId: string, userProfile?: ConversationContext['userProfile']): ConversationContext {
    return {
      userId,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messages: [],
      userProfile,
      conversationState: {
        activeTopics: [],
        emotionalTone: 'neutral',
        userEngagement: 50
      }
    };
  }

  /**
   * Add system message to context (for setting behavior)
   */
  addSystemMessage(context: ConversationContext, content: string): void {
    context.messages.push({
      role: 'system',
      content,
      timestamp: Date.now()
    });
  }

  /**
   * Get conversation summary
   */
  getSummary(context: ConversationContext): {
    messageCount: number;
    topics: string[];
    averageSentiment: string;
    duration: number;
  } {
    const userMessages = context.messages.filter(m => m.role === 'user');
    const sentiments = userMessages
      .map(m => m.metadata?.sentiment)
      .filter(s => s) as string[];

    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;

    let averageSentiment = 'neutral';
    if (positiveCount > negativeCount) averageSentiment = 'positive';
    else if (negativeCount > positiveCount) averageSentiment = 'negative';

    const firstMessage = context.messages[0];
    const lastMessage = context.messages[context.messages.length - 1];
    const duration = lastMessage ? lastMessage.timestamp - firstMessage.timestamp : 0;

    return {
      messageCount: context.messages.length,
      topics: context.conversationState?.activeTopics || [],
      averageSentiment,
      duration
    };
  }
}

// Export singleton instance
export const conversationService = new AIConversationService();
