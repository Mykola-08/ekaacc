export interface Service {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  duration: number; // in minutes
  image_url: string | null;
  location?: string | null;
  version?: string | null;
  active?: boolean;
  is_active?: boolean; // Handle both conventions
}

export interface AnonService extends Service {
  original_service_id?: string | null;
}
