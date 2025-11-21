import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../app/api/admin/tiers/assign/route';
import { GET } from '../app/api/admin/tiers/assign/route';
import { getTierValidationService } from '../services/tier-validation-service';

// Mock dependencies
jest.mock('../lib/supabase', () => {
  const supabaseMock = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  } as any;

  return {
    supabase: supabaseMock,
  };
});
jest.mock('../services/tier-validation-service');

const { supabase: mockSupabase } = jest.requireMock('../lib/supabase');

// Mock NextResponse
jest.mock('next/server', () => {
  class MockResponse {
    status: number;
    body: string;
    headers: Map<string, string>;

    constructor(body: any, init?: any) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map();
      if (init?.headers) {
         Object.entries(init.headers).forEach(([key, value]) => {
            this.headers.set(key, value as string);
         });
      }
    }

    async json() {
      return JSON.parse(this.body);
    }
  }

  return {
    NextRequest: class MockNextRequest {
      headers: Map<string, string>;
      body: any;
      url: string;
      
      constructor(input: any, init?: any) {
        this.url = input.toString();
        this.headers = new Map();
        if (init?.headers) {
          Object.entries(init.headers).forEach(([key, value]) => {
            this.headers.set(key, value as string);
          });
        }
        this.body = init?.body;
      }
      
      async json() {
        return JSON.parse(this.body as string);
      }
    },
    NextResponse: {
      json: (data: any, init?: any) => {
        return new MockResponse(JSON.stringify(data), {
          ...init,
          headers: {
            ...init?.headers,
            'content-type': 'application/json',
          },
        });
      },
    },
  };
});

