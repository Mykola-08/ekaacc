import { getFirestoreClient } from './firebase-client';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

export const fxUsers = {
  async getUsers() {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'users');
    const snap = await getDocs(col);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
  async updateUserRole(userId: string, role: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, { role });
    return { id: userId, role };
  }
  ,
  async updateUser(userId: string, data: Record<string, any>) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, data);
    return { id: userId, ...data };
  }
};

export default fxUsers;
