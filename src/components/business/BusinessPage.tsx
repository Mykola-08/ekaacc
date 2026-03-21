'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  Building02Icon,
  CheckmarkCircle01Icon,
  UserIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';

export function BusinessPage() {
  return (
    <div className="bg-background animate-fade-in min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground relative overflow-hidden pt-32 pb-32">
        <div className="bg-foreground/20 pointer-events-none absolute inset-0" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 mb-8 px-3 py-1.5 tracking-wider uppercase"
          >
            <HugeiconsIcon icon={Building02Icon} className="mr-2 size-3" />
            Corporate Solutions
          </Badge>

          <h1 className="mb-8 font-serif text-5xl leading-tight tracking-tight md:text-7xl">
            Wellness for the <br />
            <span className="italic opacity-90">Modern Workplace</span>
          </h1>

          <p className="text-primary-foreground/80 mx-auto mb-12 max-w-2xl text-lg leading-relaxed md:text-xl">
            Boost employee productivity and morale with on-site structural integration and massage
            therapy sessions tailored for high-performance teams.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 h-14 rounded-full px-8 text-lg"
              >
                Contact Sales
                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-14 rounded-full bg-transparent px-8 text-lg"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative z-20 container mx-auto -mt-20 px-4 py-32">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: AnalyticsUpIcon,
              title: 'Boost Productivity',
              desc: 'Reduce burnout and improve mental clarity through regular somatic sessions aiming to lower cortisol.',
            },
            {
              icon: UserMultipleIcon,
              title: 'Team Retention',
              desc: 'Show your team you care. Wellness perks are a top factor in employee satisfaction and retention.',
            },
            {
              icon: CheckmarkCircle01Icon,
              title: 'Postural Health',
              desc: 'Offset the physical toll of desk work with specialized structural integration focused on alignment.',
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="border-border p-10 transition-transform duration-500 hover:-translate-y-2"
            >
              <div className="bg-primary/10 text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-[calc(var(--radius)*0.8)]">
                <HugeiconsIcon icon={feature.icon} className="h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-4 font-serif text-2xl">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-24 text-center">
        <Card className="border-border relative mx-auto max-w-4xl overflow-hidden p-12 md:p-20">
          <div className="bg-primary/10 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

          <h2 className="text-foreground relative z-10 mb-6 font-serif text-4xl md:text-5xl">
            Ready to transform your office?
          </h2>
          <p className="text-muted-foreground relative z-10 mx-auto mb-10 max-w-xl text-lg">
            Schedule a consultation to discuss a custom plan for your organization.
          </p>

          <Link href="/contact">
            <Button
              size="lg"
              className="hover: relative z-10 h-14 rounded-full px-10 text-lg transition-all hover:-translate-y-1"
            >
              Get Started
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
