import ServicesContent from './content';
import { createClient } from '@/lib/platform/supabase/server';

// Opt out of caching for now to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  // Use a try-catch to ensure the page doesn't crash if DB is unreachable (fallback to empty)
  let services = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('service')
        .select('*')
        .contains('tags', ['general'])
        .eq('active', true)
        .order('created_at', { ascending: true });
        
    if (!error && data) {
        services = data;
    } else if (error) {
        console.error("Supabase Error:", error);
    }
  } catch (e) {
      console.error("Services fetch error:", e);
  }

  return <ServicesContent services={services} />;
}
