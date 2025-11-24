import { createClient } from '@supabase/supabase-js';
import { VercelAIService } from './vercel-ai-service';

export interface AgentMemory {
  id: string;
  content: string;
  type: 'observation' | 'preference' | 'fact' | 'interaction';
  metadata: Record<string, any>;
  importance: number;
  createdAt: Date;
}

export interface AgentAction {
  id: string;
  type: string;
  status: 'success' | 'failed';
  input: any;
  output: any;
  createdAt: Date;
}

export class AgentService {
  private supabase: any;
  private aiService: VercelAIService;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.aiService = new VercelAIService();
  }

  /**
   * Store a new memory for the user
   */
  async remember(userId: string, content: string, type: AgentMemory['type'] = 'observation', metadata: any = {}, importance: number = 1) {
    try {
      const embedding = await this.aiService.generateEmbedding(content);

      const { data, error } = await this.supabase
        .from('user_memory')
        .insert({
          user_id: userId,
          content,
          embedding,
          memory_type: type,
          metadata,
          importance
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing memory:', error);
      // Don't fail the whole request if memory storage fails, but log it
      return null;
    }
  }

  /**
   * Retrieve relevant memories based on a query
   */
  async recall(userId: string, query: string, limit: number = 5, threshold: number = 0.7) {
    try {
      const embedding = await this.aiService.generateEmbedding(query);

      const { data, error } = await this.supabase.rpc('match_user_memory', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
        p_user_id: userId
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error recalling memories:', error);
      return [];
    }
  }

  /**
   * Search the general knowledge base
   */
  async searchKnowledge(query: string, limit: number = 3, threshold: number = 0.7) {
    try {
      const embedding = await this.aiService.generateEmbedding(query);

      const { data, error } = await this.supabase.rpc('match_knowledge_base', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }
  }

  /**
   * Add to knowledge base (Admin only usually, but here for seeding)
   */
  async addToKnowledgeBase(content: string, category: string, metadata: any = {}) {
     try {
      const embedding = await this.aiService.generateEmbedding(content);

      const { data, error } = await this.supabase
        .from('knowledge_base')
        .insert({
          content,
          embedding,
          category,
          metadata
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to knowledge base:', error);
      return null;
    }
  }

  /**
   * Log an action performed by the agent
   */
  async logAction(userId: string, actionType: string, input: any, output: any, status: 'success' | 'failed' = 'success') {
    try {
      const { data, error } = await this.supabase
        .from('agent_actions')
        .insert({
          user_id: userId,
          action_type: actionType,
          input_data: input,
          output_data: output,
          status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging action:', error);
      return null;
    }
  }

  /**
   * Main agent loop to process a user request with context
   */
  async processRequest(userId: string, request: string) {
    // 1. Recall relevant memories
    const memories = await this.recall(userId, request);
    
    // 2. Search knowledge base
    const knowledge = await this.searchKnowledge(request);

    // 3. Construct context
    const context = {
      memories: memories.map((m: any) => m.content).join('\n'),
      knowledge: knowledge.map((k: any) => k.content).join('\n'),
      timestamp: new Date().toISOString()
    };

    // 4. Generate response/plan using AI
    const response = await this.aiService.generateText({
      prompt: request,
      context: `
        Relevant User Memories:
        ${context.memories}

        Relevant Knowledge Base:
        ${context.knowledge}
      `,
      userId,
      model: 'openai' // or 'o1' for reasoning
    });

    // 5. Store the interaction as a memory
    await this.remember(userId, `User asked: ${request}. Agent answered: ${response.content}`, 'interaction', { request, response: response.content });

    return {
      response: response.content,
      sources: {
        memories,
        knowledge
      }
    };
  }
}
