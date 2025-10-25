/**
 * Standardized API Response Format
 * Used across all backend operations for consistent error handling and data structure
 */

export type ResponseCode =
  | 'SUCCESS'
  | 'ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

export type ApiResponse<T = any> =
  | {
      code: 'SUCCESS';
      data: T;
      message: string;
    }
  | {
      code: ResponseCode;
      error: string;
      message: string;
    };

// Success response helper
export function createSuccessResponse<T>(
  data: T,
  message = 'Operation completed successfully'
): ApiResponse<T> {
  return {
    code: 'SUCCESS',
    data,
    message,
  };
}

// Error response helpers
export function createErrorResponse(
  error: string,
  code: ResponseCode = 'ERROR',
  message = 'An error occurred'
): ApiResponse<never> {
  return {
    code,
    error,
    message,
  };
}

export function createValidationErrorResponse(
  error: string,
  message = 'Validation failed'
): ApiResponse {
  return {
    code: 'VALIDATION_ERROR',
    error,
    message,
  };
}

export function createUnauthorizedResponse(message = 'Authentication required'): ApiResponse {
  return {
    code: 'UNAUTHORIZED',
    error: 'User not authenticated',
    message,
  };
}