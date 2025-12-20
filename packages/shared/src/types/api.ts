/**
 * Standard API response format
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * API error response
 */
export type ApiError = {
  success: false;
  error: string;
  code?: string;
  details?: any;
};

/**
 * Health check response
 */
export type HealthCheckResponse = {
  status: 'ok' | 'error' | 'degraded';
  timestamp: string;
  service?: string;
  env?: string;
  database?: string;
  error?: string;
};

/**
 * Paginated response
 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};
