/**
 * Structured logging utility for the application
 * 
 * Provides consistent logging with context, levels, and structured data.
 * Replaces console.log/error/warn with proper logging infrastructure.
 * 
 * Features:
 * - Multiple log levels (debug, info, warn, error)
 * - Structured metadata support
 * - Environment-aware logging (dev vs production)
 * - Performance metrics tracking
 * - Error stack traces
 * 
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger';
 * 
 * // Simple log
 * logger.info('User logged in');
 * 
 * // With metadata
 * logger.info('Payment processed', { 
 *   amount: 49.99, 
 *   currency: 'USD',
 *   userId: 'user-123'
 * });
 * 
 * // Error logging
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   logger.error('Operation failed', { error, context: 'payment-flow' });
 * }
 * 
 * // Performance tracking
 * const timer = logger.startTimer();
 * await expensiveOperation();
 * timer.done('Operation completed');
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: unknown;
  error?: Error | unknown;
  duration?: number;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: LogMetadata;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private minLevel: LogLevel = this.isDevelopment ? 'debug' : 'info';

  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel];
  }

  private formatLogEntry(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      entry.message,
    ];

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      parts.push(JSON.stringify(entry.metadata, null, 2));
    }

    if (entry.stack) {
      parts.push(`\nStack: ${entry.stack}`);
    }

    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };

    // Extract stack trace if error is provided
    if (metadata?.error instanceof Error) {
      entry.stack = metadata.error.stack;
    }

    const formatted = this.formatLogEntry(entry);

    // In production, you might want to send logs to a service like:
    // - Datadog, New Relic, Sentry
    // - CloudWatch, Azure Monitor
    // - Custom logging endpoint
    
    if (this.isDevelopment) {
      // Pretty console output for development
      switch (level) {
        case 'debug':
          console.debug(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
          console.error(formatted);
          break;
      }
    } else {
      // Structured JSON for production (easy to parse by log aggregators)
      console.log(JSON.stringify(entry));
    }

    // TODO: Add production logging integration
    // this.sendToLogService(entry);
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, metadata?: LogMetadata) {
    this.log('debug', message, metadata);
  }

  /**
   * Log informational messages
   */
  info(message: string, metadata?: LogMetadata) {
    this.log('info', message, metadata);
  }

  /**
   * Log warning messages
   */
  warn(message: string, metadata?: LogMetadata) {
    this.log('warn', message, metadata);
  }

  /**
   * Log error messages
   */
  error(message: string, metadata?: LogMetadata) {
    this.log('error', message, metadata);
  }

  /**
   * Start a performance timer
   * @returns Timer object with done() method
   */
  startTimer() {
    const start = Date.now();
    
    return {
      done: (message: string, metadata?: LogMetadata) => {
        const duration = Date.now() - start;
        this.info(message, { ...metadata, duration });
      },
    };
  }

  /**
   * Log an HTTP request
   */
  http(method: string, url: string, statusCode: number, duration: number, metadata?: LogMetadata) {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    this.log(level, `${method} ${url} ${statusCode}`, {
      method,
      url,
      statusCode,
      duration,
      ...metadata,
    });
  }

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel) {
    this.minLevel = level;
  }

  /**
   * Create a child logger with default metadata
   */
  child(defaultMetadata: LogMetadata): Logger {
    const childLogger = new Logger();
    const originalLog = childLogger.log.bind(childLogger);
    
    childLogger.log = (level: LogLevel, message: string, metadata?: LogMetadata) => {
      originalLog(level, message, { ...defaultMetadata, ...metadata });
    };
    
    return childLogger;
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Create a logger for a specific context (e.g., service, component)
 * @example
 * const serviceLogger = createLogger({ service: 'PaymentService' });
 * serviceLogger.info('Processing payment', { amount: 100 });
 */
export function createLogger(defaultMetadata: LogMetadata): Logger {
  return logger.child(defaultMetadata);
}
