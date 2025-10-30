// Re-export Firebase services for backward compatibility
import { app, auth, db, storage, functions, database, remoteConfig } from './firebase';

export const firebaseServices = {
  app,
  auth,
  db,
  storage,
  functions,
  database,
  remoteConfig,
};

export default firebaseServices;
