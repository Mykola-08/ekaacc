import { listServices } from "@/server/booking/service";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const { data: services } = await listServices();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-muted/30 py-24 text-center">
        <h1 className="text-4xl font-serif mb-4">Our Treatments</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-4">
          Experience structural balance and deep relaxation with our curated selection of bodywork therapies.
        </p>
      </div>

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services as any[])?.map((service) => (
            <div key={service.id} className="flex flex-col h-full"> 
               {/* 
                 We wrap the card in a Link if it has a slug, to go to detail page.
                 Otherwise, the card's internal booking button handles action.
                 Actually, ServiceCard usually has a button. Let's wrap it for the 'Learn More' effect or add a link below.
               */}
               <ServiceCard service={service} />
               {service.slug && (
                   <div className="mt-4 text-center">
                       <Button variant="link" asChild>
                           <Link href={`/services/${service.slug}`}>View Details &rarr;</Link>
                       </Button>
                   </div>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
