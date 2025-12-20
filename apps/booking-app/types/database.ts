export interface Service {
  id: string;
  created_at: string;
  updated_at?: string;
  name: string;
  description: string | null;
  price: number;
  currency?: string;
  duration: number; // in minutes
  category?: string | null;
  is_active: boolean;
  
  // Legacy/UI compatibility
  image_url?: string | null;
  location?: string | null;
  version?: string | null;
  active?: boolean;
}

export interface Appointment {
  id: string;
  user_id?: string | null;
  service_id?: string | null;
  practitioner_id?: string | null;
  
  // Scheduling
  date: string;
  time: string;
  duration: number;
  
  // Details
  session_type?: string;
  practitioner?: string;
  price: number;
  notes?: string | null;
  preferences?: any;
  is_first_time?: boolean;
  
  // Status
  status: string; // 'scheduled', 'completed', 'cancelled', etc.
  payment_status?: string;
  
  // Guest info
  guest_email?: string | null;
  guest_phone?: string | null;
  guest_name?: string | null;
  is_guest?: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  location?: string | null;
  meeting_link?: string | null;
  
  // Cancellation
  cancelled_at?: string | null;
  cancelled_reason?: string | null;
  cancelled_by?: string | null;
}

export interface Staff {
  id: string;
  created_at: string;
  name: string;
  display_name: string | null;
  email: string | null;
  bio: string | null;
  photo_url: string | null;
  specialties: string[] | null;
  active: boolean;
}
