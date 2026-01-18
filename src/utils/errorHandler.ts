import { ApiError } from '../lib/sdk';

/**
 * Error codes that indicate space does not exist or is invalid
 */
const SPACE_ERROR_CODES = ['space_not_found', 'invalid_space', 'forbidden'];

/**
 * Check if error is related to invalid space
 */
export function isInvalidSpaceError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return SPACE_ERROR_CODES.includes(error.code);
  }

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    return errorMessage.includes('space') &&
           (errorMessage.includes('not found') ||
            errorMessage.includes('does not exist') ||
            errorMessage.includes('invalid') ||
            errorMessage.includes('deleted'));
  }

  return false;
}

/**
 * Check if error is a network/HTTP error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status >= 500 || error.status === 0;
  }

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    return errorMessage.includes('network') ||
           errorMessage.includes('connection') ||
           errorMessage.includes('timeout');
  }

  return false;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
