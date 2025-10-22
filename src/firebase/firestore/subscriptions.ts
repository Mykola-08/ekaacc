import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type {
  Subscription,
  SubscriptionUsage,
  UserThemePreference,
  SubscriptionReward,
} from '@/lib/subscription-types';

/**
 * Firestore Collections for Subscription System
 * 
 * Collections:
 * - subscriptions: User subscription records
 * - subscriptionUsage: Usage tracking per subscription
 * - userThemePreferences: Theme preferences per user
 * - subscriptionRewards: Loyalty rewards earned
 */

// ============================================================================
// Subscriptions Collection
// ============================================================================

export async function createFirestoreSubscription(subscription: Subscription): Promise<void> {
  const docRef = doc(db, 'subscriptions', subscription.id);
  await setDoc(docRef, {
    ...subscription,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getFirestoreSubscription(subscriptionId: string): Promise<Subscription | null> {
  const docRef = doc(db, 'subscriptions', subscriptionId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return docSnap.data() as Subscription;
}

export async function getUserFirestoreSubscriptions(userId: string): Promise<Subscription[]> {
  const q = query(
    collection(db, 'subscriptions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Subscription);
}

export async function updateFirestoreSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
): Promise<void> {
  const docRef = doc(db, 'subscriptions', subscriptionId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFirestoreSubscription(subscriptionId: string): Promise<void> {
  const docRef = doc(db, 'subscriptions', subscriptionId);
  await deleteDoc(docRef);
}

// ============================================================================
// Subscription Usage Collection
// ============================================================================

export async function createFirestoreUsage(usage: SubscriptionUsage): Promise<void> {
  const docRef = doc(db, 'subscriptionUsage', usage.subscriptionId);
  await setDoc(docRef, {
    ...usage,
    updatedAt: serverTimestamp(),
  });
}

export async function getFirestoreUsage(subscriptionId: string): Promise<SubscriptionUsage | null> {
  const docRef = doc(db, 'subscriptionUsage', subscriptionId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return docSnap.data() as SubscriptionUsage;
}

export async function updateFirestoreUsage(
  subscriptionId: string,
  updates: Partial<SubscriptionUsage>
): Promise<void> {
  const docRef = doc(db, 'subscriptionUsage', subscriptionId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================================
// User Theme Preferences Collection
// ============================================================================

export async function setUserThemePreference(
  userId: string,
  preference: UserThemePreference
): Promise<void> {
  const docRef = doc(db, 'userThemePreferences', userId);
  await setDoc(docRef, {
    ...preference,
    updatedAt: serverTimestamp(),
  });
}

export async function getUserThemePreference(userId: string): Promise<UserThemePreference | null> {
  const docRef = doc(db, 'userThemePreferences', userId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return docSnap.data() as UserThemePreference;
}

// ============================================================================
// Subscription Rewards Collection
// ============================================================================

export async function createFirestoreReward(reward: SubscriptionReward): Promise<void> {
  const docRef = doc(db, 'subscriptionRewards', reward.id);
  await setDoc(docRef, {
    ...reward,
    createdAt: serverTimestamp(),
  });
}

export async function getUserFirestoreRewards(
  userId: string,
  limitCount: number = 50
): Promise<SubscriptionReward[]> {
  const q = query(
    collection(db, 'subscriptionRewards'),
    where('userId', '==', userId),
    orderBy('earnedAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as SubscriptionReward);
}

// ============================================================================
// Admin Queries
// ============================================================================

export async function getAllActiveSubscriptions(limitCount: number = 100): Promise<Subscription[]> {
  const q = query(
    collection(db, 'subscriptions'),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Subscription);
}

export async function getSubscriptionsByType(
  type: string,
  limitCount: number = 100
): Promise<Subscription[]> {
  const q = query(
    collection(db, 'subscriptions'),
    where('type', '==', type),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Subscription);
}
