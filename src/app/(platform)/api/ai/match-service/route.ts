import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getSupabaseServiceRoleKey, getOpenAIApiKey } from '@/lib/config';

// Lazy initialization to avoid build-time errors
let supabase: SupabaseClient | null = null;

async function getSupabaseClient() {
  if (!supabase) {
    const serviceKey = await getSupabaseServiceRoleKey();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is required for this API route');
    }

    supabase = createClient(supabaseUrl, serviceKey);
  }
  return supabase;
}

export async function POST(req: Request) {
  try {
    const apiKey = await getOpenAIApiKey();
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 });
    }

    const openai = createOpenAI({
      apiKey,
    });

    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Get Supabase client with validation
    const client = await getSupabaseClient();

    // 1. Fetch active services
    const { data: services, error } = await client
      .from('service')
      .select('id, name, description, price, duration')
      .eq('active', true);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }

    if (!services || services.length === 0) {
      return NextResponse.json({ error: 'No services available' }, { status: 404 });
    }

    // 2. Use AI to match
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        serviceId: z.string().describe('The ID of the best matching service'),
        reason: z
          .string()
          .describe('A short, empathetic explanation of why this service is a good fit'),
        confidence: z.number().describe('Confidence score between 0 and 1'),
      }),
      prompt: `
        You are a helpful mental health intake assistant.
        User Query: "${query}"
        
        Available Services:
        ${JSON.stringify(services, null, 2)}
        
        Match the user's query to the most appropriate service. 
        If the user mentions specific symptoms (anxiety, depression) or needs (coaching, therapy), use that to guide the choice.
        If the query is vague, choose the most general consultation service.
        Keep the reason short, supportive, and clear (max 2 sentences).
      `,
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error('AI Match error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
