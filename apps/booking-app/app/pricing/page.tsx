import { listServices } from "@/server/booking/service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const { data: services } = await listServices();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-muted py-24 text-center mb-16 px-4">
        <h1 className="text-4xl md:text-5xl font-serif mb-6">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          No hidden fees. Choose a single session or save with our membership packages.
        </p>
      </div>

      <div className="container px-4">
         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Standard Services */}
             <div className="col-span-1 md:col-span-2">
                <h2 className="text-2xl font-bold mb-8">Standard Sessions</h2>
                <div className="space-y-4">
                    {(services as any[])?.map((service) => (
                        <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border rounded-xl hover:border-primary/50 transition-colors bg-card">
                            <div className="mb-4 sm:mb-0">
                                <h3 className="font-bold text-lg">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.duration} Minutes</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-semibold">€{service.price}</span>
                                <Button asChild size="sm" variant="outline">
                                    <Link href={`/book/${service.slug || service.id}`}>Book</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Membership / Packages */}
             <div>
                <h2 className="text-2xl font-bold mb-8">Packages</h2>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 sticky top-24">
                    <h3 className="font-serif text-2xl mb-2">The Eka Series</h3>
                    <p className="text-muted-foreground text-sm mb-6">Commit to your wellbeing.</p>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-bold">€700</span>
                        <span className="text-muted-foreground">/ 5 sessions</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex gap-3 text-sm">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span>5 x 90min Structural Integration</span>
                        </li>
                        <li className="flex gap-3 text-sm">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span>Save €50 vs single sessions</span>
                        </li>
                        <li className="flex gap-3 text-sm">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span>Priority Booking</span>
                        </li>
                         <li className="flex gap-3 text-sm">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span>15% off products</span>
                        </li>
                    </ul>

                    <Button className="w-full" asChild>
                        <Link href="/contact?subject=package">Purchase Package</Link>
                    </Button>
                </div>
             </div>

         </div>
      </div>
    </div>
  );
}
