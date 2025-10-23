import { getFirestoreClient } from './firebase-client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { mockBookingAPI, mockAIAPI } from './mock-bookings';
import { mockAssessmentsAPI } from './mock-assessments';
import { mockBillingAPI } from './mock-billing';
import { mockTemplatesAPI } from './mock-templates';
import { mockNotificationsAPI } from './mock-notifications';
import { allUsers } from './data';
import { fxTemplates } from './fx-templates';
import { fxNotifications } from './fx-notifications';
import fxAuth from './fx-auth';
import { fxBookings } from './fx-bookings';
import { fxAssessments } from './fx-assessments';
import { fxBilling } from './fx-billing';
import { fxUsers } from './fx-users';

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

// Safe storage helpers: use localStorage when available (browser), otherwise fall back to an in-memory Map
const _inMemoryStore = new Map<string, string>();
function safeGetItem(key: string) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) return localStorage.getItem(key);
  } catch (e) { /* ignore */ }
  return _inMemoryStore.has(key) ? _inMemoryStore.get(key)! : null;
}
function safeSetItem(key: string, value: string) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) return localStorage.setItem(key, value);
  } catch (e) { /* ignore */ }
  _inMemoryStore.set(key, value);
}

function normalizeFirestoreValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value.map(normalizeFirestoreValue);
  }
  if (typeof value === 'object') {
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, normalizeFirestoreValue(val)])
    );
  }
  return value;
}

function deepMergeSettings(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const existing = output[key];
      output[key] = deepMergeSettings(
        typeof existing === 'object' && existing !== null && !Array.isArray(existing)
          ? (existing as Record<string, unknown>)
          : {},
        value as Record<string, unknown>
      );
    } else {
      output[key] = value;
    }
  }
  return output;
}

