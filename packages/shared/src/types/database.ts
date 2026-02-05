export interface ServiceVariant {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  currency: string;
  stripe_price_id?: string | null;
  features?: string[] | null;
  comparison_label?: string | null;
}

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
  
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
  metadata?: Record<string, unknown> | null;
  variants?: ServiceVariant[];
  images?: string[] | null;
  image_url?: string | null;
  slug?: string;
}
