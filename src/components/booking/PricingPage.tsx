"use client";

import { Service } from "@/types/database";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingPageProps {
  services: Service[];
}

export function PricingPage({ services }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-background pb-32 animate-fade-in">
      {/* Hero */}
      <div className="pt-32 pb-24 px-4 text-center">
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6 tracking-tight">
          Simple, Transparent <span className="italic">Pricing</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-xl leading-relaxed">
           No hidden fees. Choose a single session or save with our membership packages.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Sessions List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-[1px] flex-1 bg-border"></div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Standard Sessions</span>
                <div className="h-[1px] flex-1 bg-border"></div>
            </div>

            <div className="space-y-4">
              {services.map((service, idx) => (
                <Card 
                    key={service.id} 
                    className="group border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                            {service.name}
                        </h3>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {service.duration} Minutes
                            </span>
                            <span>•</span>
                            <Badge variant="secondary">Session</Badge>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-border min-w-max">
                        <span className="text-3xl font-serif text-foreground">
                            €{service.price}
                        </span>
                        <Link href={`/book/${service.slug || service.id}`}>
                            <Button size="icon" className="w-12 h-12 rounded-full shadow-lg">
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Membership / Featured Card */}
          <div className="lg:col-span-1">
             <div className="sticky top-32">
                <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-xl">
                     {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-32 h-32" />
                    </div>

                    <CardContent className="relative z-10 p-8">
                        <Badge variant="outline" className="mb-6 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 uppercase tracking-widest gap-2">
                            <Sparkles className="w-3 h-3" />
                            Best Value
                        </Badge>
                        
                        <h3 className="font-serif text-3xl mb-2 text-primary-foreground">Wellness Package</h3>
                        <p className="text-primary-foreground/80 text-sm mb-8 leading-relaxed">
                            Commit to your journey. Get 5 sessions for the price of 4.
                        </p>

                        <div className="space-y-4 mb-8">
                            {[
                                "5 x 50min Sessions",
                                "Priority Booking",
                                "Cancel Anytime",
                                "Exclusive Resources"
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                                    <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-primary-foreground" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="mb-8 p-4 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/10">
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-4xl font-serif">€{(services[0]?.price || 100) * 4}</span>
                                <span className="text-primary-foreground/60 mb-1 line-through text-lg decoration-primary-foreground/60">€{(services[0]?.price || 100) * 5}</span>
                            </div>
                            <p className="text-xs text-primary-foreground/70">Billed once per package purchase</p>
                        </div>

                        <Link href="/contact" className="w-full">
                            <Button className="w-full bg-background text-foreground hover:bg-background/90" size="lg">
                                Inquire Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

