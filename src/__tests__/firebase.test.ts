import { db } from '@/firebase/config';
import { doc, getDoc, setDoc, connectFirestoreEmulator } from 'firebase/firestore';

// Connect to the Firestore emulator
connectFirestoreEmulator(db, 'localhost', 8080);

describe('Firebase Connection', () => {
  beforeAll(async () => {
    // Seed the emulator with test data
    const testUserRef = doc(db, 'users', 'test-user');
    await setDoc(testUserRef, {
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  it('should connect to Firestore and retrieve a document', async () => {
    const docRef = doc(db, 'users', 'test-user');
    const docSnap = await getDoc(docRef);
    expect(docSnap.exists()).toBe(true);
  });
});
