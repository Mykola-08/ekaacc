'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, collection, serverTimestamp, query, where } from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// This function ensures Firebase is initialized only once.
export function initializeFirebase() {
  let firebaseApp: FirebaseApp;
  try {
    firebaseApp = getApp();
  } catch (e) {
    firebaseApp = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
        // Self-host the reCAPTCHA script
        // Note: Replace with your site key in production
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NODE_ENV !== 'production';
        initializeAppCheck(firebaseApp, {
            provider: new ReCaptchaV3Provider('6Ld-iYspAAAAABOCsW328I0j5L26iP7rJb5FN3aN'), 
            isTokenAutoRefreshEnabled: true
        });
    }
  }
  return getSdks(firebaseApp);
}

export function getSdks(app: FirebaseApp) {
  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export { doc, collection, serverTimestamp, query, where };
