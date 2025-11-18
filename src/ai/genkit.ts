/**
 * @file AI Genkit compatibility layer
 * @description Provides a compatibility layer for genkit-style AI calls using Vercel AI
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

/**
 * AI service wrapper that provides genkit-compatible interface
 */
export const ai = {
  /**
   * Generate text using the AI model
   */
  async generate(prompt: string, options?: { maxTokens?: number; temperature?: number }): Promise<string> {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt,
      maxTokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.7,
    } as any);
    return text;
  },

  /**
   * Generate structured output using the AI model
   */
  async generateObject<T>(prompt: string, schema: any, options?: { maxTokens?: number; temperature?: number }): Promise<T> {
    const { object } = await import('ai').then(({ generateObject }) =>
      generateObject({
        model: openai('gpt-4-turbo'),
        prompt,
        schema,
        maxTokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
      } as any)
    );
    return object as T;
  },

  /**
   * Generate response (alias for generate, for backward compatibility)
   */
  async generateResponse(options: { input: string; maxTokens?: number; temperature?: number }): Promise<{ output: string }> {
    const text = await this.generate(options.input, {
      maxTokens: options.maxTokens,
      temperature: options.temperature,
    });
    return { output: text };
  },
};
