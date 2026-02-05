'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import {
  Users,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function TherapistDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Mock Data
  const stats = [
    {
      label: t('dashboard.therapist.totalPatients') || 'Active Patients',
      value: '12',
      icon: Users,
      desc: t('dashboard.therapist.activePatients') || 'Currently under your care',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: t('dashboard.therapist.todaysSessions') || 'Sessions Today',
      value: '4',
      icon: Calendar,
      desc: t('dashboard.therapist.scheduledToday') || 'Scheduled appointments',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: t('dashboard.therapist.pendingReviews') || 'Pending Reports',
      value: '2',
      icon: FileText,
      desc: t('dashboard.therapist.notesToComplete') || 'Session notes required',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Therapist Workspace
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {t('dashboard.welcomeBack', { name: user?.first_name || 'Therapist' })}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your patients and schedule efficiently.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/platform/schedule"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-black/5 text-sm font-semibold rounded-full text-foreground/90 bg-white hover:bg-muted/30 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Schedule
          </Link>
          <Link
            href="/platform/patients"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            <Users className="w-4 h-4 mr-2" />
            View Patients
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 animate-slide-up">
        {stats.map((stat, i) => (
          <div key={i} className="group relative overflow-hidden bg-white rounded-[32px] p-8 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-4xl font-bold text-foreground mt-2">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-2">{stat.desc}</p>
              </div>
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-black/5 shadow-sm p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">Today's Schedule</h2>
              <p className="text-sm text-muted-foreground">You have 4 sessions remaining today</p>
            </div>
            <Link href="/platform/schedule" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View full calendar &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { time: '09:00 AM', patient: 'Sarah Johnson', type: 'Initial Consultation', status: 'completed' },
              { time: '11:00 AM', patient: 'Michael Chen', type: 'Follow-up', status: 'upcoming' },
              { time: '02:00 PM', patient: 'Emma Wilson', type: 'Therapy Session', status: 'upcoming' },
              { time: '04:30 PM', patient: 'James Davis', type: 'Review', status: 'upcoming' },
            ].map((session, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-[24px] hover:bg-muted/30 border border-transparent hover:border-black/5 transition-all group">
                <div className="w-20 text-center">
                  <span className="block text-sm font-bold text-foreground">{session.time}</span>
                </div>
                <div className="w-1 h-12 rounded-full bg-muted group-hover:bg-blue-200 transition-colors" />
                <div className="grow">
                  <h4 className="font-bold text-foreground">{session.patient}</h4>
                  <p className="text-sm text-muted-foreground">{session.type}</p>
                </div>
                <div>
                  {session.status === 'completed' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <Clock className="w-3 h-3 mr-1" /> Upcoming
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-[32px] border border-black/5 shadow-sm p-8 h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Action Required</h2>
              <p className="text-sm text-muted-foreground">3 items pending</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-[24px] bg-muted/30 border border-black/5">
              <h4 className="font-bold text-foreground mb-1">Incomplete Session Notes</h4>
              <p className="text-sm text-muted-foreground mb-3">Session with Sarah J. on Oct 20</p>
              <button className="text-sm font-semibold text-amber-700 hover:text-amber-800">Complete Note &rarr;</button>
            </div>
            <div className="p-4 rounded-[32px] bg-muted/30 border border-black/5">
              <h4 className="font-bold text-foreground mb-1">New Patient Request</h4>
              <p className="text-sm text-muted-foreground mb-3">Robert Fox requested an appointment</p>
              <div className="flex gap-2">
                <button className="text-xs font-semibold px-3 py-1.5 bg-black text-white rounded-full hover:bg-gray-800">Review</button>
                <button className="text-xs font-semibold px-3 py-1.5 bg-white border border-black/5 text-foreground/90 rounded-full hover:bg-muted/30">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