describe('Tier Assignment API', () => {
  let mockValidationService: jest.Mocked<any>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockValidationService = {
      validateVIPTierEligibility: jest.fn(),
      validateLoyaltyTierEligibility: jest.fn(),
    };

    (getTierValidationService as jest.Mock).mockResolvedValue(mockValidationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockGetRequest = (userId: string, token = 'valid-token') => {
    const url = new URL(`http://localhost:3000/api/admin/tiers/assign?userId=${userId}`);
    return new NextRequest(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  };

  const createMockRequest = (body: any, token = 'valid-token') => {
    return new NextRequest('http://localhost:3000/api/admin/tiers/assign', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  describe('POST /api/admin/tiers/assign', () => {

    it('should successfully assign VIP Silver tier', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };
      const mockValidationResult = {
        isEligible: true,
        requirements: [],
        progress: 100,
      };

      // Mock authentication
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });

      // Mock validation
      mockValidationService.validateVIPTierEligibility.mockResolvedValue(mockValidationResult);

      // Mock database operations
      mockSupabase.single
        .mockResolvedValueOnce({ data: mockUserRole, error: null }) // Admin check
        .mockResolvedValueOnce({ data: null, error: null }) // No existing tier
        .mockResolvedValueOnce({ 
          data: { 
            id: 'new-tier-123',
            user_id: 'user-456',
            tier_type: 'vip',
            tier_name: 'silver',
            is_active: true,
          }, 
          error: null 
        }); // Insert new tier

      const request = createMockRequest({
        userId: 'user-456',
        tierType: 'vip',
        tierName: 'silver',
        reason: 'Test assignment',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.tier_name).toBe('silver');
      expect(data.message).toContain('Successfully assigned');
    });

    it('should reject request without authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/tiers/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('No valid authorization header');
    });

    it('should reject non-admin users', async () => {
      const mockUser = { id: 'user-123', email: 'user@test.com' };
      const mockUserRole = { role: 'Patient' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: mockUserRole, error: null });

      const request = createMockGetRequest('user-456');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Insufficient permissions');
    });

    it('should validate required fields', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: mockUserRole, error: null });

      const request = createMockRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should validate tier type and name', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: mockUserRole, error: null });

      const request = createMockRequest({
        userId: 'user-456',
        tierType: 'vip',
        tierName: 'invalid-tier',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid VIP tier name');
    });

    it('should reject when user does not meet tier requirements', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };
      const mockValidationResult = {
        isEligible: false,
        missingRequirements: ['Need more sessions', 'Higher rating required'],
        progress: 45,
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: mockUserRole, error: null });
      mockValidationService.validateVIPTierEligibility.mockResolvedValue(mockValidationResult);

      const request = createMockRequest({
        userId: 'user-456',
        tierType: 'vip',
        tierName: 'gold',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('User does not meet tier requirements');
      expect(data.requirements).toEqual(mockValidationResult.missingRequirements);
      expect(data.progress).toBe(mockValidationResult.progress);
    });

    it('should reject when user already has the tier', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };
      const mockValidationResult = { isEligible: true, requirements: [], progress: 100 };
      const existingTier = {
        id: 'existing-tier-123',
        user_id: 'user-456',
        tier_type: 'vip',
        tier_name: 'silver',
        is_active: true,
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockValidationService.validateVIPTierEligibility.mockResolvedValue(mockValidationResult);
      
      mockSupabase.single
        .mockResolvedValueOnce({ data: mockUserRole, error: null }) // Admin check
        .mockResolvedValueOnce({ data: existingTier, error: null }); // Existing tier check

      const request = createMockRequest({
        userId: 'user-456',
        tierType: 'vip',
        tierName: 'silver',
        reason: 'Test assignment',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('User already has this tier assigned');
    });

    it('should handle database errors gracefully', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };
      const mockValidationResult = { isEligible: true, requirements: [], progress: 100 };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockValidationService.validateVIPTierEligibility.mockResolvedValue(mockValidationResult);
      
      mockSupabase.single
        .mockResolvedValueOnce({ data: mockUserRole, error: null }) // Admin check
        .mockResolvedValueOnce({ data: null, error: null }) // Existing tier check
        .mockRejectedValueOnce(new Error('Database error')); // Insert error

      const request = createMockRequest({
        userId: 'user-456',
        tierType: 'vip',
        tierName: 'silver',
        reason: 'Test assignment',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('GET /api/admin/tiers/assign', () => {
    const createMockGetRequest = (userId: string, token = 'valid-token') => {
      const url = new URL(`http://localhost:3000/api/admin/tiers/assign?userId=${userId}`);
      return new NextRequest(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    };

    it('should successfully fetch user tiers', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };
      const mockTiers = [
        {
          id: 'tier-1',
          user_id: 'user-456',
          tier_type: 'vip',
          tier_name: 'silver',
          is_active: true,
          assigned_at: '2024-01-15T10:30:00Z',
        },
        {
          id: 'tier-2',
          user_id: 'user-456',
          tier_type: 'loyalty',
          tier_name: 'member',
          is_active: true,
          assigned_at: '2024-01-10T14:20:00Z',
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: mockUserRole, error: null });
      mockSupabase.order.mockReturnValue({ data: mockTiers, error: null });

      const request = createMockGetRequest('user-456');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockTiers);
    });

    it('should require userId parameter', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: mockUserRole, error: null });

      const url = new URL('http://localhost:3000/api/admin/tiers/assign');
      const request = new NextRequest(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId parameter is required');
    });

    it('should handle database errors when fetching tiers', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockUserRole = { role: 'Admin' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: mockUserRole, error: null });
      mockSupabase.order.mockReturnValue({ data: null, error: new Error('Database error') });

      const request = createMockGetRequest('user-456');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch user tiers');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid authorization tokens', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('Invalid token') });

      const request = createMockGetRequest('user-456', 'invalid-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should handle missing user role data', async () => {
      const mockAdminUser = { id: 'admin-123', email: 'admin@test.com' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
      mockSupabase.single.mockResolvedValue({ data: null, error: null });

      const request = createMockRequest({
        userId: 'user-456',
        tierType: 'vip',
        tierName: 'silver',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Insufficient permissions');
    });

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = createMockRequest({
        userId: 'user-456',
        tierType: 'vip',
        tierName: 'silver',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});