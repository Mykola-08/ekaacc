// Clean service without Firebase and mock dependencies
import { fxTemplates } from './fx-templates';
import { fxNotifications } from './fx-notifications';
import { fxBookings } from './fx-bookings';
import { fxAssessments } from './fx-assessments';
import { fxBilling } from './fx-billing';
import { fxUsers } from './fx-users';

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

function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  if (typeof value === 'object') {
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, normalizeValue(val)])
    );
  }
  return value;
}

function deepMergeSettings(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMergeSettings(
        (target[key] as Record<string, unknown>) || {},
        source[key] as Record<string, unknown>
      );
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

const fxService = {
  // Users
  async getUsers() {
    return fxUsers.getUsers();
  },
  async getUser(id: string) {
    const users = await fxUsers.getUsers();
    return users.find(u => u.id === id) || null;
  },
  async updateUser(id: string, data: any) {
    return fxUsers.updateUser(id, data);
  },
  async deleteUser(id: string) {
    throw new Error('User deletion not implemented');
  },

  // Bookings
  async getBookings() {
    return fxBookings.getAllBookings();
  },
  async getBooking(id: string) {
    const bookings = await fxBookings.getAllBookings();
    return bookings.find(b => b.id === id) || null;
  },
  async createBooking(data: any) {
    // Handle both old and new signatures
    if (typeof data === 'object' && data.userId && data.therapistId && data.date) {
      return fxBookings.createBooking(data.userId, data.therapistId, data.date, data.notes);
    }
    // Handle legacy signature: createBooking(selectedClientId, therapistId, bookingDateTime, notes)
    // This is called with multiple arguments, so we need to handle it differently
    throw new Error('Invalid booking data - use object format: { userId, therapistId, date, notes }');
  },
  async updateBooking(id: string, data: any) {
    return fxBookings.updateBooking(id, data);
  },
  async deleteBooking(id: string) {
    throw new Error('Booking deletion not implemented, use cancelBooking');
  },
  async getBookingsForUser(userId: string, userData?: any) {
    // Handle both old and new signatures
    const bookings = await fxBookings.getBookingsForUser(userId);
    if (userData) {
      // If additional user data is provided, merge it with the bookings
      return bookings.map(booking => ({
        ...booking,
        userData: userData
      }));
    }
    return bookings;
  },
  async getBookingsForTherapist(therapistId: string) {
    return fxBookings.getBookingsForTherapist(therapistId);
  },
  async cancelBooking(bookingId: string) {
    return fxBookings.cancelBooking(bookingId);
  },

  // Assessments
  async getAssessments() {
    throw new Error('Get all assessments not implemented');
  },
  async getAssessment(id: string) {
    throw new Error('Get assessment by ID not implemented');
  },
  async createAssessment(data: any) {
    return fxAssessments.saveAssessment(data.sessionId, data.data);
  },
  async updateAssessment(id: string, data: any) {
    throw new Error('Update assessment not implemented, use saveAssessment');
  },
  async deleteAssessment(id: string) {
    return fxAssessments.deleteAssessment(id);
  },
  async getAssessmentsForSession(sessionId: string) {
    return fxAssessments.getAssessmentsForSession(sessionId);
  },
  async saveAssessment(sessionId: string, data: any) {
    return fxAssessments.saveAssessment(sessionId, data);
  },

  // Billing
  async getBilling() {
    throw new Error('Get all billing not implemented');
  },
  async getBillingItem(id: string) {
    throw new Error('Get billing item by ID not implemented');
  },
  async createBillingItem(data: any) {
    throw new Error('Create billing item not implemented');
  },
  async updateBillingItem(id: string, data: any) {
    throw new Error('Update billing item not implemented');
  },
  async deleteBillingItem(id: string) {
    throw new Error('Delete billing item not implemented');
  },
  async getBalanceForClient(clientId: string) {
    return fxBilling.getBalanceForClient(clientId);
  },
  async applyAdjustment(clientId: string, amountEUR: number, note?: string) {
    return fxBilling.applyAdjustment(clientId, amountEUR, note);
  },
  async createChargeForSession(clientId: string, sessionId: string, amountEUR: number, note?: string) {
    return fxBilling.createChargeForSession(clientId, sessionId, amountEUR, note);
  },
  async createCheckoutSessionForPackage(clientId: string, packageId: string, amountEUR: number) {
    return fxBilling.createCheckoutSessionForPackage(clientId, packageId, amountEUR);
  },
  async getInvoicesForClient(clientId: string) {
    return fxBilling.getInvoicesForClient(clientId);
  },
  async createInvoice(clientId: string, amountEUR: number, description?: string) {
    throw new Error('Create invoice not implemented');
  },
  async markInvoicePaid(invoiceId: string) {
    return fxBilling.markInvoicePaid(invoiceId);
  },

  // Notifications
  async getNotifications() {
    return fxNotifications.listNotifications();
  },
  async getNotification(id: string) {
    const notifications = await fxNotifications.listNotifications();
    return notifications.find(n => n.id === id) || null;
  },
  async createNotification(data: { userId: string; title: string; body?: string; type?: string }) {
    return fxNotifications.createNotification(data);
  },
  async updateNotification(id: string, data: any) {
    throw new Error('Update notification not implemented');
  },
  async deleteNotification(id: string) {
    throw new Error('Delete notification not implemented');
  },
  async listNotifications() {
    return fxNotifications.listNotifications();
  },
  async markSeen(id: string) {
    return fxNotifications.markSeen(id);
  },

  // Templates
  async getTemplates() {
    return fxTemplates.listTemplates();
  },
  async getTemplate(id: string) {
    const templates = await fxTemplates.listTemplates();
    return templates.find(t => t.id === id) || null;
  },
  async createTemplate(data: any) {
    return fxTemplates.createTemplate(data);
  },
  async updateTemplate(id: string, data: any) {
    throw new Error('Update template not implemented');
  },
  async deleteTemplate(id: string) {
    return fxTemplates.deleteTemplate(id);
  },

  // Settings
  async getSettings() {
    const stored = safeGetItem('app_settings');
    return stored ? JSON.parse(stored) : {};
  },
  async updateSettings(updates: any) {
    const current = await this.getSettings();
    const updated = deepMergeSettings(current, updates);
    safeSetItem('app_settings', JSON.stringify(updated));
    return updated;
  },

  // Storage
  async uploadFile(file: File, path: string) {
    throw new Error('File upload not implemented in clean service');
  },
  async getFileUrl(path: string) {
    throw new Error('File storage not implemented in clean service');
  },
  
  // AI Features
  async generateAIReport(userId: string, prompt: string) {
    throw new Error('AI report generation not implemented');
  },
  async getAIChatResponse(prompt: string, history: any[]) {
    throw new Error('AI chat response not implemented');
  },
  async getAIRecommendations() {
    throw new Error('AI recommendations not implemented');
  },
};

export default fxService;
