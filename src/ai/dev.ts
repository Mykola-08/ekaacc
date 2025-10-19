'use server';
import { config } from 'dotenv';
config();

// The AI flows are now dynamically imported in the components that use them.
// This file is kept for Genkit's development server but no longer imports flows directly
// to prevent them from being processed at server startup.

// import '@/ai/flows/generate-monthly-report.ts';
// import '@/ai/flows/generate-support-summary.ts';
import '@/ai/flows/auto-generate-report.ts';
// import '@/ai/flows/summarize-session-reports.ts';
// import '@/ai/flows/triage-therapy.ts';
import '@/ai/flows/suggest-chat-reply.ts';
