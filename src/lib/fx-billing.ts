const _transactions: any[] = [];
const _invoices: any[] = [];

export const fxBilling = {
  async getBalanceForClient(clientId: string) {
    const txs = _transactions.filter(t => t.clientId === clientId).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    const balance = txs.reduce((acc: number, t: any) => acc + (t.amountEUR || 0), 0);
    return { balance, transactions: txs } as any;
  },
  async applyAdjustment(clientId: string, amountEUR: number, note?: string) {
    const id = Math.random().toString(36).slice(2);
    const payload = { id, clientId, amountEUR, note: note || null, createdAt: new Date().toISOString() };
    _transactions.push(payload);
    return payload as any;
  },
  async createChargeForSession(clientId: string, sessionId: string, amountEUR: number, note?: string) {
    const id = Math.random().toString(36).slice(2);
    const payload = { id, clientId, sessionId, amountEUR: -Math.abs(amountEUR), note: note || null, createdAt: new Date().toISOString() };
    _transactions.push(payload);
    return payload as any;
  }
  ,
  async createCheckoutSessionForPackage(clientId: string, packageId: string, amountEUR: number) {
    // Production checkout flow is not implemented in this project; stub for parity with mock
    throw new Error('Checkout not implemented for production');
  }
  ,
  async getInvoicesForClient(clientId: string) {
    return _invoices.filter(i => i.clientId === clientId).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  },
  async createInvoice(clientId: string, amountEUR: number, description?: string) {
    const id = Math.random().toString(36).slice(2);
    const payload = { id, clientId, amountEUR, description: description || null, createdAt: new Date().toISOString(), status: 'open' };
    _invoices.push(payload);
    return payload as any;
  },
  async markInvoicePaid(invoiceId: string) {
    const inv = _invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('Invoice not found');
    inv.status = 'paid';
    const id = Math.random().toString(36).slice(2);
    const tx = { id, clientId: inv.clientId, amountEUR: -Math.abs(inv.amountEUR || 0), note: `Invoice ${invoiceId} paid`, createdAt: new Date().toISOString() };
    _transactions.push(tx);
    return { invoiceId, transactionId: id } as any;
  }
};

export default fxBilling;
