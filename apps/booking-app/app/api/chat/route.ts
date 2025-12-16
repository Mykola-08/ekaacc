import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { AIMemoryService } from '@ekaacc/ai-services';
import { supabaseServer } from '@/lib/supabaseServerClient';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  let systemPrompt = `You are a helpful assistant for Eka Booking. 
    You help users find services and answer questions about the booking app.
    The available services are generally: Haircut ($25, 30min), Massage ($80, 60min), and Manicure ($35, 45min).
    Be polite and concise.`;

  if (userId) {
    try {
      const memoryService = new AIMemoryService({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        key: process.env.SUPABASE_SERVICE_ROLE_KEY!
      });
      const lastMessage = messages[messages.length - 1]?.content || '';
      
      if (lastMessage) {
        const memories = await memoryService.retrieveMemories(userId, lastMessage);
        if (memories.length > 0) {
          const context = memories.map((m: any) => `- ${m.content}`).join('\n');
          systemPrompt += `\n\nContext from user's past interactions/memories:\n${context}\n\nUse this context to personalize your response if relevant.`;
        }
      }
    } catch (error) {
      console.error('Failed to retrieve memories:', error);
    }
  }

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: systemPrompt,
  });

  return result.toTextStreamResponse();
}
