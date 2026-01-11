'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Wallet, Calendar, Star, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { glassEffect, appleShadow, iosSpring, dashboardItemVariants } from "@/lib/ui-utils";
import { motion } from "framer-motion";

interface ClientDashboardProps {
  profile: any;
  wallet: { balanceCents: number; pointsBalance: number };
  nextBooking: any;
  recommendation?: any; // To be implemented later
}

export function ClientDashboard({ profile, wallet, nextBooking }: ClientDashboardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={iosSpring}
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">
          Welcome back, {profile.full_name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Your wellness journey continues.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Session Card */}
        <motion.div
           variants={dashboardItemVariants}
           initial="hidden"
           animate="visible"
           transition={{ ...iosSpring, delay: 0.1 }}
           layoutId="card-session"
        >
          <Card className={cn("border-0 overflow-hidden relative h-full", glassEffect, appleShadow)}>
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Calendar className="w-5 h-5 text-blue-500" />
                Next Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextBooking ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">{nextBooking.service_name}</h3>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {format(new Date(nextBooking.start_time), "EEEE, MMMM d 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                     <Button variant="outline" size="sm" className="rounded-full border-slate-200 text-slate-600 hover:text-slate-900">Reschedule</Button>
                     <Button variant="ghost" size="sm" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="mb-6 text-slate-500 font-medium">No upcoming sessions scheduled.</p>
                  <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-6 h-10" asChild>
                    <Link href="/#services" prefetch={true}>Book Now</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet & Points Card */}
        <motion.div
           variants={dashboardItemVariants}
           initial="hidden"
           animate="visible"
           transition={{ ...iosSpring, delay: 0.2 }}
           layoutId="card-wallet"
        >
          <Card className={cn("border-0 h-full relative overflow-hidden", glassEffect, appleShadow)}>
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Wallet className="w-5 h-5 text-blue-500" />
                Wallet & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Balance</span>
                <span className="text-4xl font-bold tracking-tighter text-slate-900">
                  ${(wallet.balanceCents / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                <span className="flex items-center gap-2 text-amber-700 font-medium">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" /> Points
                </span>
                <span className="text-xl font-bold text-amber-600">
                  {wallet.pointsBalance}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { label: 'Book Session', href: '/#services' },
              { label: 'History', href: '/history' },
              { label: 'My Plan', href: '/plan' },
              { label: 'Contact', href: '/contact' }
          ].map((action, i) => (
              <motion.div
                key={action.label}
                variants={dashboardItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ ...iosSpring, delay: 0.3 + (i * 0.1) }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                  <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full h-16 text-sm font-semibold rounded-2xl",
                        "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100",
                        "hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-100 transition-all duration-300",
                        "flex items-center justify-between px-6"
                      )}
                      asChild
                  >
                    <Link href={action.href} prefetch={true}>
                      {action.label}
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </Link>
                  </Button>
              </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

