import { mockFetch } from './mock-data';

export type Transaction = {
  id: string;
  clientId: string;
  amountEUR: number;
  type: 'charge' | 'credit' | 'adjustment';
  createdAt: string;
  note?: string;
};

export const mockTransactions: Transaction[] = [];

export type Invoice = {
  id: string;
  clientId: string;
  amountEUR: number;
  description?: string;
  createdAt: string;
  status: 'open' | 'paid';
};

export const mockInvoices: Invoice[] = [];

export const mockBillingAPI = {
  getBalanceForClient: async (clientId: string) => {
    await mockFetch(null, 200);
    const txs = mockTransactions.filter(t => t.clientId === clientId);
    const balance = txs.reduce((acc, t) => acc + t.amountEUR, 0);
    return { balance, transactions: txs };
  },
  applyAdjustment: async (clientId: string, amountEUR: number, note?: string) => {
    await mockFetch(null, 300);
    const tx: Transaction = {
      id: 'tx-' + (mockTransactions.length + 1),
      clientId,
      amountEUR,
      type: amountEUR >= 0 ? 'credit' : 'adjustment',
      createdAt: new Date().toISOString(),
      note,
    };
    mockTransactions.unshift(tx);
    return tx;
  }
  ,
  createChargeForSession: async (clientId: string, sessionId: string, amountEUR: number, note?: string) => {
    await mockFetch(null, 300);
    const tx: Transaction = {
      id: 'tx-' + (mockTransactions.length + 1),
      clientId,
      amountEUR: -Math.abs(amountEUR),
      type: 'charge',
      createdAt: new Date().toISOString(),
      note: note ? `${note} (session ${sessionId})` : `Charge for session ${sessionId}`,
    };
    mockTransactions.unshift(tx);
    return tx;
  }
  ,
  createCheckoutSessionForPackage: async (clientId: string, packageId: string, amountEUR: number) => {
    await mockFetch(null, 400);
    // return a simulated checkout URL
    return { id: 'cs_pkg_' + Math.random().toString(36).slice(2), url: `/mock-checkout-success?pkg=${packageId}&client=${clientId}`, amountEUR };
  }
  ,
  getInvoicesForClient: async (clientId: string) => {
    await mockFetch(null, 200);
    return mockInvoices.filter(i => i.clientId === clientId);
  },
  createInvoice: async (clientId: string, amountEUR: number, description?: string) => {
    await mockFetch(null, 300);
    const inv: Invoice = { id: 'inv-' + (mockInvoices.length + 1), clientId, amountEUR, description, createdAt: new Date().toISOString(), status: 'open' };
    mockInvoices.unshift(inv);
    return inv;
  },
  markInvoicePaid: async (invoiceId: string) => {
    await mockFetch(null, 200);
    const idx = mockInvoices.findIndex(i => i.id === invoiceId);
    if (idx === -1) throw new Error('Invoice not found');
    mockInvoices[idx].status = 'paid';
    // create transaction
    const inv = mockInvoices[idx];
    const tx: Transaction = { id: 'tx-' + (mockTransactions.length + 1), clientId: inv.clientId, amountEUR: -Math.abs(inv.amountEUR), type: 'charge', createdAt: new Date().toISOString(), note: `Invoice ${inv.id} paid` };
    mockTransactions.unshift(tx);
    return { invoice: mockInvoices[idx], transaction: tx };
  }
};
