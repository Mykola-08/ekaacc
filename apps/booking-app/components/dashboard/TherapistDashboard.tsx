'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { CalendarCheck, AlertCircle, Users, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { glassEffect, appleShadow, dashboardItemVariants, iosSpring } from "@/lib/ui-utils";
import { motion, AnimatePresence } from "framer-motion";

interface TherapistDashboardProps {
  schedule: any[];
}

export function TherapistDashboard({ schedule }: TherapistDashboardProps) {
  const pendingVerifications = schedule.filter(s => s.is_identity_verified === false).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
       <motion.header 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={iosSpring}
         className="mb-8 flex justify-between items-end"
       >
        <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">
            Today's Overview
            </h1>
            <p className="text-slate-500 font-medium">
            {format(new Date(), "EEEE, MMMM d")}
            </p>
        </div>
        <div className="text-right">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              {schedule.length}
            </span>
            <span className="text-slate-400 ml-2 font-medium">sessions</span>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Sessions", value: schedule.length, sub: "For today", delay: 0.1 },
          { title: "Pending Verification", value: pendingVerifications, sub: "Action required", delay: 0.2, highlight: pendingVerifications > 0 },
          { title: "Next Break", value: "1:00 PM", sub: "Scheduled", delay: 0.3 }
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            variants={dashboardItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...iosSpring, delay: stat.delay }}
            layoutId={`stat-${i}`}
          >
            <Card className={cn("border-0 h-full", glassEffect, appleShadow)}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={cn("text-3xl font-bold tracking-tight", stat.highlight ? "text-amber-500" : "text-slate-900")}>
                        {stat.value}
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-1">{stat.sub}</p>
                </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <motion.h2 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="text-xl font-semibold text-slate-900 mb-4"
        >
          Agenda
        </motion.h2>
        
        <AnimatePresence mode="popLayout">
          {schedule.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl"
              >
                  No sessions scheduled for today.
              </motion.div>
          ) : (
              schedule.map((session, i) => (
                  <motion.div
                    key={session.id}
                    variants={dashboardItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layoutId={`session-${session.id}`}
                    transition={{ ...iosSpring, delay: 0.4 + (i * 0.1) }}
                  >
                    <Card className={cn("border-0 flex overflow-hidden group hover:bg-slate-50/50 transition-colors", glassEffect, appleShadow)}>
                        <div className="w-24 bg-blue-50/50 group-hover:bg-blue-100/50 transition-colors flex flex-col items-center justify-center p-4 text-blue-600 border-r border-blue-100/50">
                            <span className="text-xl font-bold tracking-tighter">{format(new Date(session.start_time), "h:mm")}</span>
                            <span className="text-xs font-bold uppercase opacity-60">{format(new Date(session.start_time), "a")}</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-lg font-semibold text-slate-900">{session.client_name || 'Guest Client'}</h3>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                                    session.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                )}>
                                    {session.status}
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium text-sm">{session.service_name}</p>
                            
                            {session.is_identity_verified === false && (
                                <div className="mt-3 flex items-center gap-2 text-amber-600 text-xs font-bold bg-amber-50 p-2 rounded-lg max-w-fit">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Identity Verification Needed</span>
                                </div>
                            )}
                        </div>
                    </Card>
                  </motion.div>
              ))
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-4 mt-8">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { label: 'Manage Clients', href: '/admin/users', icon: Users },
              { label: 'Full Calendar', href: '/admin/bookings', icon: Calendar },
              { label: 'Verify Payments', href: '/admin/finance', icon: CreditCard },
              { label: 'Settings', href: '/admin', icon: CalendarCheck }
          ].map((action, i) => (
              <motion.div
                key={action.label}
                variants={dashboardItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ ...iosSpring, delay: 0.6 + (i * 0.1) }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full h-24 flex flex-col gap-3 text-sm font-semibold rounded-3xl",
                      "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100",
                      "hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-100 transition-all duration-300"
                    )}
                    asChild
                >
                    <Link href={action.href}>
                        <action.icon className="w-6 h-6 opacity-70" />
                        {action.label}
                    </Link>
                </Button>
              </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
