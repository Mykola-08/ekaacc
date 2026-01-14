import { listServices } from "@/server/booking/service";
import { ServiceGrid } from "@/components/booking/ServiceGrid";
import { Service } from "@/types/database";

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
 const { data: services, error } = await listServices();

 if (error || !services) {
    return <div className="py-20 text-center">Failed to load services</div>;
 }

 return (
  <div className="flex flex-col min-h-screen bg-background">
   <div className="bg-card py-24 text-center border-b border-border">
    <h1 className="text-4xl lg:text-5xl font-serif font-medium mb-6 text-foreground">Our Treatments</h1>
    <p className="text-muted-foreground text-lg max-w-2xl mx-auto px-4 leading-relaxed">
     Experience structural balance and deep relaxation with our curated selection of bodywork therapies.
    </p>
   </div>

   <ServiceGrid services={services as Service[]} />
  </div>
 );
}
