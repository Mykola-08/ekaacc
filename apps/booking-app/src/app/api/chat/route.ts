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
- Booking: Search, check availability, book, cancel, preview booking
- Wellness: Log mood, view trends, set goals, insights, meditation, sleep insights, mood landscape
- Finance: Check wallet, rewards, transaction history
- Memory: Store and recall user info
- Journaling: Create and view entries
- Personalization: Greetings, affirmations, daily actions, progress reports, patterns, breathing exercises, achievements

## Visual Block Guidelines (CRITICAL)
Always prefer calling tools that generate Visual Blocks over sending plain text descriptions.
- **Booking Lists**: Use getMyBookings; the UI will handle grouping and sorting.
- **Booking Confidence**: Before finalizing a booking (bookAppointment), you MUST USE getBookingPreview to show the user a visual confirmation block.
- **Service Comparison**: If a user asks about multiple services, use compareServices to show them side-by-side.
- **Financial History**: Use getWalletHistory to display a stylized transaction list.

## Personalization & Tool Usage
- When starting a conversation, use getPersonalizedGreeting for a warm, contextual welcome
- Use generateAffirmation when user needs encouragement or is feeling down
- Suggest suggestDailyActions when asked what to do or for recommendations
- Show getProgressReport for weekly/monthly check-ins
- Use identifyPatterns if the user asks about their progress, habits, or cycles.
- Use suggestBreathingExercise if the user seems stressed, anxious, or explicitly asks for relaxation.
- Use celebrateAchievement periodically when the user reaches a milestone or shows consistency.
- Use startGuidedMeditation when the user needs a deeper relaxation session or asks to meditate.
- Use getSleepInsights if the user mentions poor sleep, tiredness, or asks for sleep advice.
- Use getInteractiveGoalTracker to show current progress on wellness goals.
- Use getMoodCalendar when the user wants to see a visual history of their mood.

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
  return Object.entries(aiTools).map(([name, tool]) => {
    const params = zodToJsonSchema(tool.parameters as any) as any;
    return {
      type: 'function' as const,
      function: {
        name,
        description: tool.description,
        parameters: params,
      },
    };
  });
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

  // ============================================================================
  // ALGORITHMIC ROUTING (Optimization)
  // ============================================================================
  const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content?.toLowerCase() || '';

  // Simple Greeting Intent
  const isSimpleGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|greeting|hi there|hello there)$/.test(lastUserMessage.trim());

  // Status/What can I do Intent
  const isStatusIntent = /^(what should i do|what to do today|daily actions|suggest something|how is my day|anything for me)$/.test(lastUserMessage.trim());

  // Wallet Intent
  const isWalletIntent = /^(wallet|balance|my wallet|how much money|transactions|wallet history)$/.test(lastUserMessage.trim());

  if (userId && (isSimpleGreeting || isStatusIntent || isWalletIntent)) {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let toolName = '';
          const toolArgs = {};
          let result: any = null;

          if (isSimpleGreeting && aiTools.getPersonalizedGreeting) {
            toolName = 'getPersonalizedGreeting';
            result = await aiTools.getPersonalizedGreeting.execute({});
          } else if (isStatusIntent && aiTools.suggestDailyActions) {
            toolName = 'suggestDailyActions';
            result = await aiTools.suggestDailyActions.execute({});
          } else if (isWalletIntent && aiTools.getWalletBalance) {
            toolName = 'getWalletBalance';
            result = await aiTools.getWalletBalance.execute({});
          }

          if (toolName && result) {
            // Push tool result directly
            controller.enqueue(encoder.encode(`0:${JSON.stringify({
              type: 'tool-result',
              toolName,
              args: toolArgs,
              result
            })}\n`));

            // Generate a simple algorithmic response text based on the result
            let responseText = '';
            if (isSimpleGreeting) {
              responseText = result.greeting || 'Hello! How can I help you today?';
              if (result.moodAcknowledgment) responseText += ' ' + result.moodAcknowledgment;
              if (result.contextTip) responseText += '\n\n' + result.contextTip;
            } else if (isStatusIntent) {
              responseText = "Here are some things you could focus on today:";
            } else if (isWalletIntent) {
              responseText = `You currently have ${result.balance} ${result.currency} in your wallet.`;
            }

            controller.enqueue(encoder.encode(`t:${responseText}\n`));
          }
          controller.close();
        } catch (err) {
          console.error('Algorithmic routing error:', err);
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  }
  // ============================================================================

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const currentMessages = [...fullMessages];
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

          const message = response.choices[0]?.message;

          if (message?.tool_calls && message.tool_calls.length > 0) {
            currentMessages.push(message as any);

            // Send neutral update to UI that tools are working (optional protocol chunk)
            // controller.enqueue(encoder.encode('__TOOL_CALLING__')); 

            for (const toolCall of message.tool_calls) {
              const toolName = (toolCall as any).function.name;
              const toolArgs = JSON.parse((toolCall as any).function.arguments);
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
