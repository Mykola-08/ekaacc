import OpenAI from 'openai';
import { getConfig } from '@/lib/config';

let aiClient: OpenAI | null = null;
let aiConfig: {
  provider: 'openai' | 'openrouter';
  model: string;
} | null = null;

export async function getAIClient(): Promise<OpenAI> {
  if (aiClient) return aiClient;

  const openRouterKey = (await getConfig('OPENROUTER_API_KEY')) || process.env.OPENROUTER_API_KEY;
  const openAIKey = (await getConfig('OPENAI_API_KEY')) || process.env.OPENAI_API_KEY;

  // Prefer OpenRouter if available (as requested by "openprovider")
  if (openRouterKey) {
    aiClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterKey,
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ekaacc.com',
        'X-Title': 'Eka Account',
      },
      dangerouslyAllowBrowser: true, // Be careful with this on client side, ideally server only
    });
    aiConfig = { provider: 'openrouter', model: 'anthropic/claude-3.5-sonnet' }; // Default robust model
  } else {
    // Fallback to OpenAI
    aiClient = new OpenAI({
      apiKey: openAIKey || 'placeholder',
      dangerouslyAllowBrowser: true,
    });
    aiConfig = { provider: 'openai', model: 'gpt-4o' };
  }

  return aiClient;
}

export async function getModel(): Promise<string> {
  if (!aiConfig) await getAIClient();
  // Allow overriding via config
  const configuredModel = (await getConfig('AI_MODEL')) || process.env.AI_MODEL;
  return configuredModel || aiConfig?.model || 'gpt-4o';
}
