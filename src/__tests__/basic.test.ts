import { describe, it, expect } from 'vitest';

describe('Basic arithmetic', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should multiply numbers correctly', () => {
    expect(3 * 4).toBe(12);
  });
});
