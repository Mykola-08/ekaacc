/**
 * AI Provider – OpenRouter via AI SDK
 *
 * Uses the @ai-sdk/openai provider with a custom OpenRouter base URL.
 * API key is resolved from `app_config` then env fallback via `getOpenAIApiKey()`.
 */

import { createOpenAI } from '@ai-sdk/openai';
import { getOpenAIApiKey, getConfig } from '@/lib/config';

// ─── Models ────────────────────────────────────────────────────────────────

export const MODELS = {
  /** Primary conversational model */
  chat: 'google/gemini-2.5-flash',
  /** Fast model for background analysis / memory extraction */
  fast: 'google/gemini-2.0-flash-lite-001',
  /** Reasoning-capable model for complex insights */
  reasoning: 'google/gemini-2.5-flash-preview-05-20',
} as const;

export type ModelKey = keyof typeof MODELS;

// ─── Provider factory ──────────────────────────────────────────────────────

let _provider: ReturnType<typeof createOpenAI> | null = null;

/**
 * Get (or lazily create) the OpenRouter-backed AI SDK provider.
 *
 * Re-uses a singleton so we don't re-create on every request,
 * but still resolves the API key at first call (async config).
 */
export async function getProvider() {
  if (_provider) return _provider;

  const apiKey = await getOpenAIApiKey();
  const openRouterApiKey = (await getConfig('OPENROUTER_API_KEY')) || process.env.OPENROUTER_API_KEY;
  const key = openRouterApiKey || apiKey;

  if (!key) {
    throw new Error(
      'Missing AI API key. Set OPENROUTER_API_KEY or OPENAI_API_KEY in app_config or environment.'
    );
  }

  _provider = createOpenAI({
    apiKey: key,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://eka.care',
      'X-Title': 'EKA Wellness Platform',
    },
  });

  return _provider;
}

/**
 * Get a model instance ready for `generateText` / `streamText`.
 */
export async function getModel(key: ModelKey = 'chat') {
  const provider = await getProvider();
  return provider(MODELS[key]);
}

/**
 * Get the embedding model instance.
 */
export async function getEmbeddingModel() {
  const provider = await getProvider();
  return provider.textEmbeddingModel('text-embedding-3-small');
}

/**
 * Invalidate the cached provider (call after API key rotation).
 */
export function resetProvider() {
  _provider = null;
}
