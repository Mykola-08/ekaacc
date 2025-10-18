'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, collection, serverTimestamp, query, where, or, orderBy } from 'firebase/firestore'

// This variable will hold the single instance of the Firebase app.
let firebaseApp: FirebaseApp;

// This function ensures Firebase is initialized only once.
export function initializeFirebase() {
  try {
    // Attempt to get the existing app instance.
    firebaseApp = getApp();
  } catch (e) {
    // If no app exists, initialize a new one.
    firebaseApp = initializeApp(firebaseConfig);
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
export { doc, collection, serverTimestamp, query, where, or, orderBy };
