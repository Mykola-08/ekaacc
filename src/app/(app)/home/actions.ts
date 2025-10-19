'use server';

/**
 * @fileOverview Server actions for the Home page.
 * This file contains the server-side logic that can be called from client components.
 */
import { generateDailyQuote as generateDailyQuoteFlow } from '@/ai/flows/generate-daily-quote';

/**
 * This is the server action that the client will call.
 * It wraps the Genkit flow and ensures it's only run on the server when invoked.
 */
export async function generateDailyQuote() {
  return await generateDailyQuoteFlow();
}
