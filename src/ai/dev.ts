import { config } from 'dotenv';
config();

import '@/ai/flows/generate-monthly-report.ts';
import '@/ai/flows/generate-support-summary.ts';
import '@/ai/flows/auto-generate-report.ts';
import '@/ai/flows/summarize-session-reports.ts';