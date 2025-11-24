/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

// Import proxy after mocks (mocks are handled by moduleNameMapper)
import { proxy } from '../proxy';

describe('Therapist Proxy', () => {
  const mockReq = (pathname: string) => new (require('next/server').NextRequest)(`http://localhost:9004${pathname}`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect if no session', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue(null);
    const req = mockReq('/dashboard');
    
    await proxy(req);
    
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as string | URL;
    expect(redirectUrl.toString()).toContain('http://localhost:9002/dashboard');
  });

  it('should redirect if user is not Therapist or Admin', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue({ user: { roles: ['User'] } });
    const req = mockReq('/dashboard');
    
    await proxy(req);
    
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as string | URL;
    expect(redirectUrl.toString()).toContain('http://localhost:9002/dashboard');
  });

  it('should allow access if user is Therapist', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue({ user: { roles: ['Therapist'] } });
    const req = mockReq('/dashboard');
    
    await proxy(req);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should allow access if user is Admin', async () => {
    (getSession as jest.Mock<any>).mockResolvedValue({ user: { roles: ['Admin'] } });
    const req = mockReq('/dashboard');
    
    await proxy(req);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
