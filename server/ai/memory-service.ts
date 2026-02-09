/**
 * AI Memory Service
 *
 * Stores and retrieves user memories for long-term personalization.
 * Uses the `user_memory` table with importance scoring.
 */

import { db } from '@/lib/db';

// ─── Types ─────────────────────────────────────────────────────────────────

export type MemoryType = 'preference' | 'fact' | 'observation' | 'interaction' | 'goal' | 'mood';

export interface UserMemory {
  id: string;
  userId: string;
  content: string;
  memoryType: MemoryType;
  importance: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface MemoryRow {
  id: string;
  user_id: string;
  content: string;
  memory_type: MemoryType;
  importance: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Service ───────────────────────────────────────────────────────────────

function toMemory(row: MemoryRow): UserMemory {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    memoryType: row.memory_type,
    importance: row.importance,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const memoryService = {
  /**
   * Store a new memory for a user.
   */
  async addMemory(
    userId: string,
    content: string,
    type: MemoryType = 'observation',
    importance: number = 3,
    metadata: Record<string, unknown> = {}
  ): Promise<UserMemory> {
    const { rows } = await db.query<MemoryRow>(
      `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, content, type, importance, JSON.stringify(metadata)]
    );
    return toMemory(rows[0]);
  },

  /**
   * Retrieve recent memories for a user, ordered by importance and recency.
   */
  async getMemories(
    userId: string,
    opts: { limit?: number; types?: MemoryType[] } = {}
  ): Promise<UserMemory[]> {
    const { limit = 20, types } = opts;

    let query = `
      SELECT * FROM user_memory
      WHERE user_id = $1
    `;
    const params: unknown[] = [userId];

    if (types && types.length > 0) {
      query += ` AND memory_type = ANY($2)`;
      params.push(types);
    }

    query += ` ORDER BY importance DESC, created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const { rows } = await db.query<MemoryRow>(query, params);
    return rows.map(toMemory);
  },

  /**
   * Get the most important memories for context injection.
   */
  async getContextMemories(userId: string, limit = 10): Promise<string[]> {
    const memories = await this.getMemories(userId, {
      limit,
      types: ['preference', 'fact', 'goal', 'mood'],
    });
    return memories.map((m) => `[${m.memoryType}] ${m.content}`);
  },

  /**
   * Batch-store extracted memories from a conversation.
   */
  async extractAndStore(
    userId: string,
    memories: Array<{ content: string; type: MemoryType; importance: number }>
  ): Promise<void> {
    if (memories.length === 0) return;

    const values: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    for (const m of memories) {
      values.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3})`);
      params.push(userId, m.content, m.type, m.importance);
      idx += 4;
    }

    await db.query(
      `INSERT INTO user_memory (user_id, content, memory_type, importance)
       VALUES ${values.join(', ')}`,
      params
    );
  },

  /**
   * Delete a specific memory.
   */
  async deleteMemory(userId: string, memoryId: string): Promise<void> {
    await db.query(`DELETE FROM user_memory WHERE id = $1 AND user_id = $2`, [memoryId, userId]);
  },
};
