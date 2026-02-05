import { ErrorInfo } from 'react';

export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // Hook placeholder for integrating error reporting service
  };
}
