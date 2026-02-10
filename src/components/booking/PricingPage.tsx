'use client';

import { Service } from '@/types/database';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, ArrowRight01Icon, SparklesIcon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingPageProps {
  services: Service[];
}

export function PricingPage({ services }: PricingPageProps) {
  return (
    <div className="bg-background animate-fade-in min-h-screen pb-32">
      {/* Hero */}
      <div className="px-4 pt-32 pb-24 text-center">
        <h1 className="text-foreground mb-6 font-serif text-5xl tracking-tight md:text-6xl">
          Simple, Transparent <span className="italic">Pricing</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-xl leading-relaxed">
          No hidden fees. Choose a single session or save with our membership packages.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {/* Main Sessions List */}
          <div className="space-y-8 lg:col-span-2">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-border h-px flex-1"></div>
              <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
                Standard Sessions
              </span>
              <div className="bg-border h-px flex-1"></div>
            </div>

            <div className="space-y-4">
              {services.map((service, idx) => (
                <Card
                  key={service.id}
                  className="group border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CardContent className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                    <div>
                      <h3 className="text-foreground group-hover:text-primary mb-2 font-serif text-2xl transition-colors">
                        {service.name}
                      </h3>
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
                          {service.duration} Minutes
                        </span>
                        <span>•</span>
                        <Badge variant="secondary">Session</Badge>
                      </div>
                    </div>

                    <div className="border-border flex min-w-max items-center gap-6 sm:border-l sm:pl-6">
                      <span className="text-foreground font-serif text-3xl">€{service.price}</span>
                      <Link href={`/book/${service.slug || service.id}`}>
                        <Button size="icon" className="h-9 w-9 rounded-full shadow-sm">
                          <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5" />
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
              <Card className="bg-primary text-primary-foreground relative overflow-hidden border-none shadow-sm">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <HugeiconsIcon icon={SparklesIcon} className="h-32 w-32" />
                </div>

                <CardContent className="relative z-10 p-8">
                  <Badge
                    variant="outline"
                    className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 mb-6 gap-2 tracking-widest uppercase"
                  >
                    <HugeiconsIcon icon={SparklesIcon} className="h-3 w-3" />
                    Best Value
                  </Badge>

                  <h3 className="text-primary-foreground mb-2 font-serif text-3xl">
                    Wellness Package
                  </h3>
                  <p className="text-primary-foreground/80 mb-8 text-sm leading-relaxed">
                    Commit to your journey. Get 5 sessions for the price of 4.
                  </p>

                  <div className="mb-8 space-y-4">
                    {[
                      '5 x 50min Sessions',
                      'Priority Booking',
                      'Cancel Anytime',
                      'Exclusive Resources',
                    ].map((feature) => (
                      <div
                        key={feature}
                        className="text-primary-foreground/90 flex items-center gap-3 text-sm"
                      >
                        <div className="bg-primary-foreground/20 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary-foreground h-3 w-3" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="bg-primary-foreground/10 border-primary-foreground/10 mb-8 rounded-lg border p-4">
                    <div className="mb-1 flex items-end gap-2">
                      <span className="font-serif text-4xl">
                        €{(services[0]?.price || 100) * 4}
                      </span>
                      <span className="text-primary-foreground/60 decoration-primary-foreground/60 mb-1 text-lg line-through">
                        €{(services[0]?.price || 100) * 5}
                      </span>
                    </div>
                    <p className="text-primary-foreground/70 text-xs">
                      Billed once per package purchase
                    </p>
                  </div>

                  <Link href="/contact" className="w-full">
                    <Button
                      className="bg-background text-foreground hover:bg-background/90 w-full"
                      size="lg"
                    >
                      Inquire Now
                      <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 h-4 w-4" />
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
