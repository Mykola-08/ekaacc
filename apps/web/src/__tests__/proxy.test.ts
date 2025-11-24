/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse, NextRequest } from 'next/server';

// Polyfills
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
    }
  } as any;
}
if (!global.Headers) {
  global.Headers = class Headers extends Map {
    get(name) { return super.get(name.toLowerCase()); }
    set(name, value) { super.set(name.toLowerCase(), value); }
    forEach(callback) { super.forEach(callback); }
  } as any;
}
if (!global.Response) {
  global.Response = class Response {
    constructor(body, init) {
      this.headers = new Headers(init?.headers);
      this.status = init?.status || 200;
    }
  } as any;
}

// Mock dependencies
jest.mock('@auth0/nextjs-auth0/edge', () => ({
  getSession: jest.fn(),
}));

jest.mock('@/lib/supabase-middleware', () => ({
  createClient: jest.fn((req) => {
    // Return a dummy response that mimics what createClient does
    return {
      response: NextResponse.next()
    };
  }),
}));

// Import proxy after mocks
import { proxy } from '@/proxy';

describe('Web Proxy', () => {
  const mockReq = (pathname: string, host = 'localhost:3000') => {
    return new NextRequest(`http://${host}${pathname}`, {
      headers: { host }
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PUBLIC_ROUTES = '/public-route';
  });

  it('should rewrite status subdomain to /status', async () => {
    const req = mockReq('/', 'status.ekabalance.com');
    const res = await proxy(req);
    expect(res.headers.get('x-middleware-rewrite')).toContain('/status');
  });

  it('should allow API routes on status subdomain', async () => {
    const req = mockReq('/api/status', 'status.ekabalance.com');
    const res = await proxy(req);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('should allow static files on status subdomain', async () => {
    const req = mockReq('/_next/static/chunk.js', 'status.ekabalance.com');
    const res = await proxy(req);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('should allow public routes on main domain', async () => {
    const req = mockReq('/public-route');
    const res = await proxy(req);
    // Public routes usually just return next() or similar, depending on logic
    // In proxy.ts, it falls through to Supabase auth which returns response
    expect(res).toBeDefined();
  });

  it('should redirect to login if no session on main domain', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue(null);
    const req = mockReq('/protected');
    const res = await proxy(req);
    
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/api/auth/login');
    expect(location).toContain('returnTo=%2Fprotected');
  });

  it('should allow access if session exists', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue({ user: { sub: '123' } });
    const req = mockReq('/protected');
    const res = await proxy(req);
    expect(res).toBeDefined();
    // Should be a next() response or similar
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });
});
