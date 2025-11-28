import { fxUsers } from '@/lib/fx-users';
import { safeSupabaseQuery, safeSupabaseUpdate } from '@/lib/supabase-utils';

// Mock Supabase client with proper chainable mock
const mockSupabaseChain = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
};

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseChain,
}));

jest.mock('@/lib/supabase-utils', () => ({
  safeSupabaseQuery: jest.fn(),
  safeSupabaseUpdate: jest.fn(),
}));

describe('fxUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset chain mocks
    mockSupabaseChain.from.mockReturnThis();
    mockSupabaseChain.select.mockReturnThis();
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [{ id: '1', email: 'test@example.com' }];
      (safeSupabaseQuery as jest.Mock).mockResolvedValue({ data: mockUsers, error: null });

      const result = await fxUsers.getUsers();

      expect(result).toEqual(mockUsers);
      expect(mockSupabaseChain.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseChain.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseChain.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('DB Error');
      (safeSupabaseQuery as jest.Mock).mockResolvedValue({ data: null, error: mockError });

      await expect(fxUsers.getUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const userId = '123';
      const newRole = 'admin';
      const mockData = { id: userId, role: newRole };
      
      (safeSupabaseUpdate as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      const result = await fxUsers.updateUserRole(userId, newRole);

      expect(result).toEqual(mockData);
      expect(safeSupabaseUpdate).toHaveBeenCalledWith(
        'users',
        { 
          profile_data: {
            role: newRole
          }
        },
        { id: userId }
      );
    });

    it('should throw error when update fails', async () => {
      (safeSupabaseUpdate as jest.Mock).mockResolvedValue({ data: null, error: new Error('Update failed') });

      await expect(fxUsers.updateUserRole('123', 'admin')).rejects.toThrow('Failed to update user role');
    });
  });
});
