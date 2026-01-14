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
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
       {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-3">
              <Heart className="w-3 h-3" />
              <span>Community</span>
           </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Connect & Grow
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Join the conversation with others on the same journey.
          </p>
        </div>
        <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/80 w-5 h-5" />
             <input 
                type="text" 
                placeholder="Search topics..."
                className="pl-12 pr-4 py-3 rounded-2xl border-gray-200 bg-card border shadow-sm focus:ring-2 focus:ring-black focus:border-transparent w-full md:w-64 transition-all"
            />
        </div>
      </div>

       <div className="grid gap-8 lg:grid-cols-3 animate-slide-up">
            {/* Main Feed Area */}
            <div className="lg:col-span-2 space-y-8">
                 <div className="bg-card rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-gray-100 bg-muted/30/50">
                         <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-rose-500" />
                                Upcoming Events
                            </h2>
                            <button className="text-sm font-semibold text-rose-600 hover:text-rose-700">View Calendar</button>
                         </div>
                         <div className="grid sm:grid-cols-2 gap-4">
                             {/* Event Card 1 */}
                             <div className="group bg-card p-5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
                                 <div className="flex justify-between items-start mb-3">
                                      <span className="text-xs font-bold text-muted-foreground uppercase">Tomorrow</span>
                                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Live</span>
                                 </div>
                                 <h3 className="font-bold text-foreground group-hover:text-rose-600 transition-colors">Group Meditation</h3>
                                 <p className="text-sm text-muted-foreground mt-1">10:00 AM • with Sarah</p>
                                 <div className="mt-4 flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />)}
                                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-bold text-muted-foreground">+12</div>
                                 </div>
                             </div>

                             {/* Event Card 2 */}
                             <div className="group bg-card p-5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
                                 <div className="flex justify-between items-start mb-3">
                                      <span className="text-xs font-bold text-muted-foreground uppercase">Nov 12</span>
                                 </div>
                                 <h3 className="font-bold text-foreground group-hover:text-rose-600 transition-colors">Wellness Workshop</h3>
                                  <p className="text-sm text-muted-foreground mt-1">2:00 PM • with Dr. Smith</p>
                                  <div className="mt-4 flex items-center text-sm font-semibold text-rose-600">
                                      Register Now &rarr;
                                  </div>
                             </div>
                         </div>
                     </div>

                     <div className="p-8">
                         <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                Recent Discussions
                            </h2>
                         </div>
                         
                         <div className="space-y-6">
                             {[
                                 { title: "Tips for staying consistent with therapy?", author: "Alice M.", replies: 12, time: "2h ago", avatar: "bg-blue-100 text-blue-600" },
                                 { title: "My breakthrough moment today!", author: "Robert F.", replies: 24, time: "5h ago", avatar: "bg-green-100 text-green-600" },
                                 { title: "Question about the nutrition plan", author: "Emma W.", replies: 5, time: "1d ago", avatar: "bg-purple-100 text-purple-600" },
                             ].map((topic, i) => (
                                 <div key={i} className="flex gap-4 group cursor-pointer">
                                     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0", topic.avatar)}>
                                         {topic.author.charAt(0)}
                                     </div>
                                     <div className="grow pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                         <h3 className="font-bold text-foreground text-lg group-hover:text-blue-600 transition-colors">{topic.title}</h3>
                                         <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                             <span>By {topic.author}</span>
                                             <span>•</span>
                                             <span>{topic.time}</span>
                                             <span className="ml-auto flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg">
                                                 <MessageSquare className="w-3 h-3" /> {topic.replies}
                                             </span>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <div className="mt-8 text-center bg-muted/30 p-6 rounded-2xl border border-gray-100 border-dashed">
                             <h4 className="font-bold text-foreground mb-2">Have something to share?</h4>
                             <p className="text-sm text-muted-foreground mb-4">Start a new discussion topic or ask a question.</p>
                             <button className="px-6 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">Start Discussion</button>
                         </div>
                     </div>
                 </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                 {/* Featured Group */}
                 <div className="rounded-4xl bg-linear-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg relative overflow-hidden group">
                     {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-card/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-card/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10">
                        <span className="text-xs font-bold bg-card/20 px-2 py-1 rounded-lg border border-white/10 mb-4 inline-block">Featured Group</span>
                        <h3 className="text-2xl font-bold mb-2">Mindful Mornings</h3>
                        <p className="text-indigo-100 text-sm mb-6">Join 150+ members practicing daily mindfulness routines.</p>
                        <div className="flex -space-x-3 mb-6">
                             {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-indigo-300 border-2 border-indigo-500" />)}
                             <div className="w-10 h-10 rounded-full bg-card text-indigo-600 flex items-center justify-center font-bold text-xs border-2 border-indigo-500">+150</div>
                        </div>
                        <button className="w-full py-3 bg-card text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">Join Group</button>
                    </div>
                 </div>

                 {/* Suggested Connections */}
                 <div className="bg-card rounded-[32px] border border-gray-100 shadow-sm p-8">
                     <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                         <Users className="w-5 h-5 text-muted-foreground/80" />
                         Suggested for you
                     </h3>
                     <div className="space-y-4">
                         {[
                             { name: "Dr. Emily R.", role: "Therapist", img: "bg-teal-100 text-teal-700" },
                             { name: "Mark Wilson", role: "Design", img: "bg-orange-100 text-orange-700" },
                         ].map((u, i) => (
                             <div key={i} className="flex items-center gap-3">
                                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold", u.img)}>{u.name.charAt(0)}</div>
                                 <div className="flex-grow">
                                     <h4 className="font-bold text-sm text-foreground">{u.name}</h4>
                                     <p className="text-xs text-muted-foreground">{u.role}</p>
                                 </div>
                                 <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Connect</button>
                             </div>
                         ))}
                     </div>
                 </div>
            </div>
       </div>
    </div>
  );
}
