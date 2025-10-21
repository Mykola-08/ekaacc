import { getFirestoreClient } from './firebase-client';
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';

export const fxBilling = {
  async getBalanceForClient(clientId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'transactions');
    const q = query(col, where('clientId', '==', clientId), orderBy('createdAt', 'desc')) as any;
    const snap = await getDocs(q);
    const txs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    const balance = txs.reduce((acc: number, t: any) => acc + (t.amountEUR || 0), 0);
    return { balance, transactions: txs } as any;
  },
  async applyAdjustment(clientId: string, amountEUR: number, note?: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'transactions');
    const payload = { clientId, amountEUR, note: note || null, createdAt: new Date().toISOString() };
    const ref = await addDoc(col, payload as any);
    return { id: ref.id, ...(payload as any) };
  },
  async createChargeForSession(clientId: string, sessionId: string, amountEUR: number, note?: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'transactions');
    const payload = { clientId, sessionId, amountEUR: -Math.abs(amountEUR), note: note || null, createdAt: new Date().toISOString() };
    const ref = await addDoc(col, payload as any);
    return { id: ref.id, ...(payload as any) };
  }
  ,
  async createCheckoutSessionForPackage(clientId: string, packageId: string, amountEUR: number) {
    // Production checkout flow is not implemented in this project; stub for parity with mock
    throw new Error('Checkout not implemented for production');
  }
  ,
  async getInvoicesForClient(clientId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'invoices');
    const q = query(col, where('clientId', '==', clientId), orderBy('createdAt', 'desc')) as any;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
  async createInvoice(clientId: string, amountEUR: number, description?: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const col = collection(db, 'invoices');
    const payload = { clientId, amountEUR, description: description || null, createdAt: new Date().toISOString(), status: 'open' };
    const ref = await addDoc(col, payload as any);
    return { id: ref.id, ...(payload as any) };
  },
  async markInvoicePaid(invoiceId: string) {
    const db = getFirestoreClient();
    if (!db) throw new Error('Firestore not initialized.');
    const invRef = doc(db, 'invoices', invoiceId);
    const invSnap = await getDoc(invRef);
    if (!invSnap.exists()) throw new Error('Invoice not found');
    const inv = invSnap.data() as any;
    await updateDoc(invRef, { status: 'paid' });
    const col = collection(db, 'transactions');
    const payload = { clientId: inv.clientId, amountEUR: -Math.abs(inv.amountEUR || 0), note: `Invoice ${invoiceId} paid`, createdAt: new Date().toISOString() };
    const txRef = await addDoc(col, payload as any);
    return { invoiceId, transactionId: txRef.id };
  }
};

export default fxBilling;
