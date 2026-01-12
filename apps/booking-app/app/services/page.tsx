import { listServices } from "@/server/booking/service";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const { data: services } = await listServices();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-muted/30 py-24 text-center animate-fade-in">
        <h1 className="text-4xl font-serif mb-4 text-foreground">Our Treatments</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-4">
          Experience structural balance and deep relaxation with our curated selection of bodywork therapies.
        </p>
      </div>

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services as any[])?.map((service, index) => (
            <div key={service.id} className="flex flex-col h-full animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}> 
               <ServiceCard service={service} />
               {service.slug && (
                   <div className="mt-4 text-center">
                       <Button variant="link" asChild className="text-primary hover:text-primary/80">
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
