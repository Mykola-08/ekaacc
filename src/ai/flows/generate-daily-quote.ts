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
  // Safety Check: If the API key is still the placeholder, return a default quote
  // to prevent the application from crashing.
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.warn("GEMINI_API_KEY is not configured. Returning default quote.");
    return { quote: "The journey to wellness begins with a single step. Configure your API key to get personalized quotes." };
  }
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
