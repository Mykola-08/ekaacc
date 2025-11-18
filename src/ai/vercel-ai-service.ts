import { generateText, generateObject, streamText, streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import type { User } from '@/lib/types';

export interface VercelAIRequest {
  prompt: string;
  context?: string;
  userId?: string;
  model?: 'openai' | 'anthropic' | 'google' | 'o1' | 'o3-mini';
  modelVariant?: 'gpt-4-turbo' | 'gpt-4' | 'gpt-3.5-turbo' | 'o1-preview' | 'o1-mini' | 'o3-mini' | 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku' | 'gemini-pro';
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface VercelAIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: string;
  userId?: string;
}

export interface VercelAIObjectRequest<T> extends VercelAIRequest {
  schema: T;
}

export interface VercelAIObjectResponse<T> extends VercelAIResponse {
  object: T;
}

export class VercelAIService {
  private providers = {
    openai,
    anthropic,
    google,
    'o1': openai,
    'o3-mini': openai
  };

  private modelVariants = {
    'openai': 'gpt-4-turbo',
    'anthropic': 'claude-3-sonnet-20240229',
    'google': 'gemini-pro',
    'o1': 'o1-preview',
    'o3-mini': 'o3-mini'
  };

  private defaultModel = 'openai';
  private defaultMaxTokens = 1000;
  private defaultTemperature = 0.7;

  /**
   * Generate text response using Vercel AI SDK
   */
  async generateText(request: VercelAIRequest): Promise<VercelAIResponse> {
    try {
      const modelKey = request.model || this.defaultModel;
      const provider = this.providers[modelKey as keyof typeof this.providers];
      const modelVariant = request.modelVariant || this.modelVariants[modelKey as keyof typeof this.modelVariants];
      const maxTokens = request.maxTokens || this.defaultMaxTokens;
      const temperature = request.temperature || this.defaultTemperature;

      const systemPrompt = request.context 
        ? `You are a helpful AI assistant for a mental health therapy platform. ${request.context}`
        : 'You are a helpful AI assistant for a mental health therapy platform. Provide supportive, empathetic, and professional responses.';

      const result = await generateText({
        model: provider(modelVariant),
        system: systemPrompt,
        prompt: request.prompt,
        maxTokens: maxTokens,
        temperature: temperature
      } as any);

      return {
        content: result.text,
        usage: result.usage ? {
          promptTokens: (result.usage as any).promptTokens || result.usage.inputTokens || 0,
          completionTokens: (result.usage as any).completionTokens || result.usage.outputTokens || 0,
          totalTokens: result.usage.totalTokens,
        } : undefined,
        model: result.response?.modelId || 'unknown',
        timestamp: new Date().toISOString(),
        userId: request.userId,
      };
    } catch (error) {
      console.error('Vercel AI text generation error:', error);
      throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate structured object response using Vercel AI SDK
   */
  async generateObject<T>(request: VercelAIObjectRequest<T>): Promise<VercelAIObjectResponse<T>> {
    try {
      const modelKey = request.model || this.defaultModel;
      const provider = this.providers[modelKey as keyof typeof this.providers];
      const modelVariant = request.modelVariant || this.modelVariants[modelKey as keyof typeof this.modelVariants];
      const maxTokens = request.maxTokens || this.defaultMaxTokens;
      const temperature = request.temperature || this.defaultTemperature;

      const systemPrompt = request.context 
        ? `You are a helpful AI assistant for a mental health therapy platform. ${request.context}`
        : 'You are a helpful AI assistant for a mental health therapy platform. Provide structured, professional responses.';

      const result = await generateObject({
        model: provider(modelVariant),
        system: systemPrompt,
        prompt: request.prompt,
        schema: request.schema,
        maxTokens,
        temperature,
      } as any);

      return {
        content: JSON.stringify(result.object),
        object: result.object,
        usage: result.usage ? {
          promptTokens: (result.usage as any).promptTokens || result.usage.inputTokens || 0,
          completionTokens: (result.usage as any).completionTokens || result.usage.outputTokens || 0,
          totalTokens: result.usage.totalTokens,
        } : undefined,
        model: result.response?.modelId || 'unknown',
        timestamp: new Date().toISOString(),
        userId: request.userId,
      };
    } catch (error) {
      console.error('Vercel AI object generation error:', error);
      throw new Error(`Failed to generate AI object: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stream text response using Vercel AI SDK
   */
  async *streamText(request: VercelAIRequest): AsyncGenerator<string, void, unknown> {
    try {
      const model = this.providers[(request.model || this.defaultModel) as keyof typeof this.providers];
      const maxTokens = request.maxTokens || this.defaultMaxTokens;
      const temperature = request.temperature || this.defaultTemperature;

      const systemPrompt = request.context 
        ? `You are a helpful AI assistant for a mental health therapy platform. ${request.context}`
        : 'You are a helpful AI assistant for a mental health therapy platform. Provide supportive, empathetic, and professional responses.';

      const result = await streamText({
        model: model('gpt-4-turbo'),
        system: systemPrompt,
        prompt: request.prompt,
        maxTokens,
        temperature,
      } as any);

      for await (const delta of result.textStream) {
        yield delta;
      }
    } catch (error) {
      console.error('Vercel AI text streaming error:', error);
      throw new Error(`Failed to stream AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate therapy-specific recommendations
   */
  async generateTherapyRecommendations(user: User, context: string): Promise<VercelAIResponse> {
    const prompt = `Based on the following user context and therapy session information, provide personalized recommendations:

User Information:
- Name: ${user.name}
- User Type: ${user.userType}
- Join Date: ${user.createdAt}

Context: ${context}

Please provide:
1. 2-3 specific therapeutic recommendations
2. Any potential concerns to monitor
3. Suggestions for next session focus
4. Resources or exercises that might help

Keep the response professional, empathetic, and actionable.`;

    return this.generateText({
      prompt,
      context: 'You are an experienced mental health professional providing therapy recommendations.',
      userId: user.id,
      model: 'openai',
      maxTokens: 800,
      temperature: 0.3,
    });
  }

  /**
   * Generate monthly progress report
   */
  async generateMonthlyReport(user: User, monthData: any): Promise<VercelAIResponse> {
    const prompt = `Create a comprehensive monthly progress report for a therapy client based on the following data:

User: ${user.name} (${user.userType})
Month Data: ${JSON.stringify(monthData, null, 2)}

Please generate a professional progress report that includes:
1. Overall progress summary
2. Key milestones achieved
3. Areas of improvement
4. Challenges faced
5. Goals for next month
6. Therapist recommendations

Make it empathetic, professional, and encouraging.`;

    return this.generateText({
      prompt,
      context: 'You are a mental health professional writing a monthly progress report for a therapy client.',
      userId: user.id,
      model: 'openai',
      maxTokens: 1200,
      temperature: 0.4,
    });
  }

  /**
   * Generate crisis support response
   */
  async generateCrisisSupport(user: User, crisisContext: string): Promise<VercelAIResponse> {
    const prompt = `URGENT: Provide immediate crisis support for the following situation:

User: ${user.name}
Crisis Context: ${crisisContext}

Please provide:
1. Immediate supportive response
2. Coping strategies for right now
3. Safety planning if appropriate
4. Encouragement to reach out to crisis resources
5. When to seek immediate professional help

CRITICAL: Always include crisis hotline information and encourage professional help.`;

    return this.generateText({
      prompt,
      context: 'You are a crisis counselor providing immediate support. Always prioritize safety and professional help.',
      userId: user.id,
      model: 'anthropic', // Use Anthropic for more careful responses
      maxTokens: 600,
      temperature: 0.2,
    });
  }

  /**
   * Generate wellness check-in response
   */
  async generateWellnessCheckIn(user: User, checkInData: any): Promise<VercelAIResponse> {
    const prompt = `Generate a personalized wellness check-in response based on:

User: ${user.name}
Check-in Data: ${JSON.stringify(checkInData)}

Please provide:
1. Acknowledgment of their current state
2. Encouraging and supportive response
3. 1-2 simple wellness suggestions
4. Motivation to continue their wellness journey
5. When to consider reaching out for additional support

Keep it warm, supportive, and actionable.`;

    return this.generateText({
      prompt,
      context: 'You are a wellness coach providing supportive check-in responses.',
      userId: user.id,
      model: 'openai',
      maxTokens: 500,
      temperature: 0.6,
    });
  }

  /**
   * Get available models and their costs
   */
  getAvailableModels(): Array<{ name: string; provider: string; costPerToken: number }> {
    return [
      { name: 'gpt-4-turbo', provider: 'openai', costPerToken: 0.00003 },
      { name: 'claude-3-sonnet', provider: 'anthropic', costPerToken: 0.000015 },
      { name: 'gemini-pro', provider: 'google', costPerToken: 0.000005 },
    ];
  }

  /**
   * Estimate cost for a request
   */
  estimateCost(prompt: string, model: string = 'openai'): number {
    const models = this.getAvailableModels();
    const selectedModel = models.find(m => m.provider === model);
    if (!selectedModel) return 0;

    // Rough estimation: ~4 characters per token
    const estimatedTokens = Math.ceil(prompt.length / 4);
    return estimatedTokens * selectedModel.costPerToken;
  }
}

// Singleton instance
export const vercelAIService = new VercelAIService();