import OpenAI from 'openai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { aiTools } from '@/server/ai/ai-tools';
import { buildUserContext, formatContextForAI, extractAndStoreLearnings, updateUserBehaviorPatterns } from '@/server/ai/user-context-service';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_INSTRUCTIONS = `
## Core Identity
You are EKA Balance, a compassionate AI wellness companion. You support users on their mental health and wellness journey through booking, tracking, and personalized guidance.

## Memory & Personalization Protocol
### What to Remember
- User's name and preferences
- Wellness goals and reasons for seeking help
- Service preferences and life circumstances
- Emotional patterns and past interactions

### How to Use Memory
- Reference past conversations naturally
- Acknowledge progress and changes
- Anticipate needs based on patterns
- Personalize recommendations

When you learn something new about the user, use the rememberThis tool.

## Capabilities
- Booking: Search, check availability, book, cancel
- Wellness: Log mood, view trends, set goals, insights
- Finance: Check wallet and rewards
- Memory: Store and recall user info
- Journaling: Create and view entries

## Communication Guidelines
- Warm, empathetic, and supportive tone
- Professional but approachable
- Concise unless the user prefers detail
- Crisis Awareness: Suggest professional help if self-harm or severe distress is mentioned.

## Response Format
- Keep responses concise
- Use bullet points for lists
- End with a clear next step
`;

const buildSystemPrompt = (userContext: string) => `
${AI_INSTRUCTIONS}

## Current User Context
${userContext || 'No user context available - this may be a new user or guest.'}

## Current Date & Time
${new Date().toISOString()}
Local time context: ${new Date().toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true })}
`;

// Helper to convert AI tools to OpenAI tool format
const getTools = () => {
  return Object.entries(aiTools).map(([name, tool]) => ({
    type: 'function' as const,
    function: {
      name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.parameters),
    },
  }));
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  let userContextString = '';
  let userId: string | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      const context = await buildUserContext(user.id);
      if (context) userContextString = formatContextForAI(context);
    }
  } catch (e) {
    console.error('Error fetching context:', e);
  }

  const systemPrompt = buildSystemPrompt(userContextString);
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let currentMessages = [...fullMessages];
        let retryCount = 0;
        const maxRetries = 10;

        while (retryCount < maxRetries) {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: currentMessages as any,
            tools: getTools(),
            tool_choice: 'auto',
            stream: false, // We'll handle tool calls first, then stream the final response
          });

          const message = response.choices[0].message;

          if (message.tool_calls && message.tool_calls.length > 0) {
            currentMessages.push(message as any);

            // Send neutral update to UI that tools are working (optional protocol chunk)
            // controller.enqueue(encoder.encode('__TOOL_CALLING__')); 

            for (const toolCall of message.tool_calls) {
              const toolName = toolCall.function.name;
              const toolArgs = JSON.parse(toolCall.function.arguments);
              const tool = aiTools[toolName];

              let result;
              if (tool) {
                try {
                  result = await tool.execute(toolArgs);
                } catch (e: any) {
                  result = { error: e.message || 'Tool execution failed' };
                }
              } else {
                result = { error: 'Tool not found' };
              }

              currentMessages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: JSON.stringify(result),
              } as any);

              // Push the tool result to the stream as well so UI can render it
              controller.enqueue(encoder.encode(`0:${JSON.stringify({
                type: 'tool-result',
                toolName,
                args: toolArgs,
                result
              })}\n`));
            }
            retryCount++;
            continue;
          }

          // Final response from assistant
          const finalResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: currentMessages as any,
            stream: true,
          });

          let fullText = '';
          for await (const chunk of finalResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              controller.enqueue(encoder.encode(`t:${content}\n`));
            }
          }

          // Handle onFinish logic manually
          if (userId && messages.length > 0) {
            const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
            if (lastUserMessage?.content) {
              extractAndStoreLearnings(userId, lastUserMessage.content, fullText).catch(() => { });
              if (Math.random() < 0.1) {
                updateUserBehaviorPatterns(userId).catch(() => { });
              }
            }
          }

          break;
        }
        controller.close();
      } catch (err: any) {
        console.error('Stream error:', err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
