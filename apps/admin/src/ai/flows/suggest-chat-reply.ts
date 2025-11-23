'use server';

/**
 * @fileOverview A flow for suggesting a chat reply based on user input.
 *
 * - suggestChatReply - A function that suggests a reply.
 * - SuggestChatReplyInput - The input type for the suggestChatReply function.
 * - SuggestChatReplyOutput - The return type for the suggestChatReply function.
 */

import { ai } from '@/ai/genkit';

export interface SuggestChatReplyInput {
  message: string;
}

export interface SuggestChatReplyOutput {
  reply: string;
}

export async function suggestChatReply(input: SuggestChatReplyInput): Promise<SuggestChatReplyOutput> {
  const { message } = input;
  
  // Create a comprehensive prompt for the AI
  const prompt = `You are a helpful therapy assistant. Please suggest a thoughtful and empathetic reply to this message: "${message}". The reply should be supportive, professional, and encouraging. Keep it concise but meaningful.`;
  
  const response = await ai.generateResponse({ input: prompt });
  
  return {
    reply: response.output
  };
}
