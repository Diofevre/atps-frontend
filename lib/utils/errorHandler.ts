/**
 * Error Handling Utilities
 * 
 * Centralized error handling system for consistent error management
 * across the application.
 */

/**
 * Custom application error class with error codes
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Predefined error codes
 */
export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_EXPIRED_TOKEN: 'AUTH_EXPIRED_TOKEN',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',

  // Unknown errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Create a standardized error response
 */
export const createErrorResponse = (
  error: unknown,
  defaultMessage: string = 'An error occurred'
) => {
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || defaultMessage,
      code: ErrorCodes.UNKNOWN_ERROR,
    };
  }

  return {
    success: false,
    message: defaultMessage,
    code: ErrorCodes.UNKNOWN_ERROR,
  };
};

/**
 * Check if an error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Log error in a standardized way
 * In production, this should send to error tracking service
 */
export const logError = (error: unknown, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, error);
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error, { contexts: { custom: { context } } });
  }
};
