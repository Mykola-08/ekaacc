import { ConversationMessage } from './ai-conversation-service';

export interface HFAgentConfig {
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export class HuggingFaceAgent {
  private model: string;
  private apiKey: string;
  private temperature: number;
  private maxTokens: number;
  private baseUrl = 'https://api-inference.huggingface.co/models/';

  constructor(config: HFAgentConfig) {
    this.model = config.model || 'HuggingFaceH4/zephyr-7b-beta';
    this.apiKey = config.apiKey || process.env.HUGGINGFACE_API_KEY || '';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1024;

    if (!this.apiKey) {
      console.warn('HuggingFaceAgent: No API key provided. Requests may be rate-limited or fail.');
    }
  }

  /**
   * Generate a response from the agent
   */
  async generateResponse(messages: ConversationMessage[]): Promise<string> {
    const prompt = this.formatPrompt(messages);
    
    try {
      const response = await fetch(`${this.baseUrl}${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: this.temperature,
            max_new_tokens: this.maxTokens,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} ${error}`);
      }

      const result = await response.json();
      
      if (Array.isArray(result) && result.length > 0) {
        return result[0].generated_text;
      } else if (typeof result === 'object' && result.generated_text) {
        return result.generated_text;
      }
      
      return '';
    } catch (error) {
      console.error('HuggingFaceAgent error:', error);
      throw error;
    }
  }

  /**
   * Format messages into a prompt suitable for Zephyr/Mistral models
   * Uses the <|system|>, <|user|>, <|assistant|> format
   */
  private formatPrompt(messages: ConversationMessage[]): string {
    let prompt = '';
    
    // Add system message if present, or default
    const systemMessage = messages.find(m => m.role === 'system');
    if (systemMessage) {
      prompt += `<|system|>\n${systemMessage.content}</s>\n`;
    } else {
      prompt += `<|system|>\nYou are a helpful AI assistant.</s>\n`;
    }

    // Add conversation history
    for (const msg of messages) {
      if (msg.role === 'user') {
        prompt += `<|user|>\n${msg.content}</s>\n`;
      } else if (msg.role === 'assistant') {
        prompt += `<|assistant|>\n${msg.content}</s>\n`;
      }
    }

    // Add prompt for assistant to reply
    prompt += `<|assistant|>\n`;

    return prompt;
  }
}

export const hfAgent = new HuggingFaceAgent({
  model: 'HuggingFaceH4/zephyr-7b-beta'
});
