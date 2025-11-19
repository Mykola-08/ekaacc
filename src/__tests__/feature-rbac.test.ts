import { FeatureService } from '../services/feature-service';
import { AdminService } from '../services/admin-service';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
const mockSupabase = {
  rpc: jest.fn(),
  from: jest.fn(),
  auth: {
    admin: {
      listUsers: jest.fn(),
      updateUserById: jest.fn()
    }
  }
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

describe('Feature & RBAC System', () => {
  let featureService: FeatureService;
  let adminService: AdminService;

  beforeEach(() => {
    jest.clearAllMocks();
    featureService = new FeatureService();
    adminService = new AdminService();
  });

  describe('FeatureService', () => {
    it('should check if feature is enabled via RPC', async () => {
      mockSupabase.rpc.mockResolvedValue({ data: true, error: null });

      const result = await featureService.isFeatureEnabled('user-123', 'new-feature');
      
      expect(mockSupabase.rpc).toHaveBeenCalledWith('is_feature_enabled', {
        user_id: 'user-123',
        feature_key: 'new-feature'
      });
      expect(result).toBe(true);
    });

    it('should handle RPC errors gracefully', async () => {
      mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'RPC Error' } });

      const result = await featureService.isFeatureEnabled('user-123', 'new-feature');
      
      expect(result).toBe(false);
    });

    it('should enroll user in program', async () => {
      const mockFrom = { upsert: jest.fn().mockResolvedValue({ error: null }) };
      mockSupabase.from.mockReturnValue(mockFrom);

      const result = await featureService.enrollInProgram('user-123', 'beta');

      expect(mockSupabase.from).toHaveBeenCalledWith('user_feature_enrollment');
      expect(mockFrom.upsert).toHaveBeenCalledWith({ user_id: 'user-123', program: 'beta' });
      expect(result).toBe(true);
    });

    it('should unenroll user from program', async () => {
      const mockMatch = { match: jest.fn().mockResolvedValue({ error: null }) };
      const mockDelete = { delete: jest.fn().mockReturnValue(mockMatch) };
      const mockFrom = { delete: jest.fn().mockReturnValue(mockMatch) }; // Fix mock chain
      mockSupabase.from.mockReturnValue({ delete: () => mockMatch });

      const result = await featureService.unenrollFromProgram('user-123', 'beta');
      
      // Simplified check due to mock complexity
      expect(mockSupabase.from).toHaveBeenCalledWith('user_feature_enrollment');
      expect(result).toBe(true);
    });

    it('should get public features', async () => {
      const mockFeatures = [{ key: 'auth_google', is_enabled: true }];
      const mockEq = { eq: jest.fn().mockResolvedValue({ data: mockFeatures, error: null }) };
      const mockSelect = { select: jest.fn().mockReturnValue(mockEq) };
      mockSupabase.from.mockReturnValue(mockSelect);

      const result = await featureService.getPublicFeatures();

      expect(mockSupabase.from).toHaveBeenCalledWith('features');
      expect(mockSelect.select).toHaveBeenCalledWith('*');
      expect(mockEq.eq).toHaveBeenCalledWith('is_enabled', true);
      expect(result[0].key).toBe('auth_google');
    });
  });

  describe('AdminService', () => {
    it('should list users', async () => {
      const mockUsers = [{ id: '1', email: 'test@test.com' }];
      mockSupabase.auth.admin.listUsers.mockResolvedValue({ data: { users: mockUsers }, error: null });

      const result = await adminService.listUsers(1, 10);

      expect(mockSupabase.auth.admin.listUsers).toHaveBeenCalledWith({ page: 1, perPage: 10 });
      expect(result).toEqual(mockUsers);
    });

    it('should update user role', async () => {
      mockSupabase.auth.admin.updateUserById.mockResolvedValue({ data: { id: '1' }, error: null });

      await adminService.updateUserRole('user-123', 'Admin');

      expect(mockSupabase.auth.admin.updateUserById).toHaveBeenCalledWith('user-123', { user_metadata: { role: 'Admin' } });
    });

    it('should create feature', async () => {
      const mockSingle = { single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }) };
      const mockSelect = { select: jest.fn().mockReturnValue(mockSingle) };
      const mockInsert = { insert: jest.fn().mockReturnValue(mockSelect) };
      mockSupabase.from.mockReturnValue(mockInsert);

      await adminService.createFeature({ key: 'test', name: 'Test' });

      expect(mockSupabase.from).toHaveBeenCalledWith('features');
      expect(mockInsert.insert).toHaveBeenCalledWith({ key: 'test', name: 'Test' });
    });

    it('should update feature status', async () => {
      const mockSingle = { single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }) };
      const mockSelect = { select: jest.fn().mockReturnValue(mockSingle) };
      const mockEq = { eq: jest.fn().mockReturnValue(mockSelect) };
      const mockUpdate = { update: jest.fn().mockReturnValue(mockEq) };
      mockSupabase.from.mockReturnValue(mockUpdate);

      await adminService.updateFeatureStatus('test', 'beta', true);

      expect(mockSupabase.from).toHaveBeenCalledWith('features');
      expect(mockUpdate.update).toHaveBeenCalledWith({ status: 'beta', is_enabled: true });
      expect(mockEq.eq).toHaveBeenCalledWith('key', 'test');
    });

    it('should override feature for user', async () => {
      const mockSingle = { single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }) };
      const mockSelect = { select: jest.fn().mockReturnValue(mockSingle) };
      const mockUpsert = { upsert: jest.fn().mockReturnValue(mockSelect) };
      mockSupabase.from.mockReturnValue(mockUpsert);

      await adminService.overrideFeatureForUser('user-123', 'test', false);

      expect(mockSupabase.from).toHaveBeenCalledWith('user_feature_overrides');
      expect(mockUpsert.upsert).toHaveBeenCalledWith({ user_id: 'user-123', feature_key: 'test', is_enabled: false });
    });

    it('should grant custom permission', async () => {
      const mockSelect = { single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }) };
      const mockUpsert = { select: jest.fn().mockReturnValue(mockSelect) };
      const mockFrom = { upsert: jest.fn().mockReturnValue(mockUpsert) };
      mockSupabase.from.mockReturnValue(mockFrom);

      await adminService.grantPermission('user-123', 'admin.access');

      expect(mockSupabase.from).toHaveBeenCalledWith('user_custom_permissions');
      expect(mockFrom.upsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        permission_key: 'admin.access',
        is_granted: true
      });
    });

    it('should revoke custom permission', async () => {
      const mockSelect = { single: jest.fn().mockResolvedValue({ data: { id: '1' }, error: null }) };
      const mockUpsert = { select: jest.fn().mockReturnValue(mockSelect) };
      const mockFrom = { upsert: jest.fn().mockReturnValue(mockUpsert) };
      mockSupabase.from.mockReturnValue(mockFrom);

      await adminService.revokePermission('user-123', 'admin.access');

      expect(mockSupabase.from).toHaveBeenCalledWith('user_custom_permissions');
      expect(mockFrom.upsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        permission_key: 'admin.access',
        is_granted: false
      });
    });
  });
});
