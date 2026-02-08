import { supabase } from '@/lib/platform/supabase'; // Use client for public data

interface ServiceItem {
  id: string;
  slug?: string;
  titleKey: string;
  subtitleKey?: string;
  descriptionKey: string;
  image: string;
  href: string;
  color?: string;
  benefitsKeys?: string[];
  price?: number;
  active?: boolean;
}

interface PersonalizedServiceItem {
  id: string;
  slug?: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  href: string;
  benefitsKeys?: string[];
  resultKey?: string;
  duration?: string;
  price?: number;
}

const SERVICES_DATA: ServiceItem[] = [];
const PERSONALIZED_SERVICES_DATA: PersonalizedServiceItem[] = [];

export const servicesService = {
  /**
   * Fetches services from Supabase and merges with local UI constants.
   * This ensures we display up-to-date pricing and availability while keeping static UI assets.
   */
  async getServicesWithPricing(): Promise<{
    core: ServiceItem[];
    personalized: PersonalizedServiceItem[];
  }> {
    try {
      const { data: dbServices, error } = await supabase.from('service').select('*');

      if (error) {
        console.warn('Failed to fetch services from DB, falling back to constants:', error.message);
        return {
          core: SERVICES_DATA,
          personalized: PERSONALIZED_SERVICES_DATA,
        };
      }

      // Map DB data to a lookup map for easy merging
      const dbServiceMap = new Map(dbServices.map((s: any) => [s.slug || s.id, s]));

      // Merge Core Services
      const core = SERVICES_DATA.map((item) => {
        // Try matching by slug or id
        const dbItem = dbServiceMap.get(item.slug) || dbServiceMap.get(item.id);
        if (dbItem) {
          return {
            ...item,
            // Override with DB values if they exist
            price: dbItem.price_eur || dbItem.price || undefined, // Add price if missing in type, need to check type
            active: dbItem.active !== false,
          };
        }
        return item;
      });

      // Merge Personalized Services
      const personalized = PERSONALIZED_SERVICES_DATA.map((item) => {
        const dbItem = dbServiceMap.get(item.id); // Personalized usually matched by ID in constants
        if (dbItem) {
          return {
            ...item,
            price: dbItem.price_eur || dbItem.price || item.price,
            duration: dbItem.duration_minutes ? `${dbItem.duration_minutes} min` : item.duration,
          };
        }
        return item;
      });

      return { core, personalized };
    } catch (error) {
      console.error('Error in getServicesWithPricing:', error);
      return {
        core: SERVICES_DATA,
        personalized: PERSONALIZED_SERVICES_DATA,
      };
    }
  },
};
