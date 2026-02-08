// Production-grade error handling and retry utilities
import { logger } from '@/lib/platform/services/logging';

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxDelay: number;
  retryCondition: (error: Error) => boolean;
}

export interface ErrorContext {
  operation: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'VALIDATION_ERROR', 400, true, context);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: ErrorContext) {
    super(message, 'AUTHENTICATION_ERROR', 401, true, context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: ErrorContext) {
    super(message, 'AUTHORIZATION_ERROR', 403, true, context);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, context?: ErrorContext) {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404, true, context);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'CONFLICT_ERROR', 409, true, context);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', context?: ErrorContext) {
    super(message, 'RATE_LIMIT_ERROR', 429, true, context);
    this.name = 'RateLimitError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable', context?: ErrorContext) {
    super(message, 'SERVICE_UNAVAILABLE_ERROR', 503, true, context);
    this.name = 'ServiceUnavailableError';
  }
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 30000,
  retryCondition: (error: Error) => {
    // Retry on network errors, timeouts, and server errors
    if (error instanceof AppError) {
      return error.statusCode >= 500 || error.code === 'NETWORK_ERROR';
    }

    // Retry on common network/transient errors
    const retryableErrors = [
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'ECONNRESET',
      'EPIPE',
      'NetworkError',
      'TimeoutError',
    ];

    return retryableErrors.some(
      (retryable) => error.message.includes(retryable) || error.name.includes(retryable)
    );
  },
};

export class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, context?: ErrorContext): AppError {
    // Log the error
    logger.error(`Error in ${context?.operation || 'unknown operation'}: ${error.message}`, error, {
      context,
      errorType: error.constructor.name,
    });

    // If it's already an AppError, return it as-is
    if (error instanceof AppError) {
      return error;
    }

    // Convert common errors to AppError types
    if (this.isValidationError(error)) {
      return new ValidationError(error.message, context);
    }

    if (this.isAuthenticationError(error)) {
      return new AuthenticationError(error.message, context);
    }

    if (this.isAuthorizationError(error)) {
      return new AuthorizationError(error.message, context);
    }

    if (this.isNotFoundError(error)) {
      return new NotFoundError(error.message, context);
    }

    if (this.isConflictError(error)) {
      return new ConflictError(error.message, context);
    }

    if (this.isRateLimitError(error)) {
      return new RateLimitError(error.message, context);
    }

    // Default to internal server error
    return new AppError(
      'An internal server error occurred',
      'INTERNAL_SERVER_ERROR',
      500,
      false,
      context
    );
  }

  private isValidationError(error: Error): boolean {
    const validationKeywords = [
      'validation',
      'invalid',
      'required',
      'format',
      'schema',
      'constraint',
    ];
    return validationKeywords.some((keyword) => error.message.toLowerCase().includes(keyword));
  }

  private isAuthenticationError(error: Error): boolean {
    const authKeywords = [
      'authentication',
      'unauthorized',
      'invalid token',
      'expired token',
      'login required',
    ];
    return authKeywords.some((keyword) => error.message.toLowerCase().includes(keyword));
  }

  private isAuthorizationError(error: Error): boolean {
    const authzKeywords = [
      'permission',
      'forbidden',
      'access denied',
      'insufficient',
      'not allowed',
    ];
    return authzKeywords.some((keyword) => error.message.toLowerCase().includes(keyword));
  }

  private isNotFoundError(error: Error): boolean {
    const notFoundKeywords = ['not found', 'does not exist', 'no such', 'missing'];
    return notFoundKeywords.some((keyword) => error.message.toLowerCase().includes(keyword));
  }

  private isConflictError(error: Error): boolean {
    const conflictKeywords = ['conflict', 'duplicate', 'already exists', 'unique constraint'];
    return conflictKeywords.some((keyword) => error.message.toLowerCase().includes(keyword));
  }

  private isRateLimitError(error: Error): boolean {
    const rateLimitKeywords = ['rate limit', 'too many', 'quota exceeded', 'throttled'];
    return rateLimitKeywords.some((keyword) => error.message.toLowerCase().includes(keyword));
  }
}

export const errorHandler = ErrorHandler.getInstance();

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  context?: ErrorContext
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      logger.debug(
        `Attempting operation: ${context?.operation || 'unknown'} (attempt ${attempt + 1})`
      );
      const result = await operation();

      if (attempt > 0) {
        logger.info(`Operation succeeded after ${attempt + 1} attempts`, {
          operation: context?.operation,
          attempts: attempt + 1,
        });
      }

      return result;
    } catch (error: any) {
      lastError = error;

      if (attempt < retryConfig.maxRetries && retryConfig.retryCondition(error)) {
        const delay = Math.min(
          retryConfig.retryDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
          retryConfig.maxDelay
        );

        logger.warn(`Operation failed, retrying in ${delay}ms`, {
          operation: context?.operation,
          attempt: attempt + 1,
          maxRetries: retryConfig.maxRetries,
          error: error.message,
        });

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // No more retries
      break;
    }
  }

  // All retries exhausted
  logger.error(
    `Operation failed after ${retryConfig.maxRetries + 1} attempts`,
    lastError || undefined,
    context
  );

  throw lastError || new Error('Operation failed');
}

export function createErrorBoundary(operation: string, fallback?: (error: AppError) => any) {
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (error: any) {
      const appError = errorHandler.handleError(error, { operation });

      if (fallback) {
        return fallback(appError) as T;
      }

      throw appError;
    }
  };
}

// Utility to handle async operations with proper error handling
export async function safeOperation<T>(
  operation: () => Promise<T>,
  context: ErrorContext
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error: any) {
    const appError = errorHandler.handleError(error, context);
    return { data: null, error: appError };
  }
}
