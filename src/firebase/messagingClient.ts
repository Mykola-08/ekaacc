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
