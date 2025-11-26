/**
 * @jest-environment node
 */
import { describe, it, expect, jest } from '@jest/globals';
import { middleware } from '../middleware';
import { NextResponse } from 'next/server';

describe('API Middleware', () => {
  const mockReq = (pathname: string) => new (require('next/server').NextRequest)(`http://localhost:9005${pathname}`);

  it('should set security headers', () => {
    const req = mockReq('/api/health');
    const res = middleware(req);
    
    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(res.headers.get('Strict-Transport-Security')).toBeDefined();
  });

  it('should set CORS headers for API routes', () => {
    const req = mockReq('/api/users');
    const res = middleware(req);
    
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
  });
});
