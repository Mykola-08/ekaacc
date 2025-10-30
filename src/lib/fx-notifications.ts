import { getFirestoreClient } from './firebase-client';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

export const fxNotifications = {
  async listNotifications() {
    const db = getFirestoreClient();
    if (!db) return [];
    const col = collection(db, 'notifications');
    const q = query(col, orderBy('createdAt', 'desc') as any);
    const snap = await getDocs(q as any);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
  async createNotification(n: { userId?: string; title: string; body?: string; type?: string }) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized');
    const col = collection(db, 'notifications');
    const payload = { userId: n.userId, title: n.title, body: n.body, type: n.type || 'system', createdAt: new Date().toISOString(), seen: false } as any;
    const ref = await addDoc(col, payload as any);
    return { id: ref.id, ...payload };
  },
  async markSeen(id: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(db, 'notifications', id);
    await updateDoc(ref, { seen: true } as any);
    return true;
  }
};

export default fxNotifications;
