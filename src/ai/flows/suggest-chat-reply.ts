'use server';

/**
 * @fileOverview A flow for suggesting chat replies based on conversation history.
 *
 * - suggestChatReply - A function that suggests replies.
 * - SuggestChatReplyInput - The input type for the suggestChatReply function.
 * - SuggestChatReplyOutput - The return type for the suggestChatReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChatReplyInputSchema = z.object({
  conversation: z.string().describe('The entire conversation history, with each message on a new line.'),
});
export type SuggestChatReplyInput = z.infer<typeof SuggestChatReplyInputSchema>;

const SuggestChatReplyOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of three short, relevant reply suggestions.'),
});
export type SuggestChatReplyOutput = z.infer<typeof SuggestChatReplyOutputSchema>;

export async function suggestChatReply(input: SuggestChatReplyInput): Promise<SuggestChatReplyOutput> {
  return suggestChatReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChatReplyPrompt',
  input: {schema: SuggestChatReplyInputSchema},
  output: {schema: SuggestChatReplyOutputSchema},
  prompt: `You are an AI assistant integrated into a therapy chat application. Your role is to help users by suggesting potential replies.

  Analyze the following conversation history between a user and their therapist. Based on the last message, generate three concise, helpful, and appropriate reply suggestions for the user. The suggestions should be short, like something you'd see as a one-tap reply in a messaging app.

  Conversation History:
  {{{conversation}}}

  Provide three distinct suggestions.
  `,
});

const suggestChatReplyFlow = ai.defineFlow(
  {
    name: 'suggestChatReplyFlow',
    inputSchema: SuggestChatReplyInputSchema,
    outputSchema: SuggestChatReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
