'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/context/LanguageContext';
import {
  Users,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
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
      bg: 'bg-blue-50',
    },
    {
      label: t('dashboard.therapist.todaysSessions') || 'Sessions Today',
      value: '4',
      icon: Calendar,
      desc: t('dashboard.therapist.scheduledToday') || 'Scheduled appointments',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: t('dashboard.therapist.pendingReviews') || 'Pending Reports',
      value: '2',
      icon: FileText,
      desc: t('dashboard.therapist.notesToComplete') || 'Session notes required',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-12">
      {/* Header */}
      <div className="animate-fade-in flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Therapist Workspace
          </div>
          <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight">
            {t('dashboard.welcomeBack', { name: user?.first_name || 'Therapist' })}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your patients and schedule efficiently.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/platform/schedule"
            className="text-foreground/90 hover:bg-muted/30 inline-flex items-center justify-center rounded-full border border-black/5 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none"
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Schedule
          </Link>
          <Link
            href="/platform/patients"
            className="bg-primary hover:bg-primary/90 shadow-primary/20 focus:ring-primary/50 inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <Users className="mr-2 h-4 w-4" />
            View Patients
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="animate-slide-up grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-[20px] border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground/80 text-sm font-semibold tracking-wide uppercase">
                  {stat.label}
                </p>
                <h3 className="text-foreground mt-2 text-4xl font-bold">{stat.value}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{stat.desc}</p>
              </div>
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110',
                  stat.bg
                )}
              >
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div
        className="animate-slide-up grid gap-8 lg:grid-cols-3"
        style={{ animationDelay: '100ms' }}
      >
        {/* Today's Schedule */}
        <div className="flex h-full flex-col rounded-[20px] border border-black/5 bg-white p-8 shadow-sm lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-foreground text-xl font-bold">Today's Schedule</h2>
              <p className="text-muted-foreground text-sm">You have 4 sessions remaining today</p>
            </div>
            <Link
              href="/platform/schedule"
              className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              View full calendar &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {[
              {
                time: '09:00 AM',
                patient: 'Sarah Johnson',
                type: 'Initial Consultation',
                status: 'completed',
              },
              { time: '11:00 AM', patient: 'Michael Chen', type: 'Follow-up', status: 'upcoming' },
              {
                time: '02:00 PM',
                patient: 'Emma Wilson',
                type: 'Therapy Session',
                status: 'upcoming',
              },
              { time: '04:30 PM', patient: 'James Davis', type: 'Review', status: 'upcoming' },
            ].map((session, i) => (
              <div
                key={i}
                className="hover:bg-muted/30 group flex items-center gap-4 rounded-xl border border-transparent p-4 transition-all hover:border-black/5"
              >
                <div className="w-20 text-center">
                  <span className="text-foreground block text-sm font-bold">{session.time}</span>
                </div>
                <div className="bg-muted h-12 w-1 rounded-full transition-colors group-hover:bg-blue-200" />
                <div className="grow">
                  <h4 className="text-foreground font-bold">{session.patient}</h4>
                  <p className="text-muted-foreground text-sm">{session.type}</p>
                </div>
                <div>
                  {session.status === 'completed' ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      <Clock className="mr-1 h-3 w-3" /> Upcoming
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="h-full rounded-[20px] border border-black/5 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-bold">Action Required</h2>
              <p className="text-muted-foreground text-sm">3 items pending</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl border border-black/5 p-4">
              <h4 className="text-foreground mb-1 font-bold">Incomplete Session Notes</h4>
              <p className="text-muted-foreground mb-3 text-sm">Session with Sarah J. on Oct 20</p>
              <button className="text-sm font-semibold text-amber-700 hover:text-amber-800">
                Complete Note &rarr;
              </button>
            </div>
            <div className="bg-muted/30 rounded-[20px] border border-black/5 p-4">
              <h4 className="text-foreground mb-1 font-bold">New Patient Request</h4>
              <p className="text-muted-foreground mb-3 text-sm">
                Robert Fox requested an appointment
              </p>
              <div className="flex gap-2">
                <button className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800">
                  Review
                </button>
                <button className="text-foreground/90 hover:bg-muted/30 rounded-full border border-black/5 bg-white px-3 py-1.5 text-xs font-semibold">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
