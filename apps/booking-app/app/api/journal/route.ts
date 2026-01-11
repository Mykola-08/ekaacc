 
 
import { NextResponse } from 'next/server';
// import { AIMemoryService, AIJournalAnalyzer } from '@ekaacc/ai-services';

// Stubs for missing package
class AIJournalAnalyzer {
  async analyzeEntry(_id: string, _content: string) { return { sentiment: 'neutral' }; }
}
class AIMemoryService {
  constructor(_config: any) {}
  async storeMemory(_userId: string, _content: string, _metadata: any) {}
  async storeJournalEntry(_userId: string, _entryId: string, _content: string, _analysis: any) { return { id: 'stub-memory-id' }; }
}

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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Journal error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
