import { mockAuth } from './mock-data';
import { getFirestoreClient } from './firebase-client';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged as fbOnAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

type AuthUser = any;

const fxAuth = {
  get currentUser(): AuthUser | null {
    if (useMock) return mockAuth.currentUser || null;
    try {
      const auth = getAuth();
      return auth.currentUser as any || null;
    } catch (e) {
      return null;
    }
  },
  async login(email: string, password: string) {
    if (useMock) return mockAuth.login(email, password);
    const auth = getAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user as any;
  },
  async logout() {
    if (useMock) return mockAuth.logout();
    const auth = getAuth();
    await signOut(auth);
  },
  onAuthStateChanged(cb: (u: AuthUser | null) => void) {
    if (useMock) {
      // simple polling fallback for mock auth
      let mounted = true;
      const tick = () => {
        if (!mounted) return;
        cb(mockAuth.currentUser || null);
        setTimeout(tick, 500);
      };
      tick();
      return () => { mounted = false; };
    }
    const auth = getAuth();
    return fbOnAuthStateChanged(auth, (u: FirebaseUser | null) => cb(u as any));
  }
};

export default fxAuth;
