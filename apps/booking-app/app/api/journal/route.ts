import { NextResponse } from 'next/server';
import { AIMemoryService, AIJournalAnalyzer } from '@ekaacc/ai-services';
import { supabaseServer } from '@/lib/supabaseServerClient';

export async function POST(req: Request) {
  try {
    const { userId, content } = await req.json();

    if (!userId || !content) {
      return NextResponse.json({ error: 'Missing userId or content' }, { status: 400 });
    }

    const analyzer = new AIJournalAnalyzer();
    // We pass a temporary ID for analysis; the real ID comes from the DB if we were storing it in a 'journal_entries' table first.
    // Here we just store it as a memory.
    const analysis = await analyzer.analyzeEntry('temp-id', content);

    const memoryService = new AIMemoryService({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key: process.env.SUPABASE_SERVICE_ROLE_KEY!
    });
    
    // Store as memory with analysis metadata
    const memory = await memoryService.storeJournalEntry(userId, 'temp-id', content, analysis);

    return NextResponse.json({ success: true, memory, analysis });
  } catch (error: any) {
    console.error('Journal error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
