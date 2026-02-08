"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  StarIcon,
  Globe02Icon,
  UserMultiple02Icon,
  Clock01Icon,
  Calendar01Icon,
  FlashIcon,
  ChampionIcon
} from "@hugeicons/core-free-icons"

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
  CardFooter
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

export function BentoGrid() {
  const { t } = useLanguage()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 lg:p-6"
    >
      {/* Featured Service - Large Card */}
      <motion.div variants={item} className="md:col-span-2 lg:col-span-2 row-span-2">
        <Card className="h-full min-h-[400px] overflow-hidden group relative border-none shadow-sm rounded-2xl">
          <div className="absolute inset-0 z-0">
             <Image
                src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
                alt="Featured Therapy"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex flex-col p-8">
            <Badge className="w-fit mb-4 bg-primary/10 text-primary border-none text-xs px-3 py-1">
               <IconFlash size={14} className="mr-1" />
               Most Popular
            </Badge>
            <div className="mt-auto">
              <h3 className="text-3xl font-bold tracking-tight mb-2">Deep Tissue Recovery</h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-md">
                Experience profound muscle relief with our unique integrative approach to physical recovery.
              </p>
              <Button size="lg" className="rounded-full px-8 py-6 font-bold shadow-soft group">
                 Book Session
                 <IconArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Card 1 */}
      <motion.div variants={item}>
        <Card className="h-full bg-primary/5 border-none shadow-none flex flex-col justify-center items-center p-8 rounded-2xl text-center">
          <div className="size-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 text-primary">
             <IconUserGroup size={24} />
          </div>
          <div className="text-4xl font-bold tracking-tighter mb-1">1,500+</div>
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Sessions</div>
        </Card>
      </motion.div>

       {/* Experience Card */}
       <motion.div variants={item}>
        <Card className="h-full border border-border/40 shadow-sm p-8 rounded-2xl flex flex-col">
          <CardHeader className="p-0 mb-4">
             <div className="flex justify-between items-start">
                <div className="size-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <IconMedalFirstPlace size={20} />
                </div>
                <Badge variant="outline" className="border-secondary/20 text-secondary px-2 py-0.5">Top Rated</Badge>
             </div>
          </CardHeader>
          <div className="mt-auto">
            <div className="text-3xl font-bold tracking-tight">10 Years</div>
            <div className="text-sm text-muted-foreground font-medium">Professional Experience</div>
          </div>
        </Card>
      </motion.div>

      {/* Trust Quote / Testimonial Style */}
      <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
        <Card className="h-full bg-black text-white p-8 rounded-2xl flex flex-col">
           <div className="flex gap-1 mb-6">
              {[1,2,3,4,5].map(i => <IconStar key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
           </div>
           <p className="text-xl font-medium leading-tight mb-8">
             "The best physical therapy experience in Barcelona. Highly professional and effective."
           </p>
           <div className="flex items-center gap-3 mt-auto">
             <div className="size-10 rounded-full bg-white/20" />
             <div>
               <div className="text-sm font-bold">Marc R.</div>
               <div className="text-xs text-white/60">Professional Runner</div>
             </div>
           </div>
        </Card>
      </motion.div>

       {/* Quick Booking Calendar */}
       <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className="h-full border-none bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl relative overflow-hidden group hover:scale-105 transition-transform">
           <div className="relative z-10 flex flex-col h-full">
              <IconCalendar01 size={32} className="mb-4" />
              <h4 className="text-2xl font-bold mb-2">Check availability</h4>
              <p className="text-white/80 text-sm mb-6">Find the perfect time for your next therapy session.</p>
              <div className="mt-auto">
                <Button variant="secondary" className="w-full rounded-xl font-bold py-6 shadow-lg bg-white text-blue-600 hover:bg-white/90">
                  Open Calendar
                </Button>
              </div>
           </div>
           <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        </Card>
      </motion.div>

       {/* Global Presence */}
       <motion.div variants={item} className="lg:col-span-2">
         <Card className="h-full border border-border/40 shadow-sm p-8 rounded-2xl flex flex-row items-center gap-8 overflow-hidden">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <IconGlobe size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Global Reach</span>
              </div>
              <h4 className="text-2xl font-bold leading-tight mb-4 text-foreground">Treating clients from over 9 countries.</h4>
              <p className="text-muted-foreground text-sm font-light">Join our international community of wellness seekers.</p>
            </div>
            <div className="relative size-32 hidden sm:block shrink-0">
               <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50" />
               <div className="absolute inset-4 bg-blue-200 rounded-full animate-pulse opacity-50 delay-75" />
               <IconGlobe size={64} className="absolute inset-0 m-auto text-primary opacity-20" />
            </div>
         </Card>
       </motion.div>
    </motion.div>
  )
}



