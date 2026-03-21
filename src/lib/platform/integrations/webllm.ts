'use client';

/**
 * WebLLM Integration
 *
 * Provides WebLLM browser-native AI as an alternative provider
 * for client-side chat. Uses navigator.llm API via the WebLLM
 * browser extension.
 *
 * @see https://www.webllm.org/docs
 */

import type { ChatTransport, UIMessage, ChatRequestOptions } from 'ai';

// Extend Navigator with WebLLM API
declare global {
  interface Navigator {
    llm?: {
      generateText(options: {
        task?: string;
        hints?: Record<string, unknown>;
        messages: Array<{ role: string; content: string }>;
      }): Promise<{ text: string }>;
    };
  }
}

type UIMessageChunk = any;

/**
 * Check if WebLLM is available in the browser
 */
export function isWebLLMAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.llm;
}

/**
 * Custom ChatTransport that uses WebLLM for client-side AI inference.
 *
 * Falls back gracefully if WebLLM extension is not installed.
 * Does not support tool calling (server tools require the server API).
 */
export class WebLLMChatTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
  }: {
    trigger: 'submit-message' | 'regenerate-message';
    chatId: string;
    messageId: string | undefined;
    messages: UIMessage[];
    abortSignal: AbortSignal | undefined;
  } & ChatRequestOptions): Promise<ReadableStream<UIMessageChunk>> {
    if (!isWebLLMAvailable()) {
      throw new Error('WebLLM is not available. Please install the WebLLM browser extension.');
    }

    // Convert UIMessage parts to simple message format
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content:
        msg.parts
          ?.filter((p) => p.type === 'text')
          .map((p) => (p as any).text)
          .join('') || '',
    }));

    // Add system message
    const allMessages = [
      {
        role: 'system',
        content:
          'You are EKA, a friendly AI wellness companion. Help users with mental health, mood tracking, and general wellness guidance. Be empathetic, supportive, and concise.',
      },
      ...formattedMessages,
    ];

    // Use navigator.llm directly for compatibility
    const response = await navigator.llm!.generateText({
      task: 'general',
      hints: { quality: 'high' as const },
      messages: allMessages,
    });

    const text = response.text || '';
    const messageId = crypto.randomUUID();

    // Create a ReadableStream that emits UIMessageChunks
    return new ReadableStream<UIMessageChunk>({
      start(controller) {
        // Emit message start
        controller.enqueue({
          type: 'text-start',
          id: messageId,
        });

        // Emit text as a single delta (WebLLM generateText is non-streaming)
        if (text) {
          controller.enqueue({
            type: 'text-delta',
            id: messageId,
            delta: text,
          });
        }

        // Emit text end
        controller.enqueue({
          type: 'text-end',
          id: messageId,
        });

        controller.close();
      },
    });
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    // WebLLM is client-side only — no stream recovery
    return null;
  }
}
