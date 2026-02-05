// Production-grade logging and monitoring service
import { supabase } from '@/lib/platform/supabase';
import { safeSupabaseInsert } from '@/lib/platform/supabase/utils';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  error?: Error;
}

class LoggingService {
  private static instance: LoggingService;
  private logLevel: LogLevel;
  private enableRemoteLogging: boolean;
  private enableConsoleLogging: boolean;
  private requestId: string | null = null;

  private constructor() {
    this.logLevel = this.getLogLevelFromEnv();
    this.enableRemoteLogging = process.env.NEXT_ENABLE_REMOTE_LOGGING === 'true';
    this.enableConsoleLogging = process.env.NODE_ENV !== 'production' || process.env.NEXT_ENABLE_CONSOLE_LOGGING === 'true';
  }

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.NEXT_LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'ERROR': return LogLevel.ERROR;
      case 'WARN': return LogLevel.WARN;
      case 'INFO': return LogLevel.INFO;
      case 'DEBUG': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  clearRequestId(): void {
    this.requestId = null;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const requestId = this.requestId || 'no-request-id';
    
    let formatted = `[${timestamp}] [${levelName}] [${requestId}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      formatted += ` | Error: ${error.message} | Stack: ${error.stack}`;
    }
    
    return formatted;
  }

  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.enableRemoteLogging) return;

    try {
      // Log to Supabase for persistence and analysis
      const { error } = await safeSupabaseInsert<any>(
        'system_logs',
        {
          level: LogLevel[entry.level],
          message: entry.message,
          context: entry.context || {},
          timestamp: entry.timestamp,
          user_id: entry.userId,
          session_id: entry.sessionId,
          request_id: entry.requestId,
          error_message: entry.error?.message,
          error_stack: entry.error?.stack,
        }
      );

      if (error) {
        // Fallback to console if remote logging fails
        console.error('Failed to log to remote:', error);
      }
    } catch (error) {
      console.error('Remote logging error:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      requestId: this.requestId || undefined,
      error,
    };

    // Console logging
    if (this.enableConsoleLogging) {
      const formattedMessage = this.formatMessage(level, message, context, error);
      
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
      }
    }

    // Remote logging (async, non-blocking)
    this.logToRemote(entry).catch(() => {
      // Silently handle remote logging failures to avoid infinite loops
    });
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Performance monitoring
  startTimer(name: string): () => void {
    const startTime = performance.now();
    this.info(`Timer started: ${name}`);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.info(`Timer completed: ${name}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  // User activity tracking
  trackUserActivity(userId: string, activity: string, metadata?: Record<string, any>): void {
    this.info(`User activity: ${activity}`, {
      userId,
      activity,
      ...metadata,
    });
  }

  // System health monitoring
  async checkSystemHealth(): Promise<{
    database: boolean;
    auth: boolean;
    storage: boolean;
    timestamp: string;
  }> {
    const health = {
      database: false,
      auth: false,
      storage: false,
      timestamp: new Date().toISOString(),
    };

    try {
      // Check database connection
      const { error: dbError } = await supabase.from('users').select('id').limit(1);
      health.database = !dbError;
      
      // Check auth service
      const { error: authError } = await (supabase.auth as any).getSession();
      health.auth = !authError;
      
      // Check storage service
      const { error: storageError } = await supabase.storage.listBuckets();
      health.storage = !storageError;

      this.info('System health check completed', health);
    } catch (error) {
      this.error('System health check failed', error as Error);
    }

    return health;
  }
}

// Export singleton instance
export const logger = LoggingService.getInstance();

// Convenience functions for direct usage
export const logError = (message: string, error?: Error, context?: Record<string, any>) => 
  logger.error(message, error, context);

export const logWarn = (message: string, context?: Record<string, any>) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: Record<string, any>) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: Record<string, any>) => 
  logger.debug(message, context);

export const startTimer = (name: string) => logger.startTimer(name);

export const trackUserActivity = (userId: string, activity: string, metadata?: Record<string, any>) => 
  logger.trackUserActivity(userId, activity, metadata);

export const checkSystemHealth = () => logger.checkSystemHealth();