import { describe, it, expect } from 'vitest';
import fxService from '../fx-service';

describe('booking update', () => {
  it('should update booking therapist in mock mode', async () => {
    // create a booking
    const b = await fxService.createBooking('user-test', 'therapist-old', new Date().toISOString());
    expect(b).toHaveProperty('id');
    // update booking
    const updated = await fxService.updateBooking(b.id, { therapistId: 'therapist-new' });
    expect(updated).toHaveProperty('therapistId');
    expect((updated as any).therapistId).toBe('therapist-new');
  });
});
