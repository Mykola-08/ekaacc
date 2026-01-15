
import { createClient } from '@/lib/supabase/server';

export interface ServiceProduct {
  id: string;
  name: string;
  description: string;
  type: 'service' | 'product' | 'wallet_credit' | 'membership';
  metadata: any;
  variants: any[];
}

export class CatalogService {
  
  /**
   * Get all wallet top-up options
   */
  async getWalletTopups() {
    const supabase = await createClient();
    const { data } = await supabase
      .from('service')
      .select('*')
      .eq('type', 'wallet_credit')
      .eq('active', true)
      .order('metadata->>credit_amount', { ascending: true }); // Sort by value
      
    return data;
  }

  /**
   * Get bookable services with full metadata
   */
  async getBookableServices() {
    const supabase = await createClient();
    const { data } = await supabase
      .from('service')
      .select(`
        *,
        variants:service_variant(*)
      `)
      .eq('type', 'service')
      .eq('is_public', true)
      .eq('active', true);
      
    return data;
  }

  /**
   * Create a new product/service (Admin)
   */
  async createProduct(input: Partial<ServiceProduct>) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('service')
      .insert({
        name: input.name,
        description: input.description,
        type: input.type,
        metadata: input.metadata || {},
        is_public: true
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}
