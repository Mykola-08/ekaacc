'use client';

import { useState } from 'react';
import { BookOpen, Plus, Calendar, Smile, Frown, Meh } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "../dashboard/layout/DashboardLayout";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { DashboardCard } from "../dashboard/DashboardCard";

// Mock entries
const MOCK_ENTRIES = [
   { id: 1, title: "Post-Session Reflection", date: "2023-10-24", mood: "happy", text: "Felt really open today after the deep tissue work. Should drink more water." },
   { id: 2, title: "Weekly Check-in", date: "2023-10-20", mood: "neutral", text: "Back pain is subsiding, but shoulder is still tight." },
];

export function JournalPage() {
   return (
      <DashboardLayout profile={{ first_name: 'Client' }}>
         <div className="space-y-8 animate-in fade-in duration-500">
            <DashboardHeader title="Reflections" subtitle="Track your wellness journey and session notes.">
               <Button className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
               </Button>
            </DashboardHeader>

            <div className="grid grid-cols-1 gap-6">
               {MOCK_ENTRIES.map(entry => (
                  <div key={entry.id} className="bg-card p-6 rounded-[32px] border border-border shadow-sm hover:shadow-md transition-all group">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-[14px] bg-secondary flex items-center justify-center text-primary">
                              <BookOpen className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-foreground">{entry.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                 <Calendar className="w-3.5 h-3.5" />
                                 {entry.date}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {entry.mood === 'happy' && <Smile className="w-6 h-6 text-emerald-500" strokeWidth={2} />}
                           {entry.mood === 'neutral' && <Meh className="w-6 h-6 text-amber-500" strokeWidth={2} />}
                           {entry.mood === 'sad' && <Frown className="w-6 h-6 text-red-500" strokeWidth={2} />}
                        </div>
                     </div>
                     <div className="pl-0 md:pl-[60px]">
                        <p className="text-muted-foreground leading-relaxed">
                           {entry.text}
                        </p>
                     </div>
                  </div>
               ))}

               <div className="p-12 text-center border-2 border-dashed border-border rounded-[32px] text-muted-foreground/60 hover:border-primary/50 hover:bg-secondary/30 transition-all cursor-pointer">
                  <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Empty page? Start writing...</p>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
}
