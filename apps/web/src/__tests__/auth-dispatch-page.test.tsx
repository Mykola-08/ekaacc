import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import AuthDispatchPage from '../app/auth-dispatch/page';

jest.mock('@auth0/nextjs-auth0', () => ({
  getSession: jest.fn(),
}));
jest.mock('next/navigation');

describe('AuthDispatchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if no session', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    
    try {
      await AuthDispatchPage();
    } catch (e) {
      // redirect throws an error in Next.js
    }
    
    expect(redirect).toHaveBeenCalledWith('/api/auth/login');
  });

  it('redirects to admin app if user has Admin role', async () => {
    (getSession as jest.Mock).mockResolvedValue({
      user: {
        roles: ['Admin']
      }
    });

    try {
      await AuthDispatchPage();
    } catch (e) {}

    expect(redirect).toHaveBeenCalledWith('http://localhost:9003');
  });

  it('redirects to therapist app if user has Therapist role', async () => {
    (getSession as jest.Mock).mockResolvedValue({
      user: {
        roles: ['Therapist']
      }
    });

    try {
      await AuthDispatchPage();
    } catch (e) {}

    expect(redirect).toHaveBeenCalledWith('http://localhost:9004');
  });

  it('redirects to dashboard if user has no special role', async () => {
    (getSession as jest.Mock).mockResolvedValue({
      user: {
        roles: ['Patient']
      }
    });

    try {
      await AuthDispatchPage();
    } catch (e) {}

    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
  
  it('handles namespaced roles', async () => {
    (getSession as jest.Mock).mockResolvedValue({
      user: {
        'https://ekabalance.com/roles': ['Admin']
      }
    });

    try {
      await AuthDispatchPage();
    } catch (e) {}

    expect(redirect).toHaveBeenCalledWith('http://localhost:9003');
  });
});
