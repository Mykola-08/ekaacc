import PersonalizedServicesContent from './content';
import { createClient } from '@/lib/platform/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PersonalizedServicesPage() {
  let services = [];
  try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('service')
        .select('*')
        .contains('tags', ['personalized'])
        .eq('active', true)
        .order('created_at', { ascending: true });

      if (!error && data) {
        services = data;
      } else if (error) {
        console.error("Supabase Error (Personalized):", error);
      }
  } catch (e) {
      console.error("Fetch Error:", e);
  }

  return <PersonalizedServicesContent services={services} />;
}
