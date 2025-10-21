import { getFirestoreClient } from './firebase-client';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

export const fxTemplates = {
  async listTemplates() {
    const db = getFirestoreClient();
    if (!db) return [];
    const col = collection(db, 'templates');
    const q = query(col, orderBy('createdAt', 'desc') as any);
    const snap = await getDocs(q as any);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
  async createTemplate({ title, content, authorId }: { title: string; content: string; authorId?: string }) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized');
    const col = collection(db, 'templates');
    const payload = { title, content, authorId, createdAt: new Date().toISOString() } as any;
    const ref = await addDoc(col, payload as any);
    return { id: ref.id, ...payload };
  },
  async deleteTemplate(id: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(db, 'templates', id);
    await deleteDoc(ref);
    return true;
  }
};

export default fxTemplates;
