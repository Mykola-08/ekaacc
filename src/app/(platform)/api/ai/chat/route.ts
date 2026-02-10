/**
 * AI Chat API Route
 *
 * Streaming chat endpoint using AI SDK v6 with OpenRouter.
 * Supports tool calling, user context injection, and memory extraction.
 *
 * POST /api/ai/chat
 * Body: { messages, conversationId? }
 */

import { streamText, stepCountIs, type ModelMessage } from 'ai';
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

/** Extract text from a ModelMessage's content (string or parts array). */
function extractTextFromMessage(msg: ModelMessage): string | null {
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.content)) {
    const text = msg.content
      .filter((p): p is { type: 'text'; text: string } => (p as any).type === 'text')
      .map((p) => p.text)
      .join('');
    return text || null;
  }
  return null;
}

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
      messages: ModelMessage[];
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
      if (firstUserMsg) {
        const firstText = extractTextFromMessage(firstUserMsg);
        if (firstText) {
          conversationService.generateTitle(convId, firstText).catch(() => {});
        }
      }
    }

    // Persist the latest user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const lastUserText = lastUserMsg ? extractTextFromMessage(lastUserMsg) : null;
    if (lastUserText) {
      await conversationService
        .addMessage(convId, 'user', lastUserText)
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
      stopWhen: stepCountIs(5),
      onFinish: async ({ text }) => {
        if (!text) return;

        // Persist assistant message
        await conversationService
          .addMessage(convId!, 'assistant', text)
          .catch(() => {});

        // Background memory extraction
        if (lastUserText) {
          conversationService
            .extractMemories(user.id, lastUserText, text)
            .catch(() => {});
        }
      },
    });

    return result.toUIMessageStreamResponse({
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
