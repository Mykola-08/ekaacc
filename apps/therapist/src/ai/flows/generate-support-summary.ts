'use server';

/**
 * @fileOverview An AI agent for generating a summary of support received by a donation receiver.
 *
 * - generateSupportSummary - A function that handles the generation of the support summary.
 * - GenerateSupportSummaryInput - The input type for the generateSupportSummary function.
 * - GenerateSupportSummaryOutput - The return type for the generateSupportSummary function.
 */

import { ai } from '@/ai/genkit';

export interface GenerateSupportSummaryInput {
  receiverName: string;
  donorNames: string[];
  supportDetails: string;
  progressDetails: string;
}

export interface GenerateSupportSummaryOutput {
  summary: string;
  progress: string;
}

export async function generateSupportSummary(input: GenerateSupportSummaryInput): Promise<GenerateSupportSummaryOutput> {
  const { receiverName, donorNames, supportDetails, progressDetails } = input;
  
  // Create a comprehensive prompt for the AI
  const prompt = `You are an AI assistant helping a donation receiver communicate their progress to donors.

Your task is to generate a concise and engaging summary of the support they have received, as well as a short progress update.

Receiver Name: ${receiverName}
Donor Names: ${donorNames.join(', ')}
Support Details: ${supportDetails}
Progress Details: ${progressDetails}

Please generate a summary that highlights the impact of the donations and the progress made by the receiver.
Also, include a one-sentence summary of progress in the "progress" field.`;
  
  const response = await ai.generateResponse({ input: prompt });
  
  return {
    summary: response.output,
    progress: "Significant progress has been made thanks to the generous support received."
  };
}
