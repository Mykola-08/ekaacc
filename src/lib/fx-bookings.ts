import { getFirestoreClient } from './firebase-client';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, orderBy, limit } from 'firebase/firestore';

export const fxBookings = {
  async createBooking(userId: string, therapistId: string, date: string, notes?: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized. Set NEXT_PUBLIC_FIREBASE_API_KEY and related env vars.');
    const col = collection(db, 'bookings');
    const payload: any = { userId, therapistId, date, notes: notes || null, status: 'confirmed', createdAt: new Date().toISOString() };
    const ref = await addDoc(col, payload);
    return { id: ref.id, ...payload };
  },
  async getBookingsForUser(userId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'bookings');
    const q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc')) as any;
    const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
  async getBookingsForTherapist(therapistId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'bookings');
    const q = query(col, where('therapistId', '==', therapistId), orderBy('createdAt', 'desc')) as any;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
  async cancelBooking(bookingId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const ref = doc(db, 'bookings', bookingId);
    await updateDoc(ref, { status: 'cancelled' });
    return { id: bookingId, status: 'cancelled' };
  }
  ,
  async updateBooking(bookingId: string, updates: Record<string, any>) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const ref = doc(db, 'bookings', bookingId);
    await updateDoc(ref, updates);
    return { id: bookingId, ...(updates || {}) };
  },
  async getAllBookings() {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'bookings');
    const q = query(col, orderBy('createdAt', 'desc')) as any;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
};

export default fxBookings;
