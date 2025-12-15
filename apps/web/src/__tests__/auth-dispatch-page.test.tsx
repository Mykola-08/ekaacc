import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AuthDispatchPage from '../app/auth-dispatch/page';

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));
jest.mock('next/navigation');

describe('AuthDispatchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if no session', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } })
      }
    });
    
    try {
      await AuthDispatchPage();
    } catch (e) {
      // redirect throws an error in Next.js
    }
    
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to admin app if user has Admin role', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { user_roles: { name: 'admin' } } })
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    try {
      await AuthDispatchPage();
    } catch (e) {}

    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to therapist app if user has Therapist role', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { user_roles: { name: 'therapist' } } })
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    try {
      await AuthDispatchPage();
    } catch (e) {}


    expect(redirect).toHaveBeenCalledWith('http://localhost:9004');
  });

  it('redirects to dashboard if user has no special role', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { user_roles: { name: 'patient' } } })
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    try {
      await AuthDispatchPage();
    } catch (e) {}

    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});
