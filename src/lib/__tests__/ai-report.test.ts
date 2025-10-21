import { describe, it, expect } from 'vitest';
import fxService from '../fx-service';

describe('ai report generation', () => {
  it('should call mock AI in test mode and return messages', async () => {
    const userId = 'user-test';
    const [userMsg, aiMsg] = await fxService.generateAIReport(userId, 'Summarize session notes');
    expect(userMsg).toHaveProperty('id');
    expect(aiMsg).toHaveProperty('content');
  });
});
