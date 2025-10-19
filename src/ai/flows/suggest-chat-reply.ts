'use server';

/**
 * @fileOverview A flow for suggesting a chat reply based on user input.
 *
 * - suggestChatReply - A function that suggests a reply.
 * - SuggestChatReplyInput - The input type for the suggestChatReply function.
 * - SuggestChatReplyOutput - The return type for the suggestChatReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChatReplyInputSchema = z.object({
  message: z.string().describe('The user message to reply to.'),
});
export type SuggestChatReplyInput = z.infer<typeof SuggestChatReplyInputSchema>;

const SuggestChatReplyOutputSchema = z.object({
  reply: z.string().describe('The suggested reply.'),
});
export type SuggestChatReplyOutput = z.infer<typeof SuggestChatReplyOutputSchema>;

export async function suggestChatReply(input: SuggestChatReplyInput): Promise<SuggestChatReplyOutput> {
  return suggestChatReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChatReplyPrompt',
  input: {schema: SuggestChatReplyInputSchema},
  output: {schema: SuggestChatReplyOutputSchema},
  prompt: `You are EKA Core, a helpful AI assistant for a wellness and therapy application.

  A user has sent the following message. Your task is to provide a helpful and encouraging reply.

  User Message: {{{message}}}

  Keep your reply concise and supportive.
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
