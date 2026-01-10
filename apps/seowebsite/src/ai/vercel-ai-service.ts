export interface VercelAIRequest {
  messages: any[];
  model?: 'openai' | 'anthropic' | 'google';
  context?: any;
  userId?: string;
}

export const vercelAIService = {
  chat: async (request: VercelAIRequest) => {
    console.warn("vercelAIService.chat called (stub)");
    return {
      role: 'assistant',
      content: "This is a placeholder response from the AI."
    };
  }
};
