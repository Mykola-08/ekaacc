/**
 * AI Memory Service
 *
 * Stores and retrieves user memories for long-term personalization.
 * Uses the `user_memory` table with importance scoring.
 */

import { db } from '@/lib/db';
import { embed, embedMany } from 'ai';
import { getEmbeddingModel } from './provider';
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
   * Store a new memory for a user with vector embedding.
   */
  async addMemory(
    userId: string,
    content: string,
    type: MemoryType = 'observation',
    importance: number = 3,
    metadata: Record<string, unknown> = {}
  ): Promise<UserMemory> {
    let embeddingVector = null;
    try {
      const embeddingModel = await getEmbeddingModel();
      const { embedding } = await embed({
        model: embeddingModel,
        value: content,
      });
      // pgvector expects string representation like "[0.1, 0.2, ...]"
      embeddingVector = `[${embedding.join(',')}]`;
    } catch (e) {
      console.error('Failed to generate embedding for memory:', e);
      // We will still insert without vector if it fails, assuming db schema allows null
    }

    const { rows } = await db.query<MemoryRow>(
      `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata, embedding)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, content, type, importance, JSON.stringify(metadata), embeddingVector]
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
   * Search memories semantically using vector embeddings.
   */
  async searchMemories(
    userId: string,
    query: string,
    opts: { limit?: number; threshold?: number } = {}
  ): Promise<Array<UserMemory & { similarity: number }>> {
    const { limit = 5, threshold = 0.5 } = opts;

    try {
      const embeddingModel = await getEmbeddingModel();
      const { embedding } = await embed({
        model: embeddingModel,
        value: query,
      });

      const embeddingVector = `[${embedding.join(',')}]`;

      const { rows } = await db.query<any>(
        `SELECT * FROM match_memories($1, $2, $3, $4)`,
        [embeddingVector, threshold, limit, userId]
      );

      return rows.map((r: any) => ({
        id: r.id,
        userId,
        content: r.content,
        memoryType: r.memory_type,
        importance: r.importance,
        metadata: r.metadata || {},
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || new Date().toISOString(),
        similarity: r.similarity,
      }));
    } catch (error) {
      console.error('Semantic search failed, falling back to recent memories:', error);
      // Fallback
      return [];
    }
  },

  /**
   * Batch-store extracted memories from a conversation with embeddings.
   */
  async extractAndStore(
    userId: string,
    memories: Array<{ content: string; type: MemoryType; importance: number }>  
  ): Promise<void> {
    if (memories.length === 0) return;

    let embeddings: string[] = [];
    try {
      const embeddingModel = await getEmbeddingModel();
      const result = await embedMany({
        model: embeddingModel,
        values: memories.map(m => m.content),
      });
      embeddings = result.embeddings.map(e => `[${e.join(',')}]`);
    } catch (e) {
      console.error('Failed to generate embeddings for batch memories:', e);
      embeddings = memories.map(() => null as unknown as string); // fallback
    }

    const values: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    for (let i = 0; i < memories.length; i++) {
      const m = memories[i];
      const emb = embeddings[i];
      values.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
      params.push(userId, m.content, m.type, m.importance, emb);
      idx += 5;
    }

    await db.query(
      `INSERT INTO user_memory (user_id, content, memory_type, importance, embedding) VALUES ${values.join(', ')}`,
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
