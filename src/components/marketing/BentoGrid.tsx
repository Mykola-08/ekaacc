'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  StarIcon,
  Globe02Icon,
  UserMultiple02Icon,
  Clock01Icon,
  Calendar01Icon,
  FlashIcon,
  ChampionIcon,
} from '@hugeicons/core-free-icons';

const IconArrowRight = (props: any) => <HugeiconsIcon icon={ArrowRight01Icon} {...props} />;
const IconStar = (props: any) => <HugeiconsIcon icon={StarIcon} {...props} />;
const IconGlobe = (props: any) => <HugeiconsIcon icon={Globe02Icon} {...props} />;
const IconUserGroup = (props: any) => <HugeiconsIcon icon={UserMultiple02Icon} {...props} />;
const IconClock01 = (props: any) => <HugeiconsIcon icon={Clock01Icon} {...props} />;
const IconCalendar01 = (props: any) => <HugeiconsIcon icon={Calendar01Icon} {...props} />;
const IconFlash = (props: any) => <HugeiconsIcon icon={FlashIcon} {...props} />;
const IconMedalFirstPlace = (props: any) => <HugeiconsIcon icon={ChampionIcon} {...props} />;
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function BentoGrid() {
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4 lg:p-6"
    >
      {/* Featured Service - Large Card */}
      <motion.div variants={item} className="row-span-2 md:col-span-2 lg:col-span-2">
        <Card className="group relative h-full min-h-100 overflow-hidden rounded-2xl border-none shadow-sm">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
              alt="Featured Therapy"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="from-background via-background/40 absolute inset-0 bg-linear-to-t to-transparent" />
          </div>
          <div className="relative z-10 flex h-full flex-col p-8">
            <Badge className="bg-primary/10 text-primary mb-4 w-fit border-none px-3 py-1 text-xs">
              <IconFlash size={14} className="mr-1" />
              Most Popular
            </Badge>
            <div className="mt-auto">
              <h3 className="mb-2 text-3xl font-bold tracking-tight">Deep Tissue Recovery</h3>
              <p className="text-muted-foreground mb-6 max-w-md text-lg">
                Experience profound muscle relief with our unique integrative approach to physical
                recovery.
              </p>
              <Button size="lg" className="shadow-soft group rounded-full px-8 py-6 font-bold">
                Book Session
                <IconArrowRight
                  size={18}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Card 1 */}
      <motion.div variants={item}>
        <Card className="bg-primary/5 flex h-full flex-col items-center justify-center rounded-2xl border-none p-8 text-center shadow-none">
          <div className="text-primary mb-4 flex size-12 items-center justify-center rounded-2xl bg-card shadow-sm">
            <IconUserGroup size={24} />
          </div>
          <div className="mb-1 text-4xl font-bold tracking-tighter">1,500+</div>
          <div className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
            Sessions
          </div>
        </Card>
      </motion.div>

      {/* Experience Card */}
      <motion.div variants={item}>
        <Card className="border-border/40 flex h-full flex-col rounded-2xl border p-8 shadow-sm">
          <CardHeader className="mb-4 p-0">
            <div className="flex items-start justify-between">
              <div className="bg-secondary/10 text-secondary flex size-10 items-center justify-center rounded-xl">
                <IconMedalFirstPlace size={20} />
              </div>
              <Badge variant="outline" className="border-secondary/20 text-secondary px-2 py-0.5">
                Top Rated
              </Badge>
            </div>
          </CardHeader>
          <div className="mt-auto">
            <div className="text-3xl font-bold tracking-tight">10 Years</div>
            <div className="text-muted-foreground text-sm font-medium">Professional Experience</div>
          </div>
        </Card>
      </motion.div>

      {/* Trust Quote / Testimonial Style */}
      <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
        <Card className="flex h-full flex-col rounded-2xl bg-foreground p-8 text-background">
          <div className="mb-6 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStar key={i} size={16} className="fill-warning text-warning" />
            ))}
          </div>
          <p className="mb-8 text-xl leading-tight font-medium">
            "The best physical therapy experience in Barcelona. Highly professional and effective."
          </p>
          <div className="mt-auto flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary-foreground/20" />
            <div>
              <div className="text-sm font-bold">Marc R.</div>
              <div className="text-xs text-primary-foreground/60">Professional Runner</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Booking Calendar */}
      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className="group relative h-full overflow-hidden rounded-2xl border-none bg-linear-to-br from-info to-accent p-8 text-primary-foreground transition-transform hover:scale-105">
          <div className="relative z-10 flex h-full flex-col">
            <IconCalendar01 size={32} className="mb-4" />
            <h4 className="mb-2 text-2xl font-bold">Check availability</h4>
            <p className="mb-6 text-sm text-primary-foreground/80">
              Find the perfect time for your next therapy session.
            </p>
            <div className="mt-auto">
              <Button
                variant="secondary"
                className="w-full rounded-xl bg-card py-6 font-bold text-primary shadow-lg hover:bg-card/90"
              >
                Open Calendar
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-16 -mr-16 size-32 rounded-full bg-primary-foreground/10 blur-3xl" />
        </Card>
      </motion.div>

      {/* Global Presence */}
      <motion.div variants={item} className="lg:col-span-2">
        <Card className="border-border/40 flex h-full flex-row items-center gap-8 overflow-hidden rounded-2xl border p-8 shadow-sm">
          <div className="flex-1">
            <div className="text-primary mb-2 flex items-center gap-2">
              <IconGlobe size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Global Reach</span>
            </div>
            <h4 className="text-foreground mb-4 text-2xl leading-tight font-bold">
              Treating clients from over 9 countries.
            </h4>
            <p className="text-muted-foreground text-sm font-light">
              Join our international community of wellness seekers.
            </p>
          </div>
          <div className="relative hidden size-32 shrink-0 sm:block">
            <div className="absolute inset-0 animate-pulse rounded-full bg-info/20 opacity-50" />
            <div className="absolute inset-4 animate-pulse rounded-full bg-info/30 opacity-50 delay-75" />
            <IconGlobe size={64} className="text-primary absolute inset-0 m-auto opacity-20" />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
