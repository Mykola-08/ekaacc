'use server';

/**
 * @fileOverview A Genkit flow for generating a daily inspirational quote.
 *
 * - generateDailyQuote - A function that returns a daily quote.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyQuoteSchema = z.object({
  quote: z.string().describe('The inspirational quote.'),
  author: z.string().describe('The author of the quote.'),
});
export type DailyQuote = z.infer<typeof DailyQuoteSchema>;

const defaultQuote = {
  quote: "The best way to predict the future is to create it.",
  author: "Peter Drucker",
};

export async function generateDailyQuote(): Promise<DailyQuote> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
        console.warn("GEMINI_API_KEY is not configured. Returning default quote.");
        return defaultQuote;
    }
  return generateDailyQuoteFlow();
}

const generateDailyQuotePrompt = ai.definePrompt({
  name: 'generateDailyQuotePrompt',
  model: 'googleai/gemini-1.5-flash',
  output: {schema: DailyQuoteSchema},
  prompt: `Generate a short, inspirational quote suitable for a wellness and therapy app dashboard.`,
});

const generateDailyQuoteFlow = ai.defineFlow(
  {
    name: 'generateDailyQuoteFlow',
    outputSchema: DailyQuoteSchema,
  },
  async () => {
    const {output} = await generateDailyQuotePrompt({});
    return output!;
  }
);
