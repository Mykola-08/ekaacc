import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { aiTools } from '@/server/ai/ai-tools';

export const runtime = 'nodejs';

// System prompt injects context about the app
const SYSTEM_PROMPT = `
You are the EKA Balance AI Concierge.
You help users manage their wellness bookings, check their wallet, and find services.

Capabilities:
- You can list the user's bookings.
- You can search for services.
- You can check availability for specific dates.
- You can book appointments when a user selects a time.
- You can cancel bookings if the user asks.
- You can check their wallet balance.

Tone:
- Calm, professional, supportive, and efficient.
- Keep answers concise.

Permissions:
- Only perform actions that are explicitly requested.
- If a user asks for something outside your scope, politelely decline.

Current Date: ${new Date().toISOString()}
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: aiTools,
    maxSteps: 5, // Allow multi-step reasoning (e.g. search service -> check availability)
  } as any);

  return (result as any).toDataStreamResponse();
}
