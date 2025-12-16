import { SupabaseClient, createClient } from '@supabase/supabase-js';

export interface MemoryItem {
  id: string;
  content: string;
  similarity?: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

export class AIMemoryService {
  private supabase: SupabaseClient;

  constructor(clientOrConfig: SupabaseClient | { url: string; key: string }) {
    if ('url' in clientOrConfig && 'key' in clientOrConfig) {
      this.supabase = createClient(clientOrConfig.url, clientOrConfig.key);
    } else {
      this.supabase = clientOrConfig as SupabaseClient;
    }
  }

  /**
   * Store a new memory (observation, fact, journal entry)
   */
  async storeMemory(
    userId: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<MemoryItem> {
    const { data, error } = await this.supabase.functions.invoke('ai-memory', {
      body: {
        action: 'store',
        userId,
        content,
        metadata
      }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return data.data[0];
  }

  /**
   * Retrieve relevant memories based on a query
   */
  async retrieveMemories(
    userId: string,
    query: string,
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<MemoryItem[]> {
    const { data, error } = await this.supabase.functions.invoke('ai-memory', {
      body: {
        action: 'retrieve',
        userId,
        query,
        match_count: limit,
        match_threshold: threshold
      }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return data.data;
  }

  /**
   * Store a journal entry as a memory
   */
  async storeJournalEntry(userId: string, entryId: string, content: string, analysis: any) {
    return this.storeMemory(userId, content, {
      type: 'journal_entry',
      entryId,
      sentiment: analysis.sentiment.overall,
      themes: analysis.themes.map((t: any) => t.theme)
    });
  }
}
