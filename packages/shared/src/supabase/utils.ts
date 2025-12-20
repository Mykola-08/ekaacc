/**
 * Retry wrapper for critical database operations
 * @param operation The async operation to retry
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @param delayMs Initial delay in milliseconds between retries (default: 1000)
 * @returns The result of the operation
 * @throws The last error if all retries fail
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;

      // Don't retry if it's a user error (4xx)
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = String((err as any).code);
        if (errorCode.startsWith('4')) {
          throw err;
        }
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * (i + 1))
        );
      }
    }
  }

  throw lastError;
}
