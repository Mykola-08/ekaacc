/**
 * AI Chat API Route
 *
 * Streaming chat endpoint using AI SDK v6 with OpenRouter.
 * Supports tool calling, user context injection, and memory extraction.
 *
 * POST /api/ai/chat
 * Body: { messages, conversationId? }
 */

import { streamText, type CoreMessage } from 'ai';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getModel,
  contextService,
  conversationService,
  createTools,
  buildSystemPrompt,
} from '@/server/ai';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Parse request ────────────────────────────────────────────
    const body = await req.json();
    const { messages, conversationId } = body as {
      messages: CoreMessage[];
      conversationId?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Conversation management ──────────────────────────────────
    let convId = conversationId;

    if (!convId) {
      // Create a new conversation
      const conv = await conversationService.create(user.id);
      convId = conv.id;

      // Generate title from first user message (background)
      const firstUserMsg = messages.find((m) => m.role === 'user');
      if (firstUserMsg && typeof firstUserMsg.content === 'string') {
        conversationService.generateTitle(convId, firstUserMsg.content).catch(() => {});
      }
    }

    // Persist the latest user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg && typeof lastUserMsg.content === 'string') {
      await conversationService
        .addMessage(convId, 'user', lastUserMsg.content)
        .catch(() => {});
    }

    // ── Build context ────────────────────────────────────────────
    const [model, userContext] = await Promise.all([
      getModel('chat'),
      contextService.buildCompactContext(user.id).catch(() => ''),
    ]);

    const systemPrompt = buildSystemPrompt(userContext);
    const tools = createTools(user.id);

    // ── Stream response ──────────────────────────────────────────
    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      tools,
      maxSteps: 5,
      onFinish: async ({ text }) => {
        if (!text) return;

        // Persist assistant message
        await conversationService
          .addMessage(convId!, 'assistant', text)
          .catch(() => {});

        // Background memory extraction
        if (lastUserMsg && typeof lastUserMsg.content === 'string') {
          conversationService
            .extractMemories(user.id, lastUserMsg.content, text)
            .catch(() => {});
        }
      },
    });

    return result.toDataStreamResponse({
      headers: {
        'X-Conversation-Id': convId,
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
