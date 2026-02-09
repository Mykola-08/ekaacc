const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
const publicAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/make-server-1ccf6811` // Adjust if needed
  : `https://${projectId}.supabase.co/functions/v1/make-server-1ccf6811`;

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

// Storage keys
const SESSION_KEY = 'eka_session';
const USER_KEY = 'eka_user';

/**
 * Sign up a new user
 */
export async function signUp(
  email: string,
  password: string,
  name?: string,
  phone?: string
): Promise<{ user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, name, phone }),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      return { error: data.error || data.details || 'Failed to create account' };
    }

    // After signup, automatically sign in
    return await signIn(email, password);
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

/**
 * Sign in existing user
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      return { error: data.error || data.details || 'Invalid email or password' };
    }

    // Store session and user
    const session: Session = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: data.user,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return { user: data.user };
  } catch (error) {
    console.error('Signin error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    const session = getSession();

    if (session?.access_token) {
      await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    }
  } catch (error) {
    console.error('Signout error:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * Get current session from localStorage
 */
export function getSession(): Session | null {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session: Session = JSON.parse(sessionStr);

    // Check if token is expired
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      // Token expired, try to refresh
      refreshSession(session.refresh_token);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get access token for API calls
 */
export function getAccessToken(): string | null {
  const session = getSession();
  return session?.access_token || null;
}

/**
 * Refresh the session token
 */
export async function refreshSession(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      // Refresh failed, clear session
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_KEY);
      return false;
    }

    // Update session with new tokens
    const currentUser = getCurrentUser();
    if (currentUser) {
      const newSession: Session = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        user: currentUser,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    }

    return true;
  } catch (error) {
    console.error('Refresh token error:', error);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    return false;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getSession() !== null && getCurrentUser() !== null;
}

/**
 * Get user from token (verify with server)
 */
export async function verifySession(): Promise<User | null> {
  try {
    const session = getSession();
    if (!session) return null;

    const response = await fetch(`${API_URL}/auth/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      // Session invalid, clear storage
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }

    // Update user in storage
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('Verify session error:', error);
    return null;
  }
}
