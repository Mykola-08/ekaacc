import { getFirestoreClient } from './firebase-client';
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
        const raw = localStorage.getItem(`eka_settings_${userId}`);
        if (raw) return JSON.parse(raw);
      } catch (e) { /* ignore */ }
      // default settings shape - persist defaults so subsequent updates/read round-trip predictably
      const defaults = { notifications: { email: true, sms: false }, preferences: {}, billing: {} };
      try { localStorage.setItem(`eka_settings_${userId}`, JSON.stringify(defaults)); } catch (e) { /* ignore */ }
      return defaults;
    }
    // TODO: implement real settings retrieval via firestore
    return {};
  },
  async updateSettings(userId: string, settings: Record<string, any>) {
    if (useMock) {
      try {
        const next = { ...(JSON.parse(localStorage.getItem(`eka_settings_${userId}`) || '{}')), ...settings };
        localStorage.setItem(`eka_settings_${userId}`, JSON.stringify(next));
        return next;
      } catch (e) { return settings; }
    }
    // TODO: implement real settings update via firestore
    return settings;
  },
  auth: fxAuth,
};

export default fxService;
