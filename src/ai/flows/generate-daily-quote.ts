'use server';

/**
 * @fileOverview A flow to generate a daily motivational quote.
 *
 * - generateDailyQuote - A function that returns a motivational quote.
 * - GenerateDailyQuoteOutput - The return type for the generateDailyQuote function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'genkit';

const GenerateDailyQuoteOutputSchema = z.object({
  quote: z.string().describe('A short, inspiring motivational quote for the user.'),
});
export type GenerateDailyQuoteOutput = z.infer<typeof GenerateDailyQuoteOutputSchema>;

export async function generateDailyQuote(): Promise<GenerateDailyQuoteOutput> {
  return generateDailyQuoteFlow();
}

const generateDailyQuotePrompt = ai.definePrompt({
  name: 'generateDailyQuotePrompt',
  output: {schema: GenerateDailyQuoteOutputSchema},
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an AI assistant that provides a daily dose of motivation. 
  
  Generate a short, powerful, and inspiring quote related to wellness, progress, and recovery. 
  
  Make it concise and impactful.`,
});

const generateDailyQuoteFlow = ai.defineFlow(
  {
    name: 'generateDailyQuoteFlow',
    outputSchema: GenerateDailyQuoteOutputSchema,
  },
  async () => {
    const {output} = await generateDailyQuotePrompt({});
    return output!;
  }
);
