'use client';

import React from 'react';
import { Calendar, MessageSquare, Users, Heart, Share2, Search } from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function CommunityContentHeadless() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-12">
      {/* Header */}
      <div className="animate-fade-in flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <Heart className="h-3 w-3" />
            <span>Community</span>
          </div>
          <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight">
            Connect & Grow
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Join the conversation with others on the same journey.
          </p>
        </div>
        <div className="relative">
          <Search className="text-muted-foreground/80 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics..."
            className="border-border bg-card w-full rounded-2xl border py-3 pr-4 pl-12 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black md:w-64"
          />
        </div>
      </div>

      <div className="animate-slide-up grid gap-8 lg:grid-cols-3">
        {/* Main Feed Area */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-card overflow-hidden rounded-[24px] border border-gray-100 shadow-sm">
            <div className="bg-muted/30/50 border-b border-gray-100 p-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
                  <Calendar className="h-5 w-5 text-rose-500" />
                  Upcoming Events
                </h2>
                <button className="text-sm font-semibold text-rose-600 hover:text-rose-700">
                  View Calendar
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Event Card 1 */}
                <div className="group bg-card border-border cursor-pointer rounded-2xl border p-5 transition-all hover:border-gray-300">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Tomorrow
                    </span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                      Live
                    </span>
                  </div>
                  <h3 className="text-foreground font-bold transition-colors group-hover:text-rose-600">
                    Group Meditation
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">10:00 AM • with Sarah</p>
                  <div className="mt-4 flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-white bg-gray-200"
                      />
                    ))}
                    <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold">
                      +12
                    </div>
                  </div>
                </div>

                {/* Event Card 2 */}
                <div className="group bg-card border-border cursor-pointer rounded-2xl border p-5 transition-all hover:border-gray-300">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Nov 12
                    </span>
                  </div>
                  <h3 className="text-foreground font-bold transition-colors group-hover:text-rose-600">
                    Wellness Workshop
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">2:00 PM • with Dr. Smith</p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-rose-600">
                    Register Now &rarr;
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Recent Discussions
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: 'Tips for staying consistent with therapy?',
                    author: 'Alice M.',
                    replies: 12,
                    time: '2h ago',
                    avatar: 'bg-blue-100 text-blue-600',
                  },
                  {
                    title: 'My breakthrough moment today!',
                    author: 'Robert F.',
                    replies: 24,
                    time: '5h ago',
                    avatar: 'bg-green-100 text-green-600',
                  },
                  {
                    title: 'Question about the nutrition plan',
                    author: 'Emma W.',
                    replies: 5,
                    time: '1d ago',
                    avatar: 'bg-purple-100 text-purple-600',
                  },
                ].map((topic, i) => (
                  <div key={i} className="group flex cursor-pointer gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold',
                        topic.avatar
                      )}
                    >
                      {topic.author.charAt(0)}
                    </div>
                    <div className="grow border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <h3 className="text-foreground text-lg font-bold transition-colors group-hover:text-blue-600">
                        {topic.title}
                      </h3>
                      <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                        <span>By {topic.author}</span>
                        <span>•</span>
                        <span>{topic.time}</span>
                        <span className="bg-muted/30 ml-auto flex items-center gap-1 rounded-lg px-2 py-1">
                          <MessageSquare className="h-3 w-3" /> {topic.replies}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-muted/30 mt-8 rounded-2xl border border-dashed border-gray-100 p-6 text-center">
                <h4 className="text-foreground mb-2 font-bold">Have something to share?</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Start a new discussion topic or ask a question.
                </p>
                <button className="rounded-xl bg-black px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-800">
                  Start Discussion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Group */}
          <div className="group relative overflow-hidden rounded-[24px] bg-linear-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg">
            {/* Decorative circles */}
            <div className="bg-card/10 absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full" />
            <div className="bg-card/10 absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full" />

            <div className="relative z-10">
              <span className="bg-card/20 mb-4 inline-block rounded-lg border border-white/10 px-2 py-1 text-xs font-bold">
                Featured Group
              </span>
              <h3 className="mb-2 text-2xl font-bold">Mindful Mornings</h3>
              <p className="mb-6 text-sm text-indigo-100">
                Join 150+ members practicing daily mindfulness routines.
              </p>
              <div className="mb-6 flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-indigo-500 bg-indigo-300"
                  />
                ))}
                <div className="bg-card flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-500 text-xs font-bold text-indigo-600">
                  +150
                </div>
              </div>
              <button className="bg-card w-full rounded-xl py-3 font-bold text-indigo-700 shadow-lg transition-colors hover:bg-indigo-50">
                Join Group
              </button>
            </div>
          </div>

          {/* Suggested Connections */}
          <div className="bg-card rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-foreground mb-6 flex items-center gap-2 font-bold">
              <Users className="text-muted-foreground/80 h-5 w-5" />
              Suggested for you
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Dr. Emily R.', role: 'Therapist', img: 'bg-blue-100 text-blue-700' },
                { name: 'Mark Wilson', role: 'Design', img: 'bg-orange-100 text-orange-700' },
              ].map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl font-bold',
                      u.img
                    )}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-foreground text-sm font-bold">{u.name}</h4>
                    <p className="text-muted-foreground text-xs">{u.role}</p>
                  </div>
                  <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
