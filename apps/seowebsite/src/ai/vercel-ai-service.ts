export interface VercelAIRequest {
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  model?: 'openai' | 'anthropic' | 'google';
  context?: string;
  userId?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface VercelAIResponse {
  role: string;
  content: string;
  timestamp: string;
}

export const vercelAIService = {
  chat: async (_request: VercelAIRequest): Promise<VercelAIResponse> => {
    console.warn("vercelAIService.chat called (stub)");
    return {
      role: 'assistant',
      content: "This is a placeholder response from the AI.",
      timestamp: new Date().toISOString()
    };
  },
  generateText: async (_request: VercelAIRequest): Promise<VercelAIResponse> => {
    console.warn("vercelAIService.generateText called (stub)");
    return {
      role: 'assistant',
      content: "This is a placeholder response from the AI.",
      timestamp: new Date().toISOString()
    };
  }
};
