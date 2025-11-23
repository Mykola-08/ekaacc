import { AgentService } from '../ai/agent-service';
import { VercelAIService } from '../ai/vercel-ai-service';
import { createClient } from '@supabase/supabase-js';

// Mock dependencies
jest.mock('../ai/vercel-ai-service');
jest.mock('@supabase/supabase-js');

describe('AgentService', () => {
  let agentService: AgentService;
  let mockSupabase: any;
  let mockVercelAI: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup Supabase mock
    mockSupabase = {
      from: jest.fn(),
      rpc: jest.fn(),
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Setup VercelAIService mock
    mockVercelAI = {
      generateEmbedding: jest.fn(),
    };
    (VercelAIService as jest.Mock).mockImplementation(() => mockVercelAI);

    agentService = new AgentService();
  });

  describe('remember', () => {
    it('should store a memory successfully', async () => {
      const userId = 'user-123';
      const content = 'User likes blue';
      const embedding = [0.1, 0.2, 0.3];
      const mockData = { id: 'mem-1', content };

      mockVercelAI.generateEmbedding.mockResolvedValue(embedding);
      
      const mockSingle = { single: jest.fn().mockResolvedValue({ data: mockData, error: null }) };
      const mockSelect = { select: jest.fn().mockReturnValue(mockSingle) };
      const mockInsert = { insert: jest.fn().mockReturnValue(mockSelect) };
      mockSupabase.from.mockReturnValue(mockInsert);

      const result = await agentService.remember(userId, content);

      expect(mockVercelAI.generateEmbedding).toHaveBeenCalledWith(content);
      expect(mockSupabase.from).toHaveBeenCalledWith('user_memory');
      expect(mockInsert.insert).toHaveBeenCalledWith({
        user_id: userId,
        content,
        embedding,
        memory_type: 'observation',
        metadata: {},
        importance: 1
      });
      expect(result).toEqual(mockData);
    });

    it('should handle errors gracefully', async () => {
      mockVercelAI.generateEmbedding.mockRejectedValue(new Error('AI Error'));
      
      const result = await agentService.remember('user-1', 'test');
      
      expect(result).toBeNull();
    });
  });

  describe('recall', () => {
    it('should recall memories successfully', async () => {
      const userId = 'user-123';
      const query = 'What does user like?';
      const embedding = [0.1, 0.2, 0.3];
      const mockMemories = [{ id: 'mem-1', content: 'User likes blue' }];

      mockVercelAI.generateEmbedding.mockResolvedValue(embedding);
      mockSupabase.rpc.mockResolvedValue({ data: mockMemories, error: null });

      const result = await agentService.recall(userId, query);

      expect(mockVercelAI.generateEmbedding).toHaveBeenCalledWith(query);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('match_user_memory', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5,
        p_user_id: userId
      });
      expect(result).toEqual(mockMemories);
    });

    it('should return empty array on error', async () => {
      mockVercelAI.generateEmbedding.mockRejectedValue(new Error('AI Error'));
      
      const result = await agentService.recall('user-1', 'test');
      
      expect(result).toEqual([]);
    });
  });

  describe('searchKnowledge', () => {
    it('should search knowledge base successfully', async () => {
      const query = 'How to reset password?';
      const embedding = [0.1, 0.2, 0.3];
      const mockKnowledge = [{ id: 'kb-1', content: 'Go to settings' }];

      mockVercelAI.generateEmbedding.mockResolvedValue(embedding);
      mockSupabase.rpc.mockResolvedValue({ data: mockKnowledge, error: null });

      const result = await agentService.searchKnowledge(query);

      expect(mockVercelAI.generateEmbedding).toHaveBeenCalledWith(query);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('match_knowledge_base', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 3
      });
      expect(result).toEqual(mockKnowledge);
    });
  });
});
