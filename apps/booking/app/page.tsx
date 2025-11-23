import { createClient } from '@/lib/supabaseClient';
import { Service } from '@/types/database';
import { BookingModal } from '@/components/BookingModal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const revalidate = 0;

async function getServices() {
  const supabase = await createClient();
  
  // Try fetching from anon_services first
  let { data, error } = await supabase
    .from('anon_services')
    .select('*')
    .eq('is_active', true);

  // Fallback to services if table missing
  if (error && error.code === '42P01') {
    const res = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true);
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data as Service[];
}

export default async function Home() {
  const services = await getServices();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Eka Booking</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Services</h2>
            {services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    {service.image_url && (
                      <img className="h-48 w-full object-cover" src={service.image_url} alt={service.name} />
                    )}
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>
                        {service.description}
                        {(service.location || service.version) && (
                          <div className="mt-2 flex gap-2 text-xs text-gray-500">
                            {service.location && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100">
                                📍 {service.location}
                              </span>
                            )}
                            {service.version && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                                🏷️ {service.version}
                              </span>
                            )}
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-indigo-600">${service.price}</span>
                        <span className="text-sm text-gray-500">{service.duration} mins</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <BookingModal service={service} />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">No services found. Please check your connection or add services to the database.</p>
                <p className="text-sm text-gray-400 mt-2">Make sure you have set up your .env.local file with Supabase credentials.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
