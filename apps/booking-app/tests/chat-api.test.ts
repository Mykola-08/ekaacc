import { vi, describe, it, expect } from 'vitest';
import { POST as chatHandler } from '@/app/api/chat/route';

// Mock ai and @ai-sdk/openai
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(),
}));

vi.mock('ai', () => ({
  streamText: vi.fn().mockResolvedValue({
    toTextStreamResponse: vi.fn().mockReturnValue(new Response('streamed response')),
  }),
}));

describe('chat api', () => {
  it('streams response', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
    });

    const res = await chatHandler(req);
    expect(res).toBeInstanceOf(Response);
  });
});
