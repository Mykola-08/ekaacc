// Production-grade service with comprehensive error handling and logging
import { fxTemplates } from './fx-templates';
import { fxNotifications } from './fx-notifications';
import { fxBookings } from './fx-bookings';
import { fxAssessments } from './fx-assessments';
import { fxBilling } from './fx-billing';
import { fxUsers } from './fx-users';
import { logger } from './logging';
import { withRetry, safeOperation, AppError, ValidationError, NotFoundError } from './error-handling';
import { supabase } from './supabase';

// Production-grade storage with proper error handling and validation
async function safeGetItem(key: string): Promise<string | null> {
  return await withRetry(async () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      
      // Server-side: check Supabase user settings
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', key)
        .single();
      
      if (error) {
        logger.debug(`Setting not found: ${key}`);
        return null;
      }
      
      return data?.value || null;
    } catch (error) {
      logger.error(`Error getting setting: ${key}`, error as Error);
      return null;
    }
  }, {}, { operation: 'safeGetItem', metadata: { key } });
}

async function safeSetItem(key: string, value: string): Promise<void> {
  await withRetry(async () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      
      // Server-side: store in Supabase user settings
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new AppError('User not authenticated', 'AUTHENTICATION_ERROR', 401);
      }
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key,
          value,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw new AppError(`Failed to save setting: ${error.message}`, 'DATABASE_ERROR', 500);
      }
      
      logger.debug(`Setting saved: ${key}`);
    } catch (error) {
      logger.error(`Error saving setting: ${key}`, error as Error);
      throw error;
    }
  }, {}, { operation: 'safeSetItem', metadata: { key } });
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

  // Settings with production-grade error handling
  async getSettings() {
    return await withRetry(async () => {
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
    }, {}, { operation: 'getSettings' });
  },
  
  async updateSettings(updates: any) {
    return await withRetry(async () => {
      const current = await this.getSettings();
      const updated = deepMergeSettings(current, updates);
      await safeSetItem('app_settings', JSON.stringify(updated));
      logger.info('Settings updated', { updates: Object.keys(updates) });
      return updated;
    }, {}, { operation: 'updateSettings' });
  },

  // File upload with proper validation and error handling
  async uploadFile(file: File, path: string) {
    return await withRetry(async () => {
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
        
        const { data, error } = await supabase.storage
          .from('user-files')
          .upload(path, file, {
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
    }, {}, { operation: 'uploadFile', metadata: { fileName: file.name, fileSize: file.size } });
  },

  async getFileUrl(path: string) {
    return await withRetry(async () => {
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
    }, {}, { operation: 'getFileUrl', metadata: { path } });
  },

  // AI Features with proper error handling and logging
  async createReport(userId: string, report: any) {
    return await withRetry(async () => {
      try {
        logger.info('Creating report', { userId, reportTitle: report.title || 'Untitled' });
        
        const { data, error } = await supabase
          .from('reports')
          .insert([{
            user_id: userId,
            title: report.title || 'Untitled Report',
            author: report.author || 'System',
            type: report.type || 'User Report',
            summary: report.summary || '',
            created_at: report.createdAt || new Date().toISOString(),
            date: report.date || new Date().toISOString(),
            // Add other report fields as needed
          }])
          .select()
          .single();

        if (error) {
          throw new AppError(`Failed to create report: ${error.message}`, 'DATABASE_ERROR', 500);
        }

        logger.info('Report created successfully', { reportId: data.id, userId });
        return data;
      } catch (error) {
        logger.error('Create report failed', error as Error);
        throw error;
      }
    }, {}, { operation: 'createReport', metadata: { userId } });
  },

  async generateAIReport(userId: string, prompt: string) {
    return await withRetry(async () => {
      try {
        logger.info('Generating AI report', { userId, promptLength: prompt.length });
        
        // Implementation would integrate with AI service
        // For now, return a placeholder
        throw new AppError('AI report generation not implemented', 'NOT_IMPLEMENTED_ERROR', 501);
      } catch (error) {
        logger.error('AI report generation failed', error as Error);
        throw error;
      }
    }, {}, { operation: 'generateAIReport', metadata: { userId } });
  },

  async getAIChatResponse(prompt: string, history: any[]) {
    return await withRetry(async () => {
      try {
        logger.info('Processing AI chat response', { promptLength: prompt.length, historyLength: history.length });
        
        // Implementation would integrate with AI service
        throw new AppError('AI chat response not implemented', 'NOT_IMPLEMENTED_ERROR', 501);
      } catch (error) {
        logger.error('AI chat response failed', error as Error);
        throw error;
      }
    }, {}, { operation: 'getAIChatResponse' });
  },

  async getAIRecommendations() {
    return await withRetry(async () => {
      try {
        logger.info('Fetching AI recommendations');
        
        // Implementation would integrate with AI service
        throw new AppError('AI recommendations not implemented', 'NOT_IMPLEMENTED_ERROR', 501);
      } catch (error) {
        logger.error('AI recommendations failed', error as Error);
        throw error;
      }
    }, {}, { operation: 'getAIRecommendations' });
  },

  // Storage - removed duplicate implementations
  // AI Features - removed duplicate implementations
};

export default fxService;
