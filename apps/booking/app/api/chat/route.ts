import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are a helpful assistant for Eka Booking. 
    You help users find services and answer questions about the booking app.
    The available services are generally: Haircut ($25, 30min), Massage ($80, 60min), and Manicure ($35, 45min).
    Be polite and concise.`,
  });

  return result.toTextStreamResponse();
}
