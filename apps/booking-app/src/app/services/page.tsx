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
  <div className="flex flex-col min-h-screen bg-background pt-24 pb-16">
   <div className="max-w-4xl mx-auto px-6 text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <h1 className="text-4xl md:text-5xl font-sans font-semibold tracking-tight text-foreground">Our Treatments</h1>
    <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
     Experience structural balance and deep relaxation with our curated selection of bodywork therapies.
    </p>
   </div>

   <div className="max-w-7xl mx-auto px-6">
      <ServiceGrid services={services as Service[]} />
   </div>
  </div>
 );
}
