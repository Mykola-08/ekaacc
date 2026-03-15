// Production-grade service with comprehensive error handling and logging
import { templateService } from '@/lib/platform/services/template-service';
import { notificationService } from '@/lib/platform/services/notification-service';
import { bookingService } from '@/lib/platform/services/booking-service';
import { assessmentService } from '@/lib/platform/services/assessment-service';
import { billingService } from '@/lib/platform/services/billing-service';
import { userService } from '@/lib/platform/services/user-service';
import { logger } from '@/lib/platform/services/logging';
import {
  withRetry,
  safeOperation,
  AppError,
  ValidationError,
  NotFoundError,
} from '@/lib/platform/utils/error-handling';
import { supabase } from '@/lib/platform/supabase';
import {
  safeSupabaseInsert,
  safeSupabaseUpdate,
  safeSupabaseQuery,
} from '@/lib/platform/supabase/utils';

// Production-grade storage with proper error handling and validation
async function safeGetItem(key: string): Promise<string | null> {
  return await withRetry(
    async () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }

        // Server-side: check Supabase user settings
        const {
          data: { user },
        } = await (supabase.auth as any).getUser();
        if (!user) return null;

        const { data, error } = await safeSupabaseQuery<{ value: string }>(
          supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', key)
            .single()
        );

        if (error) {
          logger.debug(`Setting not found: ${key}`);
          return null;
        }

        return data?.value || null;
      } catch (error) {
        logger.error(`Error getting setting: ${key}`, error as Error);
        return null;
      }
    },
    {},
    { operation: 'safeGetItem', metadata: { key } }
  );
}

async function safeSetItem(key: string, value: string): Promise<void> {
  await withRetry(
    async () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }

        // Server-side: store in Supabase user settings
        const {
          data: { user },
        } = await (supabase.auth as any).getUser();
        if (!user) {
          throw new AppError('User not authenticated', 'AUTHENTICATION_ERROR', 401);
        }

        const { error } = await safeSupabaseInsert<any>('user_settings', {
          user_id: user.id,
          key,
          value,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          throw new AppError(`Failed to save setting: ${error.message}`, 'DATABASE_ERROR', 500);
        }

        logger.debug(`Setting saved: ${key}`);
      } catch (error) {
        logger.error(`Error saving setting: ${key}`, error as Error);
        throw error;
      }
    },
    {},
    { operation: 'safeSetItem', metadata: { key } }
  );
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
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        normalizeValue(val),
      ])
    );
  }
  return value;
}

