// Re-export Firebase services for backward compatibility
import { app, auth, db, storage, functions, database, remoteConfig } from './firebase';
import { getMessaging } from 'firebase/messaging';

// Initialize messaging (browser only)
let messaging;
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase Messaging not available:', error);
  }
}

export const firebaseServices = {
  app,
  auth,
  db,
  storage,
  functions,
  database,
  rtdb: database, // Alias for backward compatibility
  remoteConfig,
  messaging,
};

export default firebaseServices;
