import { GET } from '@/app/api/status/route';
import { createClient } from '@/lib/supabase/server';
import { getPayloadClient } from '@/lib/payload';
import { NextResponse, NextRequest } from 'next/server';

// Mock dependencies
const mockGetUser = jest.fn();
const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabase)),
}));

jest.mock('@/lib/payload', () => ({
  getPayloadClient: jest.fn(),
}));

jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: jest.fn((data) => ({ json: () => Promise.resolve(data) })),
      next: jest.fn(),
    },
  };
});

// Polyfill Request/Response if missing (for Node environment)
if (!global.Request) {
  global.Request = class Request {
    url: string;
    method: string;
    headers: Headers;
    constructor(input: string | Request, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
    }
  } as any;
}

if (!global.Response) {
  global.Response = class Response {
    constructor() {}
  } as any;
}

if (!global.Headers) {
  global.Headers = class Headers {
    constructor(init?: any) {}
  } as any;
}

// Mock global fetch
global.fetch = jest.fn();

describe('Status API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns status data for unauthenticated user', async () => {
    // Mock session as null (unauthenticated)
    mockGetUser.mockResolvedValue({ data: { user: null } });

    // Mock Payload client
    const mockPayload = {
      find: jest.fn().mockResolvedValue({ docs: [] }),
    };
    (getPayloadClient as jest.Mock).mockResolvedValue(mockPayload);

    // Mock external service check
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    const req = new NextRequest('http://localhost/api/status');
    const response = await GET(req);
    const data = await response.json();

    expect(data.userRole).toBe('Guest');
    expect(data.services).toBeDefined();
    expect(data.metrics).toBeDefined();
    
    // Check that latency is hidden/obfuscated for guests
    const backendService = data.services.find((s: any) => s.id === 'backend');
    expect(backendService.latency).toBeUndefined();
    
    const dbService = data.services.find((s: any) => s.id === 'database');
    expect(dbService.latency).toBeUndefined();
  });

  it('returns detailed status data for authenticated user', async () => {
    // Mock session with user (authenticated)
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user123' } },
    });

    // Mock Payload client
    const mockPayload = {
      find: jest.fn().mockResolvedValue({ docs: [] }),
    };
    (getPayloadClient as jest.Mock).mockResolvedValue(mockPayload);

    // Mock external service check
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    const req = new NextRequest('http://localhost/api/status');
    const response = await GET(req);
    const data = await response.json();

    expect(data.userRole).toBe('Admin/User');
    
    // Check that latency is present for authenticated users
    const backendService = data.services.find((s: any) => s.id === 'backend');
    expect(backendService.latency).toBeDefined();
    
    const dbService = data.services.find((s: any) => s.id === 'database');
    expect(dbService.latency).toBeDefined();
  });

  it('handles database connection failure', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    // Mock Payload client failure
    (getPayloadClient as jest.Mock).mockRejectedValue(new Error('DB Connection Failed'));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    const req = new NextRequest('http://localhost/api/status');
    const response = await GET(req);
    const data = await response.json();

    const dbService = data.services.find((s: any) => s.id === 'database');
    expect(dbService.status).toBe('degraded');
  });

  it('handles external service failure', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const mockPayload = {
      find: jest.fn().mockResolvedValue({ docs: [] }),
    };
    (getPayloadClient as jest.Mock).mockResolvedValue(mockPayload);

    // Mock external service failure
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const req = new NextRequest('http://localhost/api/status');
    const response = await GET(req);
    
    expect(response).toBeDefined();
  });
});