export const fxService = {
  async createBooking(userId: string, therapistId: string, date: string, notes?: string) {
    if (useMock) return mockBookingAPI.createBooking(userId, therapistId, date, notes);
    return fxBookings.createBooking(userId, therapistId, date, notes);
  },
  async getBookingsForUser(userId: string) {
    if (useMock) return mockBookingAPI.getBookingsForUser(userId);
    return fxBookings.getBookingsForUser(userId);
  },
  async getAllBookings() {
    if (useMock) return mockBookingAPI.getAllBookings();
    return fxBookings.getAllBookings();
  },
  async getBookingsForTherapist(therapistId: string) {
    if (useMock) {
      // mock API does not have therapist-specific query, filter locally
  const all = await mockBookingAPI.getAllBookings();
  return all.filter(b => b.therapistId === therapistId || String(b.therapistId) === String(therapistId));
    }
    return fxBookings.getBookingsForTherapist(therapistId);
  },
  async cancelBooking(bookingId: string) {
    if (useMock) return mockBookingAPI.cancelBooking(bookingId);
    return fxBookings.cancelBooking(bookingId);
  },
  async saveAssessment(sessionId: string, data: any) {
    if (useMock) return mockAssessmentsAPI.saveAssessment(sessionId, data);
    return fxAssessments.saveAssessment(sessionId, data);
  },
  async saveSessionNote(sessionId: string, note: string, authorId?: string) {
    const payload = { sessionType: 'note', content: note, authorId, createdAt: new Date().toISOString() };
    if (useMock) return mockAssessmentsAPI.saveAssessment(sessionId, payload);
    return fxAssessments.saveAssessment(sessionId, payload);
  },
  async getAssessmentsForSession(sessionId: string) {
    if (useMock) return mockAssessmentsAPI.getAssessmentsForSession(sessionId);
    return fxAssessments.getAssessmentsForSession(sessionId);
  },
  async deleteAssessment(assessmentId: string) {
    if (useMock) return mockAssessmentsAPI.deleteAssessment(assessmentId);
    return fxAssessments.deleteAssessment(assessmentId);
  },
  async getBalanceForClient(clientId: string) {
    if (useMock) return mockBillingAPI.getBalanceForClient(clientId);
    return fxBilling.getBalanceForClient(clientId);
  },
  async applyAdjustment(clientId: string, amountEUR: number, note?: string) {
    if (useMock) return mockBillingAPI.applyAdjustment(clientId, amountEUR, note);
    return fxBilling.applyAdjustment(clientId, amountEUR, note);
  },
  async createChargeForSession(clientId: string, sessionId: string, amountEUR: number, note?: string) {
    if (useMock) return mockBillingAPI.createChargeForSession(clientId, sessionId, amountEUR, note);
    return fxBilling.createChargeForSession(clientId, sessionId, amountEUR, note);
  },
  async createCheckoutSessionForPackage(clientId: string, packageId: string, amountEUR: number) {
    if (useMock) return mockBillingAPI.createCheckoutSessionForPackage(clientId, packageId, amountEUR);
    return fxBilling.createCheckoutSessionForPackage(clientId, packageId, amountEUR);
  },
  async getInvoicesForClient(clientId: string) {
    if (useMock) return mockBillingAPI.getInvoicesForClient(clientId);
    return fxBilling.getInvoicesForClient(clientId);
  },
  async createInvoice(clientId: string, amountEUR: number, description?: string) {
    if (useMock) return mockBillingAPI.createInvoice(clientId, amountEUR, description);
    return fxBilling.createInvoice(clientId, amountEUR, description);
  },
  async markInvoicePaid(invoiceId: string) {
    if (useMock) return mockBillingAPI.markInvoicePaid(invoiceId);
    return fxBilling.markInvoicePaid(invoiceId);
  },
  async getUsers() {
    if (useMock) return (allUsers || []).slice();
    return fxUsers.getUsers();
  },
  async updateBooking(bookingId: string, updates: Record<string, any>) {
    if (useMock) {
      const res = mockBookingAPI.updateBooking ? await mockBookingAPI.updateBooking(bookingId, updates) : { id: bookingId, ...updates };
      // create a notification for mock mode
      try { await mockNotificationsAPI.createNotification({ title: 'Booking updated', body: `Booking ${bookingId} updated.` }); } catch (e) { /* ignore */ }
      return res;
    }
    const res = await fxBookings.updateBooking(bookingId, updates);
    // try to create a persisted notification in production, but don't fail the update if notifications fail
    try { await fxNotifications.createNotification({ title: 'Booking updated', body: `Booking ${bookingId} updated.` }); } catch (e) { /* ignore */ }
    return res;
  },
  async listTemplates() { if (useMock) return mockTemplatesAPI.listTemplates(); return fxTemplates.listTemplates(); },
  async createTemplate(t: { title: string; content: string; authorId?: string }) { if (useMock) return mockTemplatesAPI.createTemplate(t); return fxTemplates.createTemplate(t); },
  async deleteTemplate(id: string) { if (useMock) return mockTemplatesAPI.deleteTemplate ? mockTemplatesAPI.deleteTemplate(id) : true; return fxTemplates.deleteTemplate(id); },
  async listNotifications() { if (useMock) return mockNotificationsAPI.listNotifications(); return fxNotifications.listNotifications(); },
  async createNotification(n: { title: string; body?: string; type?: string }) { if (useMock) return mockNotificationsAPI.createNotification(n); return fxNotifications.createNotification(n); },
  async markSeen(id: string) { if (useMock) return mockNotificationsAPI.markSeen ? mockNotificationsAPI.markSeen(id) : true; return fxNotifications.markSeen(id); },
  async generateAIReport(userId: string, prompt: string) {
    if (useMock) return mockAIAPI.sendMessage(userId, prompt);
    // Production AI integration is not implemented yet
    throw new Error('AI service not configured');
  },
  async getAIChatResponse(prompt: string, history: any[]) {
    if (useMock) return mockAIAPI.getAIChatResponse(prompt, history);
    throw new Error('AI service not configured');
  },
  async getAIRecommendations() {
    if (useMock) return mockAIAPI.getAIRecommendations();
    throw new Error('AI service not configured');
  },
  async getAIReportSummary(reportId: string) {
    if (useMock) return mockAIAPI.getAIReportSummary(reportId);
    throw new Error('AI service not configured');
  },
  async getAIAnalysis() {
    if (useMock) {
        // In a real scenario, this would involve complex logic.
        // Here, we just simulate a delay and return a mock object.
        await new Promise(res => setTimeout(res, 1500));
        
        const mockAnalysis = {
            keyTrends: [
                { title: 'Avg. Mood', value: '😊 (4.1)', change: 10.5, type: 'improvement' },
                { title: 'Avg. Pain Level', value: '3.2 / 10', change: -15.2, type: 'improvement' },
                { title: 'Session Consistency', value: '92%', change: 5, type: 'improvement' },
                { title: 'Journal Entries', value: '5 this week', change: 25, type: 'improvement' },
            ],
            moodChart: [
                { name: '4w ago', value: 3.5 },
                { name: '3w ago', value: 3.8 },
                { name: '2w ago', value: 3.7 },
                { name: 'Last week', value: 4.1 },
            ],
            painChart: [
                { name: '4w ago', value: 5.5 },
                { name: '3w ago', value: 4.2 },
                { name: '2w ago', value: 3.8 },
                { name: 'Last week', value: 3.2 },
            ],
            recommendations: [] // This would be populated by the AI logic
        };
        return mockAnalysis;
    }
    throw new Error('AI analysis service not configured');
  },
  async updateUser(userId: string, data: Record<string, any>) {
    if (useMock) return { id: userId, ...data };
    return fxUsers.updateUser(userId, data);
  },
  async updateUserRole(userId: string, role: string) {
    if (useMock) return { id: userId, role };
    return fxUsers.updateUserRole(userId, role);
  },
  async getSettings(userId: string) {
    if (useMock) {
      try {
        const raw = safeGetItem(`eka_settings_${userId}`);
        if (raw) return JSON.parse(raw);
      } catch (e) { /* ignore */ }
      // default settings shape - persist defaults so subsequent updates/read round-trip predictably
      const defaults = { notifications: { email: true, sms: false }, preferences: {}, billing: {} };
      try { safeSetItem(`eka_settings_${userId}`, JSON.stringify(defaults)); } catch (e) { /* ignore */ }
      return defaults;
    }
    const db = getFirestoreClient();
    const settingsRef = doc(db, 'userSettings', userId);
    const snapshot = await getDoc(settingsRef);

    const defaults = { notifications: { email: true, sms: false }, preferences: {}, billing: {} } as Record<string, unknown>;

    if (!snapshot.exists()) {
      return defaults;
    }

    const data = normalizeFirestoreValue(snapshot.data()) as Record<string, unknown>;
    return deepMergeSettings(defaults, data);
  },
  async updateSettings(userId: string, settings: Record<string, any>) {
    if (useMock) {
      try {
        const currentRaw = safeGetItem(`eka_settings_${userId}`) || '{}';
        const next = { ...(JSON.parse(currentRaw || '{}')), ...settings };
        safeSetItem(`eka_settings_${userId}`, JSON.stringify(next));
        return next;
      } catch (e) { return settings; }
    }
    const db = getFirestoreClient();
    const settingsRef = doc(db, 'userSettings', userId);
    const snapshot = await getDoc(settingsRef);

    const defaults = { notifications: { email: true, sms: false }, preferences: {}, billing: {} } as Record<string, unknown>;
    const existingData = snapshot.exists()
      ? (normalizeFirestoreValue(snapshot.data()) as Record<string, unknown>)
      : {};

    const merged = deepMergeSettings(defaults, deepMergeSettings(existingData, settings));

    const updatedAt = new Date().toISOString();

    await setDoc(
      settingsRef,
      { ...merged, updatedAt: serverTimestamp() },
      { merge: true }
    );

    const normalized = normalizeFirestoreValue(merged) as Record<string, unknown>;

    return { ...normalized, updatedAt };
  },
  auth: fxAuth,
};

export default fxService;
