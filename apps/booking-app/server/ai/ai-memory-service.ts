/**
 * AI Memory Service
 * Handles persistent memory and context for AI conversations
 * Includes vector embeddings for semantic search (when available)
 *
 * @review - Design needs improvement for production scale
 */
import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export type MemoryType = 'preference' | 'fact' | 'observation' | 'interaction' | 'goal' | 'mood';

export interface UserMemory {
  id: string;
  userId: string;
  content: string;
  memoryType: MemoryType;
  importance: number; // 1-5
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool';
  content: string;
  tokens?: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new memory entry for a user
 */
export async function createMemory(
  userId: string,
  content: string,
  memoryType: MemoryType,
  importance: number = 3,
  metadata: Record<string, unknown> = {}
): Promise<UserMemory | null> {
  try {
    const result = await db.queryOne<UserMemory>(
      `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id as "userId", content, memory_type as "memoryType",
                 importance, metadata, created_at as "createdAt"`,
      [userId, content, memoryType, Math.min(5, Math.max(1, importance)), metadata]
    );
    return result;
  } catch (error) {
    console.error('Error creating memory:', error);
    return null;
  }
}

/**
 * Get recent memories for a user
 */
export async function getRecentMemories(
  userId: string,
  limit: number = 20,
  memoryTypes?: MemoryType[]
): Promise<UserMemory[]> {
  try {
    let query = `
      SELECT id, user_id as "userId", content, memory_type as "memoryType",
             importance, metadata, created_at as "createdAt"
      FROM user_memory
      WHERE user_id = $1
    `;
    const params: unknown[] = [userId];

    if (memoryTypes && memoryTypes.length > 0) {
      query += ` AND memory_type = ANY($2)`;
      params.push(memoryTypes);
    }

    query += ` ORDER BY importance DESC, created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const { rows } = await db.query<UserMemory>(query, params);
    return rows;
  } catch (error) {
    console.error('Error fetching memories:', error);
    return [];
  }
}

/**
 * Get important memories (importance >= 4)
 */
export async function getImportantMemories(userId: string): Promise<UserMemory[]> {
  try {
    const { rows } = await db.query<UserMemory>(
      `SELECT id, user_id as "userId", content, memory_type as "memoryType",
              importance, metadata, created_at as "createdAt"
       FROM user_memory
       WHERE user_id = $1 AND importance >= 4
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching important memories:', error);
    return [];
  }
}

/**
 * Update memory importance
 */
export async function updateMemoryImportance(
  memoryId: string,
  userId: string,
  importance: number
): Promise<boolean> {
  try {
    const result = await db.query(
      `UPDATE user_memory SET importance = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3`,
      [Math.min(5, Math.max(1, importance)), memoryId, userId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error updating memory:', error);
    return false;
  }
}

/**
 * Delete a memory
 */
export async function deleteMemory(memoryId: string, userId: string): Promise<boolean> {
  try {
    const result = await db.query(
      `DELETE FROM user_memory WHERE id = $1 AND user_id = $2`,
      [memoryId, userId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting memory:', error);
    return false;
  }
}

/**
 * Create or get a conversation
 */
export async function getOrCreateConversation(
  userId: string,
  title?: string
): Promise<Conversation | null> {
  try {
    // Try to get existing active conversation from today
    const existing = await db.queryOne<Conversation>(
      `SELECT id, user_id as "userId", title, metadata,
              created_at as "createdAt", updated_at as "updatedAt"
       FROM ai_conversations
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (existing) {
      return existing;
    }

    // Create new conversation
    const result = await db.queryOne<Conversation>(
      `INSERT INTO ai_conversations (user_id, title)
       VALUES ($1, $2)
       RETURNING id, user_id as "userId", title, metadata,
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [userId, title || `Conversation ${new Date().toLocaleDateString()}`]
    );
    return result;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
}

/**
 * Save a message to conversation history
 */
export async function saveMessage(
  conversationId: string,
  role: ConversationMessage['role'],
  content: string,
  tokens?: number,
  metadata?: Record<string, unknown>
): Promise<ConversationMessage | null> {
  try {
    const result = await db.queryOne<ConversationMessage>(
      `INSERT INTO ai_messages (conversation_id, role, content, tokens, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, conversation_id as "conversationId", role, content,
                 tokens, metadata, created_at as "createdAt"`,
      [conversationId, role, content, tokens, metadata || {}]
    );
    return result;
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
}

/**
 * Get conversation messages
 */
export async function getConversationMessages(
  conversationId: string,
  limit: number = 50
): Promise<ConversationMessage[]> {
  try {
    const { rows } = await db.query<ConversationMessage>(
      `SELECT id, conversation_id as "conversationId", role, content,
              tokens, metadata, created_at as "createdAt"
       FROM ai_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC
       LIMIT $2`,
      [conversationId, limit]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

/**
 * Get user's conversation history
 */
export async function getUserConversations(
  userId: string,
  limit: number = 10
): Promise<Conversation[]> {
  try {
    const { rows } = await db.query<Conversation>(
      `SELECT id, user_id as "userId", title, metadata,
              created_at as "createdAt", updated_at as "updatedAt"
       FROM ai_conversations
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Build context from memories for AI prompt
 */
export async function buildMemoryContext(userId: string): Promise<string> {
  const memories = await getRecentMemories(userId, 10);
  const importantMemories = await getImportantMemories(userId);

  if (memories.length === 0 && importantMemories.length === 0) {
    return '';
  }

  // Combine and deduplicate
  const allMemories = [...importantMemories];
  for (const m of memories) {
    if (!allMemories.find((im) => im.id === m.id)) {
      allMemories.push(m);
    }
  }

  // Format for AI context
  const contextLines = allMemories.slice(0, 15).map((m) => {
    const typeLabel = m.memoryType.charAt(0).toUpperCase() + m.memoryType.slice(1);
    return `- [${typeLabel}] ${m.content}`;
  });

  return `
User Context (from previous interactions):
${contextLines.join('\n')}
`;
}

/**
 * Extract and store memories from conversation
 * This should be called after each conversation turn
 */
export async function extractMemoriesFromMessage(
  userId: string,
  userMessage: string,
  assistantResponse: string
): Promise<void> {
  // Simple rule-based extraction for MVP
  // In production, use LLM to extract meaningful memories

  const lowerMessage = userMessage.toLowerCase();

  // Detect preferences
  if (lowerMessage.includes('i prefer') || lowerMessage.includes('i like') || lowerMessage.includes("i don't like")) {
    await createMemory(userId, userMessage, 'preference', 4);
  }

  // Detect goals
  if (lowerMessage.includes('i want to') || lowerMessage.includes('my goal') || lowerMessage.includes('i need help with')) {
    await createMemory(userId, userMessage, 'goal', 5);
  }

  // Detect mood indicators
  const moodKeywords = ['feeling', 'stressed', 'anxious', 'happy', 'sad', 'tired', 'excited', 'overwhelmed'];
  if (moodKeywords.some(kw => lowerMessage.includes(kw))) {
    await createMemory(userId, userMessage, 'mood', 3, { timestamp: new Date().toISOString() });
  }

  // Store significant interactions
  if (userMessage.length > 100 || lowerMessage.includes('important') || lowerMessage.includes('remember')) {
    await createMemory(userId, userMessage, 'interaction', 4);
  }
}

/**
 * Log an AI interaction for analytics
 */
export async function logAIInteraction(
  userId: string,
  interactionType: string,
  context: Record<string, unknown>
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO ai_interactions (user_id, type, context, metadata)
       VALUES ($1, $2, $3, $4)`,
      [userId, interactionType, context, { timestamp: new Date().toISOString() }]
    );
  } catch (error) {
    console.error('Error logging AI interaction:', error);
  }
}
