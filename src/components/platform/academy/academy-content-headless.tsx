'use client';

import React from 'react';
import {
  BookOpen,
  Award,
  GraduationCap,
  PlayCircle,
  Clock,
  CheckCircle,
  Search,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function AcademyContentHeadless() {
  const courses = [
    {
      title: 'Mindfulness Fundamentals',
      progress: 65,
      total: 12,
      completed: 8,
      image: 'bg-blue-100',
      icon: '🧘',
    },
    {
      title: 'Sleep Science 101',
      progress: 30,
      total: 10,
      completed: 3,
      image: 'bg-indigo-100',
      icon: '😴',
    },
    {
      title: 'Stress Management Mastery',
      progress: 0,
      total: 15,
      completed: 0,
      image: 'bg-orange-100',
      icon: '😌',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-12">
      {/* Header */}
      <div className="animate-fade-in flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <GraduationCap className="h-3 w-3" />
            <span>Learning Center</span>
          </div>
          <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight">
            Academy
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Expand your knowledge with expert-led courses.
          </p>
        </div>
        <div className="relative">
          <Search className="text-muted-foreground/80 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Find a course..."
            className="border-border bg-card w-full rounded-[20px] border py-3 pr-4 pl-12 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black md:w-64"
          />
        </div>
      </div>

      <div className="animate-slide-up grid gap-8 lg:grid-cols-3">
        {/* Main Content: Current Courses */}
        <div className="space-y-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-xl font-bold">Recommended for you</h2>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Browse Catalog
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((course, i) => (
              <div
                key={i}
                className="group bg-card flex cursor-pointer flex-col items-center gap-6 rounded-[20px] border border-gray-100 p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:flex-row"
              >
                <div
                  className={cn(
                    'flex h-32 w-full items-center justify-center rounded-[20px] text-5xl sm:w-32',
                    course.image
                  )}
                >
                  {course.icon}
                </div>
                <div className="w-full grow text-center sm:text-left">
                  <h3 className="text-foreground mb-2 text-xl font-bold transition-colors group-hover:text-indigo-600">
                    {course.title}
                  </h3>
                  <div className="text-muted-foreground mb-3 flex items-center justify-center gap-4 text-sm sm:justify-start">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" /> {course.total} Lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> 2h 15m
                    </span>
                  </div>
                  <div className="relative pt-2">
                    <div className="text-muted-foreground mb-1 flex justify-between text-xs font-semibold">
                      <span>{course.progress}% Complete</span>
                      <span>
                        {course.completed}/{course.total}
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-black transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center self-stretch pr-4">
                  <button className="rounded-xl bg-gray-900 p-3 text-white transition-colors hover:bg-black">
                    <PlayCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Certificates */}
          <div className="bg-card rounded-[24px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-foreground mb-6 flex items-center gap-2 font-bold">
              <Award className="h-5 w-5 text-amber-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex aspect-square flex-col items-center justify-center rounded-[20px] border border-amber-100 bg-amber-50 p-3 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-xl">🏆</span>
                </div>
                <span className="text-xs font-bold text-amber-900">Early Adopter</span>
              </div>
              <div className="bg-muted/30 flex aspect-square flex-col items-center justify-center rounded-[20px] border border-gray-100 p-3 text-center opacity-50">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-xl">🎓</span>
                </div>
                <span className="text-muted-foreground text-xs font-bold">Certified</span>
                <span className="text-muted-foreground/80 text-xs">Locked</span>
              </div>
            </div>
          </div>

          {/* Daily Tip */}
          <div className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-green-500 to-emerald-600 p-8 text-white shadow-lg">
            <div className="bg-card/10 absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full" />
            <h3 className="relative z-10 mb-2 text-xl font-bold">Daily Insight</h3>
            <p className="relative z-10 mb-4 text-sm text-green-50">
              "Learning is not attained by chance, it must be sought for with ardor and attended to
              with diligence."
            </p>
            <div className="bg-card/20 relative z-10 inline-block rounded-xl p-3 text-xs font-medium text-white backdrop-blur-sm">
              Read more &rarr;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
