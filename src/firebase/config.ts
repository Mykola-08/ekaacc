import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

export const firebaseConfig = {
  "projectId": "studio-1965873331-9f090",
  "appId": "1:296874779041:web:40f9a26c7ee84f410f6be0",
  "apiKey": "AIzaSyArmyl3UcrEpZSNR_jl2g7vpXRhvjCR42A",
  "authDomain": "studio-1965873331-9f090.firebaseapp.com",
  "measurementId": "G-67QJRENXGL",
  "messagingSenderId": "296874779041"
};

// Initialize Firebase and export db
let _db: ReturnType<typeof getFirestore> | null = null;

export const getDb = () => {
  if (!_db) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    _db = getFirestore(app);
  }
  return _db;
};

// Export db for backwards compatibility
export const db = getDb();
