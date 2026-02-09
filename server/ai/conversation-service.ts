/**
 * AI Conversation Service
 *
 * Manages conversation persistence: create, append messages,
 * retrieve history, and extract memories post-conversation.
 */

import { db } from '@/lib/db';
import { generateText } from 'ai';
import { getModel } from './provider';
import { memoryService, MemoryType } from './memory-service';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

interface ConversationRow {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

// ─── Service ───────────────────────────────────────────────────────────────

export const conversationService = {
  /**
   * Create a new conversation.
   */
  async create(userId: string, title?: string): Promise<Conversation> {
    const { rows } = await db.query<ConversationRow>(
      `INSERT INTO ai_conversations (user_id, title) VALUES ($1, $2) RETURNING *`,
      [userId, title || null]
    );
    const row = rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  /**
   * Get conversations for a user.
   */
  async list(userId: string, limit = 20): Promise<Conversation[]> {
    const { rows } = await db.query<ConversationRow>(
      `SELECT * FROM ai_conversations WHERE user_id = $1
       ORDER BY updated_at DESC LIMIT $2`,
      [userId, limit]
    );
    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      title: r.title,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  },

  /**
   * Append a message to a conversation.
   */
  async addMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system' | 'tool',
    content: string,
    metadata: Record<string, unknown> = {}
  ): Promise<Message> {
    const { rows } = await db.query<MessageRow>(
      `INSERT INTO ai_messages (conversation_id, role, content, metadata)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [conversationId, role, content, JSON.stringify(metadata)]
    );

    // Update conversation timestamp
    await db.query(
      `UPDATE ai_conversations SET updated_at = NOW() WHERE id = $1`,
      [conversationId]
    ).catch(() => {});

    const row = rows[0];
    return {
      id: row.id,
      conversationId: row.conversation_id,
      role: row.role as Message['role'],
      content: row.content,
      createdAt: row.created_at,
      metadata: row.metadata || {},
    };
  },

  /**
   * Get all messages for a conversation.
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const { rows } = await db.query<MessageRow>(
      `SELECT * FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [conversationId]
    );
    return rows.map((r) => ({
      id: r.id,
      conversationId: r.conversation_id,
      role: r.role as Message['role'],
      content: r.content,
      createdAt: r.created_at,
      metadata: r.metadata || {},
    }));
  },

  /**
   * Auto-generate a conversation title from the first message.
   */
  async generateTitle(conversationId: string, firstMessage: string): Promise<void> {
    try {
      const model = await getModel('fast');
      const { text } = await generateText({
        model,
        system: 'Generate a very short (3-6 word) title for this conversation. Return ONLY the title, no quotes.',
        prompt: firstMessage.slice(0, 500),
      });

      const title = text.trim().slice(0, 100);
      if (title) {
        await db.query(
          `UPDATE ai_conversations SET title = $1 WHERE id = $2`,
          [title, conversationId]
        );
      }
    } catch {
      // Best-effort
    }
  },

  /**
   * Extract and store memories from a conversation exchange.
   * Runs in the background after each assistant response.
   */
  async extractMemories(userId: string, userMessage: string, assistantMessage: string): Promise<void> {
    try {
      const model = await getModel('fast');

      const { text } = await generateText({
        model,
        system: `Extract important personal information from this conversation exchange.
Return a JSON array of objects with: content (string), type (preference|fact|goal|mood|observation), importance (1-5).
Only include genuinely important or long-term-relevant facts. Return [] if nothing notable.
Return ONLY the JSON array, no markdown.`,
        prompt: `User said: "${userMessage.slice(0, 1000)}"
Assistant replied: "${assistantMessage.slice(0, 1000)}"`,
      });

      const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const validMemories = parsed
          .filter((m: any) => m.content && m.type)
          .map((m: any) => ({
            content: String(m.content).slice(0, 500),
            type: (['preference', 'fact', 'goal', 'mood', 'observation'].includes(m.type) ? m.type : 'observation') as MemoryType,
            importance: Math.max(1, Math.min(5, Number(m.importance) || 3)),
          }));

        if (validMemories.length > 0) {
          await memoryService.extractAndStore(userId, validMemories);
        }
      }
    } catch {
      // Silent failure – memory extraction is best-effort
    }
  },

  /**
   * Delete a conversation and all its messages.
   */
  async delete(conversationId: string, userId: string): Promise<void> {
    await db.query(
      `DELETE FROM ai_conversations WHERE id = $1 AND user_id = $2`,
      [conversationId, userId]
    );
  },
};
