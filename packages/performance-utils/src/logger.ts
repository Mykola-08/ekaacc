/**
 * Enhanced Logger Service
 * 
 * Provides structured logging with:
 * - Log levels
 * - Context preservation
 * - Production-safe logging
 * - Performance tracking
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: number;
  stack?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.isDevelopment) return;
    this.log('debug', message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const logContext = {
      ...context,
      errorMessage: error?.message,
      errorName: error?.name
    };
    
    this.log('error', message, logContext, error?.stack);

    // In production, send to error tracking service
    if (!this.isDevelopment) {
      this.sendToErrorTracking(message, error, logContext);
    }
  }

  /**
   * Track performance of an operation
   */
  async trackPerformance<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.info(`${operation} completed`, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
        success: true
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.error(`${operation} failed`, error as Error, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
        success: false
      });
      
      throw error;
    }
  }

  /**
   * Track database query performance
   */
  async trackQuery<T>(
    queryName: string,
    query: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    return this.trackPerformance(`DB Query: ${queryName}`, query, context);
  }

  /**
   * Core log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    stack?: string
  ): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: Date.now(),
      stack
    };

    // Store in memory (limited)
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with proper formatting
    const formattedMessage = this.formatMessage(entry);
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, context || '');
        break;
      case 'info':
        console.info(formattedMessage, context || '');
        break;
      case 'warn':
        console.warn(formattedMessage, context || '');
        break;
      case 'error':
        console.error(formattedMessage, context || '', stack || '');
        break;
    }
  }

  /**
   * Format log message
   */
  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    
    let formatted = `[${timestamp}] ${level} ${entry.message}`;
    
    if (entry.context) {
      if (entry.context.component) {
        formatted += ` [${entry.context.component}]`;
      }
      if (entry.context.action) {
        formatted += ` (${entry.context.action})`;
      }
    }
    
    return formatted;
  }

  /**
   * Send error to tracking service (e.g., Sentry)
   */
  private sendToErrorTracking(
    message: string,
    error?: Error,
    context?: LogContext
  ): void {
    // TODO: Integrate with actual error tracking service
    // Example: Sentry.captureException(error, { contexts: { custom: context } });
    
    // For now, just log to console in production
    if (typeof window !== 'undefined' && (window as any).__ERROR_TRACKER__) {
      (window as any).__ERROR_TRACKER__.track({
        message,
        error: error?.toString(),
        context
      });
    }
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const logger = new Logger();

// Helper functions for common use cases
export const logDatabaseQuery = async <T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> => {
  return logger.trackQuery(queryName, query);
};

export const logPerformance = async <T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> => {
  return logger.trackPerformance(operation, fn, context);
};
