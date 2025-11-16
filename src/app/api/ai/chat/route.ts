import { NextRequest, NextResponse } from 'next/server';
import { AISDKNextService } from '@/ai/ai-sdk-next-service';
import { auth } from '@clerk/nextjs/server';

const aiService = new AISDKNextService();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, subscriptionTier, context, stream } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    if (!subscriptionTier || !['basic', 'premium', 'vip'].includes(subscriptionTier)) {
      return NextResponse.json({ error: 'Valid subscription tier is required' }, { status: 400 });
    }

    const request = {
      userId,
      messages,
      subscriptionTier: subscriptionTier as 'basic' | 'premium' | 'vip',
      context: context || {},
      stream: stream || false
    };

    if (stream) {
      const response = await aiService.processChatRequest(request);
      
      // Create a streaming response
      const encoder = new TextEncoder();
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            if (response.stream) {
              for await (const chunk of response.stream) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        }
      });

      return new Response(streamResponse, {
        headers: {
          'Content-Type': 'text/stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-AI-Daily-Usage': response.usage?.daily?.toString() || '0',
          'X-AI-Limit': response.usage?.limit?.toString() || '0'
        }
      });
    } else {
      const response = await aiService.processChatRequest(request);
      
      return NextResponse.json(response, {
        headers: {
          'X-AI-Daily-Usage': response.usage?.daily?.toString() || '0',
          'X-AI-Limit': response.usage?.limit?.toString() || '0'
        }
      });
    }
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subscriptionTier = searchParams.get('tier') as 'basic' | 'premium' | 'vip';

    if (!subscriptionTier || !['basic', 'premium', 'vip'].includes(subscriptionTier)) {
      return NextResponse.json({ error: 'Valid subscription tier is required' }, { status: 400 });
    }

    // Get usage statistics
    const usage = await aiService.getUsageStats(userId, subscriptionTier);
    
    return NextResponse.json({ usage });
  } catch (error) {
    console.error('AI Usage API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}