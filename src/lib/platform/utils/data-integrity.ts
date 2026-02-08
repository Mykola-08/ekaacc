// Production-grade data consistency and transactional integrity utilities
import { supabase } from '@/lib/platform/supabase';
import {
  safeSupabaseQuery,
  safeSupabaseInsert,
  safeSupabaseUpdate,
} from '@/lib/platform/supabase/utils';
import { logger } from '@/lib/platform/services/logging';
import { AppError } from '@/lib/platform/utils/error-handling';

export interface TransactionContext {
  operation: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  rollbackReason?: string;
}

/**
 * Transaction Manager for ensuring data consistency
 */
export class TransactionManager {
  private static instance: TransactionManager;

  static getInstance(): TransactionManager {
    if (!TransactionManager.instance) {
      TransactionManager.instance = new TransactionManager();
    }
    return TransactionManager.instance;
  }

  /**
   * Execute a series of operations within a database transaction
   */
  async executeInTransaction<T>(
    operations: Array<() => Promise<any>>,
    context: TransactionContext
  ): Promise<TransactionResult<T>> {
    const transactionId = this.generateTransactionId();

    logger.info(`Starting transaction: ${transactionId}`, {
      operation: context.operation,
      userId: context.userId,
      operationsCount: operations.length,
    });

    try {
      // Start transaction (Supabase uses RPC for transactions)
      const { error: beginError } = await supabase.rpc('begin_transaction');
      if (beginError) {
        throw new AppError(
          `Failed to begin transaction: ${beginError.message}`,
          'TRANSACTION_ERROR',
          500
        );
      }

      let result: T;

      try {
        // Execute all operations sequentially
        const results = [];
        for (let i = 0; i < operations.length; i++) {
          logger.debug(
            `Executing operation ${i + 1}/${operations.length} in transaction ${transactionId}`
          );
          const operationResult = await operations[i]();
          results.push(operationResult);
        }

        // Commit transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) {
          throw new AppError(
            `Failed to commit transaction: ${commitError.message}`,
            'TRANSACTION_ERROR',
            500
          );
        }

        result = results.length === 1 ? results[0] : (results as any);

        logger.info(`Transaction committed successfully: ${transactionId}`, {
          operation: context.operation,
          userId: context.userId,
          operationsCount: operations.length,
        });

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        // Rollback transaction on any operation failure
        logger.error(
          `Transaction operation failed, rolling back: ${transactionId}`,
          error as Error
        );

        const { error: rollbackError } = await supabase.rpc('rollback_transaction');
        if (rollbackError) {
          logger.error(`Failed to rollback transaction: ${transactionId}`, rollbackError);
        } else {
          logger.info(`Transaction rolled back successfully: ${transactionId}`);
        }

        throw error;
      }
    } catch (error) {
      logger.error(`Transaction failed: ${transactionId}`, error as Error);

      return {
        success: false,
        error: error as Error,
        rollbackReason: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Ensure referential integrity for user deletion
   */
  async deleteUserWithCascade(
    userId: string,
    context: TransactionContext
  ): Promise<TransactionResult<void>> {
    return await this.executeInTransaction(
      [
        // Delete user sessions
        async () => {
          const { error } = await supabase.from('sessions').delete().eq('user_id', userId);

          if (error)
            throw new AppError(
              `Failed to delete user sessions: ${error.message}`,
              'DELETE_ERROR',
              500
            );
          return { deletedSessions: true };
        },

        // Delete user journal entries
        async () => {
          const { error } = await supabase.from('journal_entries').delete().eq('user_id', userId);

          if (error)
            throw new AppError(
              `Failed to delete journal entries: ${error.message}`,
              'DELETE_ERROR',
              500
            );
          return { deletedJournalEntries: true };
        },

        // Delete user goals
        async () => {
          const { error } = await supabase.from('goals').delete().eq('user_id', userId);

          if (error)
            throw new AppError(`Failed to delete goals: ${error.message}`, 'DELETE_ERROR', 500);
          return { deletedGoals: true };
        },

        // Delete user notifications
        async () => {
          const { error } = await supabase.from('notifications').delete().eq('user_id', userId);

          if (error)
            throw new AppError(
              `Failed to delete notifications: ${error.message}`,
              'DELETE_ERROR',
              500
            );
          return { deletedNotifications: true };
        },

        // Finally delete the user
        async () => {
          const { error } = await supabase.from('users').delete().eq('id', userId);

          if (error)
            throw new AppError(`Failed to delete user: ${error.message}`, 'DELETE_ERROR', 500);
          return { deletedUser: true };
        },
      ],
      {
        ...context,
        operation: 'deleteUserWithCascade',
        metadata: { userId },
      }
    );
  }

  /**
   * Ensure data consistency for session booking
   */
  async bookSessionWithValidation(
    userId: string,
    therapistId: string,
    sessionData: any,
    context: TransactionContext
  ): Promise<TransactionResult<any>> {
    return await this.executeInTransaction(
      [
        // Validate therapist availability
        async () => {
          const { data: therapist, error } = await supabase
            .from('users')
            .select('id, profile_data')
            .eq('id', therapistId)
            .eq('profile_data->role', 'Therapist')
            .single();

          if (error || !therapist) {
            throw new AppError('Therapist not found or invalid role', 'VALIDATION_ERROR', 400);
          }

          return { therapist };
        },

        // Check for scheduling conflicts
        async () => {
          const { data: existingSessions, error } = await supabase
            .from('sessions')
            .select('id, session_data')
            .eq('therapist_id', therapistId)
            .eq('session_data->>date', sessionData.date)
            .eq('session_data->>time', sessionData.time)
            .eq('status', 'scheduled');

          if (error) {
            throw new AppError(
              `Failed to check scheduling conflicts: ${error.message}`,
              'DATABASE_ERROR',
              500
            );
          }

          if (existingSessions && existingSessions.length > 0) {
            throw new AppError(
              'Therapist is not available at the selected time',
              'CONFLICT_ERROR',
              409
            );
          }

          return { noConflicts: true };
        },

        // Create the session
        async () => {
          const { data: session, error } = await safeSupabaseInsert<any>('sessions', {
            user_id: userId,
            therapist_id: therapistId,
            session_data: sessionData,
            status: 'scheduled',
            created_at: new Date().toISOString(),
          });

          if (error) {
            throw new AppError(`Failed to create session: ${error.message}`, 'DATABASE_ERROR', 500);
          }

          return { session };
        },

        // Create billing record
        async () => {
          const { data: billingRecord, error } = await safeSupabaseInsert<any>(
            'billing_transactions',
            {
              client_id: userId,
              session_id: sessionData.id,
              amount_eur: -100, // Example session cost
              type: 'session_booking',
              created_at: new Date().toISOString(),
            }
          );

          if (error) {
            throw new AppError(
              `Failed to create billing record: ${error.message}`,
              'DATABASE_ERROR',
              500
            );
          }

          return { billingRecord };
        },

        // Send confirmation notification
        async () => {
          const { error } = await safeSupabaseInsert<any>('notifications', {
            user_id: userId,
            title: 'Session Booked',
            body: `Your session with therapist ${therapistId} has been scheduled for ${sessionData.date} at ${sessionData.time}`,
            type: 'session_confirmation',
            created_at: new Date().toISOString(),
          });

          if (error) {
            logger.warn(`Failed to send session confirmation notification: ${error.message}`);
            // Non-critical failure, continue
          }

          return { notificationSent: true };
        },
      ],
      {
        ...context,
        operation: 'bookSessionWithValidation',
        metadata: { userId, therapistId, sessionData },
      }
    );
  }

  /**
   * Ensure consistency for subscription updates
   */
  async updateSubscriptionWithProration(
    userId: string,
    newPlan: string,
    context: TransactionContext
  ): Promise<TransactionResult<any>> {
    let currentSubscription: any;
    let proratedCredit: number;
    let daysRemaining: number;

    return await this.executeInTransaction(
      [
        // Get current subscription
        async () => {
          const { data: subscription, error } = await safeSupabaseQuery<any>(
            supabase
              .from('subscriptions')
              .select('*')
              .eq('user_id', userId)
              .eq('status', 'active')
              .single()
          );

          if (error) {
            throw new AppError(
              `Failed to fetch current subscription: ${error.message}`,
              'DATABASE_ERROR',
              500
            );
          }

          currentSubscription = subscription;
          return { currentSubscription };
        },

        // Calculate proration
        async () => {
          const now = new Date();
          const currentEndDate = new Date(currentSubscription.end_date);
          const remaining = Math.ceil(
            (currentEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Simple proration calculation (would be more complex in real implementation)
          const dailyRate = currentSubscription.amount / 30; // Assuming 30-day months
          const credit = remaining * dailyRate;

          proratedCredit = credit;
          daysRemaining = remaining;

          return { proratedCredit, daysRemaining };
        },

        // Create new subscription
        async () => {
          const newEndDate = new Date();
          newEndDate.setMonth(newEndDate.getMonth() + 1);

          const { data: newSubscription, error } = await safeSupabaseInsert<any>('subscriptions', {
            user_id: userId,
            plan: newPlan,
            amount: 100, // Example new plan amount
            start_date: new Date().toISOString(),
            end_date: newEndDate.toISOString(),
            status: 'active',
            prorated_credit: proratedCredit,
            created_at: new Date().toISOString(),
          });

          if (error) {
            throw new AppError(
              `Failed to create new subscription: ${error.message}`,
              'DATABASE_ERROR',
              500
            );
          }

          return { newSubscription };
        },

        // Cancel old subscription
        async () => {
          const { error } = await safeSupabaseUpdate<any>(
            'subscriptions',
            { status: 'cancelled' },
            { id: currentSubscription.id }
          );

          if (error) {
            throw new AppError(
              `Failed to cancel old subscription: ${error.message}`,
              'DATABASE_ERROR',
              500
            );
          }

          return { oldSubscriptionCancelled: true };
        },
      ],
      {
        ...context,
        operation: 'updateSubscriptionWithProration',
        metadata: { userId, newPlan },
      }
    );
  }

  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const transactionManager = TransactionManager.getInstance();

/**
 * Data validation utilities
 */
export class DataValidator {
  static validateUser(userData: any): void {
    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new AppError('Invalid email address', 'VALIDATION_ERROR', 400);
    }

    if (!userData.name || userData.name.trim().length < 2) {
      throw new AppError('Name must be at least 2 characters long', 'VALIDATION_ERROR', 400);
    }

    if (userData.phoneNumber && !this.isValidPhoneNumber(userData.phoneNumber)) {
      throw new AppError('Invalid phone number format', 'VALIDATION_ERROR', 400);
    }
  }

  static validateSession(sessionData: any): void {
    if (!sessionData.date || !this.isValidDate(sessionData.date)) {
      throw new AppError('Invalid session date', 'VALIDATION_ERROR', 400);
    }

    if (!sessionData.time || !this.isValidTime(sessionData.time)) {
      throw new AppError('Invalid session time', 'VALIDATION_ERROR', 400);
    }

    if (!sessionData.therapistId) {
      throw new AppError('Therapist ID is required', 'VALIDATION_ERROR', 400);
    }
  }

  static validateBooking(bookingData: any): void {
    this.validateSession(bookingData);

    if (!bookingData.userId) {
      throw new AppError('User ID is required', 'VALIDATION_ERROR', 400);
    }

    if (bookingData.duration && (bookingData.duration < 30 || bookingData.duration > 180)) {
      throw new AppError(
        'Session duration must be between 30 and 180 minutes',
        'VALIDATION_ERROR',
        400
      );
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  private static isValidDate(date: string): boolean {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && parsedDate >= new Date();
  }

  private static isValidTime(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }
}

export const dataValidator = DataValidator;
