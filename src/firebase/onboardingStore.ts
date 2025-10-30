import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firebaseServices } from './firebaseClient';

export type Tone = 'direct' | 'supportive' | 'scientific' | 'motivational';
export type Role = 'student' | 'office' | 'athlete' | 'artist' | 'other';

export interface UserPreferences {
  role: Role;
  goals: string[];
  concerns: string[];
  tone: Tone;
  notifyTips: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function savePreferences(uid: string, prefs: Omit<UserPreferences, 'createdAt' | 'updatedAt'>) {
  const { db } = firebaseServices;
  const ref = doc(db, 'users', uid, 'profile', 'preferences');
  await setDoc(ref, {
    ...prefs,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // Set created timestamp only on initial save
  const snap = await getDoc(ref);
  if (!snap.data()?.createdAt) {
    await setDoc(ref, { createdAt: serverTimestamp() }, { merge: true });
  }
}

export async function loadPreferences(uid: string): Promise<UserPreferences | null> {
  const { db } = firebaseServices;
  const ref = doc(db, 'users', uid, 'profile', 'preferences');
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserPreferences;
}
