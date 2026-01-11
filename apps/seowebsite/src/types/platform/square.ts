export interface SyncOptions {
  fullSync?: boolean;
  startDate?: string;
  endDate?: string;
  force?: boolean;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  errors?: string[];
  lastSync?: string;
  details?: any;
}

export interface SquareConfig {
  accessToken: string;
  environment: 'sandbox' | 'production';
  locationId: string;
}

export interface SquareBooking {
  id: string;
  [key: string]: any;
}

export interface SquareCustomer {
  id: string;
  [key: string]: any;
}

export interface NormalizedBooking {
  id: string;
  [key: string]: any;
}

export interface SquareWebhookEvent {
  merchant_id: string;
  type: string;
  event_id: string;
  created_at: string;
  data: {
    type: string;
    id: string;
    object: any;
  };
}

export interface EnhancedSquareWebhookEvent {
  type: string;
  eventId: string;
  event_id: string;
  merchantId: string;
  merchant_id: string;
  locationId?: string;
  data: any;
  created_at?: string;
  id?: string;
  timestamp?: string;
  source?: string;
}
