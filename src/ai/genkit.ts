import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// The .env.local file is automatically loaded by Next.js.
// Manually calling config() from dotenv is not needed and can cause issues.

export const ai = genkit({
  plugins: [googleAI()],
});
