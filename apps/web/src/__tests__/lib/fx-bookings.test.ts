import { fxBookings } from '@/lib/fx-bookings';
import { safeSupabaseInsert, safeSupabaseQuery, safeSupabaseUpdate } from '@/lib/supabase-utils';

// Mock Supabase client with proper chainable mock
const mockSupabaseChain = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
};

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseChain,
}));

jest.mock('@/lib/supabase-utils', () => ({
  safeSupabaseInsert: jest.fn(),
  safeSupabaseQuery: jest.fn(),
  safeSupabaseUpdate: jest.fn(),
}));

describe('fxBookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset chain mocks
    mockSupabaseChain.from.mockReturnThis();
    mockSupabaseChain.select.mockReturnThis();
    mockSupabaseChain.eq.mockReturnThis();
  });

  describe('createBooking', () => {
    it('should create booking successfully', async () => {
      const userId = 'user-1';
      const therapistId = 'therapist-1';
      const date = '2023-01-01';
      const notes = 'Test notes';
      const mockBooking = { id: 'booking-1', user_id: userId };

      (safeSupabaseInsert as jest.Mock).mockResolvedValue({ data: mockBooking, error: null });

      const result = await fxBookings.createBooking(userId, therapistId, date, notes);

      expect(result).toEqual(mockBooking);
      expect(safeSupabaseInsert).toHaveBeenCalledWith(
        'appointments',
        expect.objectContaining({
          user_id: userId,
          practitioner_id: therapistId,
          date,
          notes,
          status: 'upcoming'
        })
      );
    });

    it('should throw error when creation fails', async () => {
      (safeSupabaseInsert as jest.Mock).mockResolvedValue({ data: null, error: new Error('Insert failed') });

      await expect(fxBookings.createBooking('u1', 't1', 'date')).rejects.toThrow('Failed to create booking');
    });
  });

  describe('getBookingsForUser', () => {
    it('should fetch user bookings successfully', async () => {
      const userId = 'user-1';
      const mockBookings = [{ id: 'booking-1' }];
      (safeSupabaseQuery as jest.Mock).mockResolvedValue({ data: mockBookings, error: null });

      const result = await fxBookings.getBookingsForUser(userId);

      expect(result).toEqual(mockBookings);
      expect(mockSupabaseChain.from).toHaveBeenCalledWith('appointments');
      expect(mockSupabaseChain.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseChain.eq).toHaveBeenCalledWith('user_id', userId);
    });

    it('should throw error when fetch fails', async () => {
      (safeSupabaseQuery as jest.Mock).mockResolvedValue({ data: null, error: new Error('Fetch failed') });

      await expect(fxBookings.getBookingsForUser('user-1')).rejects.toThrow('Failed to fetch user bookings');
    });
  });
});
