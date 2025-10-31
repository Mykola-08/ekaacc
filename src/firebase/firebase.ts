import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getDatabase } from 'firebase/database';
import { getRemoteConfig } from 'firebase/remote-config';
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check with debug token
if (typeof window !== 'undefined' && !getApps().some(a => a.name === '[DEFAULT]' && (a as any)._appCheckInstances)) {
  // Set debug token for development
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = '86D6EB47-B7EF-45DE-806A-34674E28E62B';
  }
  
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'dummy-key'),
      isTokenAutoRefreshEnabled: true
    });
  } catch (error) {
    console.warn('App Check initialization failed:', error);
  }
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const database = getDatabase(app);
const remoteConfig = getRemoteConfig(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, functions, database, remoteConfig, analytics };
