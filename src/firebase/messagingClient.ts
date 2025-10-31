import { firebaseServices } from './firebaseClient';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';

export async function requestPushPermissionAndRegister(uid: string) {
  const { messaging, db } = firebaseServices;
  if (!messaging) {
    console.log("Messaging not supported in this environment.");
    return null;
  }

  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      console.log("Notification permission not granted.");
      return null;
    }

    // Register service worker and pass Firebase config
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Send Firebase config to service worker
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };
        
        registration.active?.postMessage({
          type: 'FIREBASE_CONFIG',
          config: firebaseConfig
        });
      } catch (swError) {
        console.error('Service Worker registration failed:', swError);
      }
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });

    if (token) {
      console.log("Push token received:", token);
      // Save token to Firestore
      const tokenRef = doc(db, 'users', uid, 'pushTokens', token);
      await setDoc(tokenRef, {
        token: token,
        createdAt: new Date(),
        platform: 'web'
      });
      console.log("Push token saved to Firestore.");
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
    
    return token;
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
    return null;
  }
}
