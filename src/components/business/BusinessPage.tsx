"use client";

import Link from "next/link";
import { CheckCircle2, Building2, Users, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BusinessPage() {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 0%, transparent 50%)' }} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 mb-8 uppercase tracking-wider py-1.5 px-3">
                <Building2 className="w-3 h-3 mr-2" />
                Corporate Solutions
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tight leading-tight">
                Wellness for the <br/>
                <span className="italic opacity-90">Modern Workplace</span>
            </h1>
            
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Boost employee productivity and morale with on-site structural integration and massage therapy sessions tailored for high-performance teams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link href="/contact">
                    <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 text-lg px-8 h-14">
                        Contact Sales
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                 </Link>
                 <Link href="/pricing">
                    <Button size="lg" variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-lg px-8 h-14 bg-transparent">
                        View Pricing
                    </Button>
                 </Link>
            </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-32 px-4 container mx-auto -mt-20 relative z-20">
         <div className="grid md:grid-cols-3 gap-8">
            {[
                {
                    icon: TrendingUp,
                    title: "Boost Productivity",
                    desc: "Reduce burnout and improve mental clarity through regular somatic sessions aiming to lower cortisol."
                },
                {
                    icon: Users,
                    title: "Team Retention",
                    desc: "Show your team you care. Wellness perks are a top factor in employee satisfaction and retention."
                },
                {
                    icon: CheckCircle2,
                    title: "Postural Health",
                    desc: "Offset the physical toll of desk work with specialized structural integration focused on alignment."
                }
            ].map((feature, i) => (
                <Card key={i} className="p-10 shadow-xl border-border hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                        <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {feature.desc}
                    </p>
                </Card>
            ))}
         </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 text-center">
         <Card className="max-w-4xl mx-auto p-12 md:p-20 shadow-2xl border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6 relative z-10">
                Ready to transform your office?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto relative z-10">
                Schedule a consultation to discuss a custom plan for your organization.
            </p>
            
            <Link href="/contact">
                <Button size="lg" className="relative z-10 rounded-full text-lg px-10 h-14 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Get Started
                </Button>
            </Link>
         </Card>
      </section>

    </div>
  );
}

