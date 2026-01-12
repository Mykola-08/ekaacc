import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BusinessPage() {
 return (
  <div className="min-h-screen bg-background">
   {/* Hero */}
   <section className="bg-primary/5 py-24 md:py-32">
    <div className="container px-4 text-center">
     <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">
      Corporate Wellness Reimagined
     </h1>
     <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
      Boost employee productivity and morale with on-site structural integration and massage therapy sessions tailored for the modern workplace.
     </p>
     <div className="flex gap-4 justify-center">
      <Button size="lg" asChild>
       <Link href="/contact">Contact Sales</Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
       <Link href="/pricing">View Plans</Link>
      </Button>
     </div>
    </div>
   </section>

   {/* Benefits */}
   <section className="py-24">
    <div className="container px-4">
     <div className="grid md:grid-cols-3 gap-12">
      <div className="text-center">
       <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-8 h-8" />
       </div>
       <h3 className="text-xl font-bold mb-3">Stress Reduction</h3>
       <p className="text-muted-foreground">Proven techniques to lower cortisol levels and improve mental clarity for your team.</p>
      </div>
      <div className="text-center">
       <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
         <CheckCircle2 className="w-8 h-8" />
       </div>
       <h3 className="text-xl font-bold mb-3">Posture Correction</h3>
       <p className="text-muted-foreground">Address the physical toll of desk work with structural integration focused on alignment.</p>
      </div>
      <div className="text-center">
       <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
         <CheckCircle2 className="w-8 h-8" />
       </div>
       <h3 className="text-xl font-bold mb-3">On-Site Convenience</h3>
       <p className="text-muted-foreground">We bring everything needed directly to your office, minimizing disruption to the workday.</p>
      </div>
     </div>
    </div>
   </section>

   {/* CTA */}
   <section className="bg-foreground text-background py-24">
     <div className="container px-4 text-center">
      <h2 className="text-3xl font-serif mb-6">Ready to transform your workplace?</h2>
      <Button size="lg" variant="secondary" asChild>
        <Link href="/contact">Get a Quote</Link>
      </Button>
     </div>
   </section>
  </div>
 );
}
