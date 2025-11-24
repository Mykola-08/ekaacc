/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

// Mock dependencies
// jest.mock('@auth0/nextjs-auth0/edge', ...); // Handled by moduleNameMapper
// jest.mock('next/server', ...); // Handled by moduleNameMapper

// Import proxy after mocks
import { proxy } from '../proxy';

describe('Web Proxy', () => {
  const mockReq = (pathname: string) => new (require('next/server').NextRequest)(`http://localhost:3000${pathname}`);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PUBLIC_ROUTES = '/public-route';
  });

  it('should allow public routes', async () => {
    const req = mockReq('/public-route');
    await proxy(req);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect to login if no session', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue(null);
    const req = mockReq('/protected');
    
    await proxy(req);
    
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as any;
    expect(redirectUrl.pathname).toBe('/api/auth/login');
    expect(redirectUrl.searchParams.get('returnTo')).toBe('/protected');
  });

  it('should allow access if session exists', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue({ user: { sub: '123' } });
    const req = mockReq('/protected');
    
    await proxy(req);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });


});
