import { getFirestoreClient } from './firebase-client';
import { collection, addDoc, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';

export const fxAssessments = {
  async saveAssessment(sessionId: string, data: any) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'assessments');
    const payload = { sessionId, data, createdAt: new Date().toISOString() } as any;
    const ref = await addDoc(col, payload);
    return { id: ref.id, ...(payload as any) };
  },
  async getAssessmentsForSession(sessionId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'assessments');
    const q = query(col, where('sessionId', '==', sessionId), orderBy('createdAt', 'desc')) as any;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }
  ,
  async deleteAssessment(assessmentId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const ref = doc(db, 'assessments', assessmentId);
    await deleteDoc(ref);
    return { id: assessmentId };
  }
};

export default fxAssessments;
