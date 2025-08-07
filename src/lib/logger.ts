/**
 * Production-ready logger utility
 * Uses console methods in development and can be configured for production logging
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

class Logger {
  private level: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    // In production, only show errors and warnings by default
    this.level = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const logMessage = this.formatMessage('ERROR', message, {
      ...context,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: this.isProduction ? undefined : error.stack,
        }
      })
    });

    console.error(logMessage);

    // In production, you might want to send to external logging service
    if (this.isProduction) {
      // TODO: Send to external logging service (e.g., Sentry, LogRocket)
      // this.sendToExternalService('error', logMessage, error);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage('WARN', message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(this.formatMessage('INFO', message, context));
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(this.formatMessage('DEBUG', message, context));
  }

  // Helper methods for common use cases
  api(method: string, endpoint: string, status?: number, context?: LogContext): void {
    this.info(`API ${method} ${endpoint}`, {
      ...context,
      method,
      endpoint,
      status
    });
  }

  performance(action: string, duration: number, context?: LogContext): void {
    this.debug(`Performance: ${action} took ${duration}ms`, {
      ...context,
      action,
      duration
    });
  }

  // Method to temporarily enable debug logging in production
  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports for common logging patterns
export const logError = (message: string, error?: Error | unknown, context?: LogContext) => 
  logger.error(message, error, context);

export const logWarn = (message: string, context?: LogContext) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: LogContext) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: LogContext) => 
  logger.debug(message, context);

// Performance measurement utility
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>,
  context?: LogContext
): T extends Promise<any> ? Promise<T> : T {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        logger.performance(name, duration, context);
      }) as any;
    } else {
      const duration = performance.now() - start;
      logger.performance(name, duration, context);
      return result as any;
    }
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Performance measurement failed for ${name}`, error, {
      ...context,
      duration
    });
    throw error;
  }
}