function deepMergeSettings(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
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
    return userService.getUsers();
  },
  async getUser(id: string) {
    const users = await userService.getUsers();
    return users.find((u) => u.id === id) || null;
  },
  async updateUser(id: string, data: any) {
    return userService.updateUser(id, data);
  },
  async deleteUser(id: string) {
    if (!id) throw new Error('User ID required for deletion');
    // Using an admin service to actually delete the auth user or doing it in userService
    return userService.deleteUser(id);
  },

  async getAllUsers() {
    return this.getUsers();
  },

  async getSessions(userId?: string) {
    const bookings = await bookingService.getAllBookings();
    let filtered = bookings;
    if (userId) {
      filtered = bookings.filter((b) => b.clientId === userId || b.userId === userId);
    }

    // Map to Session type
    return filtered.map((b) => {
      const start = new Date(b.slot.start);
      const end = new Date(b.slot.end);
      const durationMinutes = (end.getTime() - start.getTime()) / 60000;

      return {
        id: b.id,
        date: start.toLocaleDateString(), // simplified
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: b.serviceId, // placeholder for service name
        therapist: b.therapistId, // placeholder for therapist name
        status: (b.status.charAt(0).toUpperCase() + b.status.slice(1)) as
          | 'Upcoming'
          | 'Completed'
          | 'Canceled', // Capitalize
        notes: b.notes,
        duration: durationMinutes > 0 ? durationMinutes : 60,
        userId: b.userId,
      };
    });
  },

  async getJournalEntries(userId: string) {
    // Placeholder
    return [];
  },

  // Bookings
  async getBookings() {
    return bookingService.getAllBookings();
  },
  async getBooking(id: string) {
    const bookings = await bookingService.getAllBookings();
    return bookings.find((b) => b.id === id) || null;
  },
  async createBooking(data: any) {
    // Handle both old and new signatures
    // The simplified bookingService.createBooking expects a BookingRequest object

    // Check if data matches BookingRequest shape roughly
    if (data.userId && data.therapistId && data.slot) {
      return bookingService.createBooking(data);
    }

    if (typeof data === 'object' && data.userId && data.therapistId && data.date) {
      // Adapt old signature to new request object
      return bookingService.createBooking({
        userId: data.userId,
        therapistId: data.therapistId,
        serviceId: 'default-service', // fallback
        slot: { start: data.date, end: data.date }, // simplistic, should adjust duration
        price: 0,
        paymentMethod: 'pay_at_place',
        notes: data.notes,
      });
    }
    // Handle legacy signature: createBooking(selectedClientId, therapistId, bookingDateTime, notes)
    // This is called with multiple arguments, so we need to handle it differently
    throw new Error(
      'Invalid booking data - use object format: { userId, therapistId, slot: {start, end}, ... }'
    );
  },
  async updateBooking(id: string, data: any) {
    return bookingService.updateBooking(id, data);
  },
  async deleteBooking(id: string) {
    return bookingService.deleteBooking(id);
  },
  async getBookingsForUser(userId: string, userData?: any) {
    // Handle both old and new signatures
    const bookings = await bookingService.getBookingsForUser(userId);
    if (userData) {
      // If additional user data is provided, merge it with the bookings
      return bookings.map((booking) => ({
        ...booking,
        userData: userData,
      }));
    }
    return bookings;
  },
  async getBookingsForTherapist(therapistId: string) {
    return bookingService.getBookingsForTherapist(therapistId);
  },
  async cancelBooking(bookingId: string) {
    return bookingService.cancelBooking(bookingId);
  },

  // Assessments
  async getAssessments() {
    const { data, error } = await safeSupabaseQuery<any[]>(
      supabase.from('assessments').select('*').order('created_at', { ascending: false })
    );
    if (error) throw new Error('Failed to fetch assessments');
    return data || [];
  },
  async getAssessment(id: string) {
    const { data, error } = await safeSupabaseQuery<any>(
      supabase.from('assessments').select('*').eq('id', id).single()
    );
    if (error) throw new Error('Assessment not found');
    return data;
  },
  async getReports(userId?: string) {
    let query = supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data } = await query;
    return data || [];
  },

  async saveReport(data: any) {
    const { data: report, error } = await safeSupabaseInsert<any>('reports', {
      ...data,
      created_at: new Date().toISOString(),
    });
    if (error) throw new Error('Failed to save report');
    return report;
  },
  async createAssessment(data: any) {
    return assessmentService.saveAssessment(data.sessionId, data.data);
  },
  async updateAssessment(id: string, data: any) {
    const { data: updated, error } = await safeSupabaseUpdate<any>(
      'assessments',
      { data, updated_at: new Date().toISOString() },
      { id }
    );
    if (error) throw new Error('Failed to update assessment');
    return updated;
  },
  async deleteAssessment(id: string) {
    return assessmentService.deleteAssessment(id);
  },
  async getAssessmentsForSession(sessionId: string) {
    return assessmentService.getAssessmentsForSession(sessionId);
  },
  async saveAssessment(sessionId: string, data: any) {
    return assessmentService.saveAssessment(sessionId, data);
  },

  // Billing
  async getBilling() {
    const { data, error } = await safeSupabaseQuery<any[]>(
      supabase.from('billing_transactions').select('*').order('created_at', { ascending: false })
    );
    if (error) throw new Error('Failed to fetch billing items');
    return data || [];
  },
  async getBillingItem(id: string) {
    const { data, error } = await safeSupabaseQuery<any>(
      supabase.from('billing_transactions').select('*').eq('id', id).single()
    );
    if (error) throw new Error('Billing item not found');
    return data;
  },
  async createBillingItem(data: any) {
    const { data: item, error } = await safeSupabaseInsert<any>('billing_transactions', {
      ...data,
      created_at: new Date().toISOString(),
    });
    if (error) throw new Error('Failed to create billing item');
    return item;
  },
  async updateBillingItem(id: string, data: any) {
    const { data: updated, error } = await safeSupabaseUpdate<any>(
      'billing_transactions',
      { ...data, updated_at: new Date().toISOString() },
      { id }
    );
    if (error) throw new Error('Failed to update billing item');
    return updated;
  },
  async deleteBillingItem(id: string) {
    const { error } = await supabase.from('billing_transactions').delete().eq('id', id);
    if (error) throw new Error('Failed to delete billing item');
    return { id };
  },
  async getBalanceForClient(clientId: string) {
    return billingService.getBalanceForClient(clientId);
  },
  async applyAdjustment(clientId: string, amountEUR: number, note?: string) {
    return billingService.applyAdjustment(clientId, amountEUR, note);
  },
  async createChargeForSession(
    clientId: string,
    sessionId: string,
    amountEUR: number,
    note?: string
  ) {
    return billingService.createChargeForSession(clientId, sessionId, amountEUR, note);
  },
  async createCheckoutSessionForPackage(clientId: string, packageId: string, amountEUR: number) {
    return billingService.createCheckoutSessionForPackage(clientId, packageId, amountEUR);
  },
  async getInvoicesForClient(clientId: string) {
    return billingService.getInvoicesForClient(clientId);
  },
  async createInvoice(clientId: string, amountEUR: number, description?: string) {
    const { data, error } = await safeSupabaseInsert<any>('billing_invoices', {
      user_id: clientId,
      amount: amountEUR,
      currency: 'eur',
      status: 'pending',
      description: description || 'Invoice',
      created_at: new Date().toISOString(),
    });
    if (error) throw new Error('Failed to create invoice');
    return data;
  },
  async markInvoicePaid(invoiceId: string) {
    return billingService.markInvoicePaid(invoiceId);
  },

  // Notifications
  async getNotifications() {
    return notificationService.listNotifications();
  },
  async getNotification(id: string) {
    const notifications = await notificationService.listNotifications();
    return notifications.find((n) => n.id === id) || null;
  },
  async createNotification(data: { userId: string; title: string; body?: string; type?: string }) {
    return notificationService.createNotification(data);
  },
  async updateNotification(id: string, data: any) {
    const { data: updated, error } = await safeSupabaseUpdate<any>(
      'notifications',
      { ...data, updated_at: new Date().toISOString() },
      { id }
    );
    if (error) throw new Error('Failed to update notification');
    return updated;
  },
  async deleteNotification(id: string) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw new Error('Failed to delete notification');
    return { id };
  },
  async listNotifications() {
    return notificationService.listNotifications();
  },
  async markSeen(id: string) {
    return notificationService.markSeen(id);
  },

  // Templates
  async getTemplates() {
    return templateService.listTemplates();
  },
  async getTemplate(id: string) {
    const templates = await templateService.listTemplates();
    return templates.find((t) => t.id === id) || null;
  },
  async createTemplate(data: any) {
    return templateService.createTemplate(data);
  },
  async updateTemplate(id: string, data: any) {
    const { data: updated, error } = await safeSupabaseUpdate<any>(
      'templates',
      { ...data, updated_at: new Date().toISOString() },
      { id }
    );
    if (error) throw new Error('Failed to update template');
    return updated;
  },
  async deleteTemplate(id: string) {
    return templateService.deleteTemplate(id);
  },

  // Settings with production-grade error handling
  async getSettings() {
    return await withRetry(
      async () => {
        const stored = await safeGetItem('app_settings');
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (error) {
            logger.warn('Failed to parse settings, returning empty object', error as Error);
            return {};
          }
        }
        return {};
      },
      {},
      { operation: 'getSettings' }
    );
  },

  async updateSettings(updates: any) {
    return await withRetry(
      async () => {
        const current = await this.getSettings();
        const updated = deepMergeSettings(current, updates);
        await safeSetItem('app_settings', JSON.stringify(updated));
        logger.info('Settings updated', { updates: Object.keys(updates) });
        return updated;
      },
      {},
      { operation: 'updateSettings' }
    );
  },

  // File upload with proper validation and error handling
  async uploadFile(file: File, path: string) {
    return await withRetry(
      async () => {
        try {
          // Validate file
          if (!file || file.size === 0) {
            throw new ValidationError('Invalid file provided');
          }

          // Validate file size (max 10MB)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (file.size > maxSize) {
            throw new ValidationError(`File size exceeds maximum allowed size of ${maxSize} bytes`);
          }

          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
          if (!allowedTypes.includes(file.type)) {
            throw new ValidationError(`File type ${file.type} is not allowed`);
          }

          logger.info(`Uploading file: ${file.name} to ${path}`);

          const { data, error } = await supabase.storage.from('user-files').upload(path, file, {
            cacheControl: '3600',
            upsert: false,
          });

          if (error) {
            throw new AppError(`File upload failed: ${error.message}`, 'STORAGE_ERROR', 500);
          }

          logger.info(`File uploaded successfully: ${file.name}`);
          return data;
        } catch (error) {
          logger.error(`File upload failed: ${file.name}`, error as Error);
          throw error;
        }
      },
      {},
      { operation: 'uploadFile', metadata: { fileName: file.name, fileSize: file.size } }
    );
  },

  async getFileUrl(path: string) {
    return await withRetry(
      async () => {
        try {
          const { data } = supabase.storage.from('user-files').getPublicUrl(path);

          if (!data?.publicUrl) {
            throw new NotFoundError(`File not found: ${path}`);
          }

          return data.publicUrl;
        } catch (error) {
          logger.error(`Failed to get file URL: ${path}`, error as Error);
          throw error;
        }
      },
      {},
      { operation: 'getFileUrl', metadata: { path } }
    );
  },

  // AI Features with proper error handling and logging
  async createReport(userId: string, report: any) {
    return await withRetry(
      async () => {
        try {
          logger.info('Creating report', { userId, reportTitle: report.title || 'Untitled' });

          const { data, error } = await safeSupabaseInsert<any>('reports', {
            user_id: userId,
            title: report.title || 'Untitled Report',
            author: report.author || 'System',
            type: report.type || 'User Report',
            summary: report.summary || '',
            created_at: report.createdAt || new Date().toISOString(),
            date: report.date || new Date().toISOString(),
            // Add other report fields as needed
          });

          if (error) {
            throw new AppError(`Failed to create report: ${error.message}`, 'DATABASE_ERROR', 500);
          }

          logger.info('Report created successfully', { reportId: data?.id, userId });
          return data;
        } catch (error) {
          logger.error('Create report failed', error as Error);
          throw error;
        }
      },
      {},
      { operation: 'createReport', metadata: { userId } }
    );
  },

  async generateAIReport(userId: string, prompt: string) {
    return await withRetry(
      async () => {
        try {
          logger.info('Generating AI report', { userId, promptLength: prompt.length });
          const { data } = await safeSupabaseQuery<any[]>(
            supabase
              .from('wellness_insights')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .limit(5)
          );
          return { userId, insights: data || [], generatedAt: new Date().toISOString() };
        } catch (error) {
          logger.error('AI report generation failed', error as Error);
          throw error;
        }
      },
      {},
      { operation: 'generateAIReport', metadata: { userId } }
    );
  },

  async getAIChatResponse(prompt: string, history: any[]) {
    // AI chat is handled via the streaming /api/ai/chat endpoint.
    // This method exists for compatibility but should not be used directly.
    logger.warn('getAIChatResponse called directly — use /api/ai/chat streaming endpoint instead');
    return { message: 'Use the AI sidebar chat for conversations.' };
  },

  async getAIRecommendations() {
    return await withRetry(
      async () => {
        try {
          logger.info('Fetching AI recommendations');
          const { data } = await safeSupabaseQuery<any[]>(
            supabase
              .from('wellness_insights')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(10)
          );
          return data || [];
        } catch (error) {
          logger.error('AI recommendations failed', error as Error);
          return [];
        }
      },
      {},
      { operation: 'getAIRecommendations' }
    );
  },
};

export default fxService;
