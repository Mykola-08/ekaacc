'use client';

import { useState } from 'react';
import { BookOpen, Plus, Calendar, Smile, Frown, Meh, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "../dashboard/layout/DashboardLayout";
import { DashboardHeader } from "../dashboard/layout/DashboardHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// Mock entries
const MOCK_ENTRIES = [
   { id: 1, title: "Post-Session Reflection", date: "2023-10-24", mood: "happy", text: "Felt really open today after the deep tissue work. Should drink more water." },
   { id: 2, title: "Weekly Check-in", date: "2023-10-20", mood: "neutral", text: "Back pain is subsiding, but shoulder is still tight." },
];

const MOODS = [
  { id: 'happy', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'neutral', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'sad', icon: Frown, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export function JournalPage() {
   const [entries, setEntries] = useState(MOCK_ENTRIES);
   const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
   const [newEntry, setNewEntry] = useState({ title: '', text: '', mood: 'neutral' });

   const handleSave = () => {
     if (!newEntry.text) return;
     const entry = {
       id: Date.now(),
       title: newEntry.title || "Daily Check-in",
       date: new Date().toISOString().split('T')[0] || new Date().toISOString(),
       mood: newEntry.mood,
       text: newEntry.text
     };
     setEntries([entry, ...entries]);
     setNewEntry({ title: '', text: '', mood: 'neutral' });
     setIsNewEntryOpen(false);
   };

   return (
      <DashboardLayout profile={{ first_name: 'Client' }}>
         <div className="space-y-8 max-w-4xl mx-auto">
            <DashboardHeader title="Reflections" subtitle="Your private wellness journal. AI-secured.">
               <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
                  <DialogTrigger asChild>
                     <Button className="h-12 px-6 rounded-[16px] bg-[#222222] text-white shadow-xl shadow-[#222222]/20 hover:bg-[#000000] transition-all hover:scale-105 active:scale-95 text-[15px] font-bold">
                        <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                        New Entry
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px] rounded-[32px] border-0 shadow-[0_40px_80px_rgba(0,0,0,0.12)] bg-white p-8">
                     <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-[#222222] tracking-tight">New Reflection</DialogTitle>
                     </DialogHeader>
                     <div className="grid gap-6 py-6">
                        <div className="flex gap-3 justify-center pb-2">
                           {MOODS.map(m => (
                              <button
                                 key={m.id}
                                 onClick={() => setNewEntry({ ...newEntry, mood: m.id })}
                                 className={cn(
                                    "p-4 rounded-full transition-all duration-300",
                                    newEntry.mood === m.id ? `${m.bg} scale-110 shadow-inner ring-2 ring-black/5` : "hover:bg-[#F9F9F8]"
                                 )}
                              >
                                 <m.icon className={cn("w-8 h-8", m.color, newEntry.mood !== m.id && "opacity-40 grayscale")} strokeWidth={2.5} />
                              </button>
                           ))}
                        </div>
                        <Input 
                           placeholder="Title (optional)" 
                           value={newEntry.title}
                           onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                           className="h-14 border-none bg-[#F9F9F8] text-lg font-bold px-6 py-4 rounded-[20px] focus-visible:ring-0 placeholder:text-[#999999] text-[#222222]"
                        />
                        <Textarea 
                           placeholder="How are you feeling today?" 
                           value={newEntry.text}
                           onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                           className="min-h-[200px] border-none bg-[#F9F9F8] text-base leading-relaxed p-6 rounded-[24px] resize-none focus-visible:ring-0 placeholder:text-[#999999] text-[#222222]"
                        />
                     </div>
                     <DialogFooter>
                        <Button onClick={handleSave} className="w-full rounded-[20px] bg-[#222222] hover:bg-[#000000] text-white h-14 font-bold text-lg shadow-xl shadow-[#222222]/10 transition-transform active:scale-95">Save Entry</Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </DashboardHeader>

            <motion.div layout className="grid grid-cols-1 gap-6 pb-20">
               {entries.map(entry => {
                  const m = MOODS.find(mood => mood.id === entry.mood) || MOODS[1]!;
                  return (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={entry.id} 
                        className="bg-white p-8 rounded-[32px] shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 group border border-transparent hover:border-[#F0F0F0]"
                     >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                           <div className="flex items-center gap-5">
                              <div className={cn("w-14 h-14 rounded-[20px] flex items-center justify-center transition-transform group-hover:scale-110 duration-500", m.bg)}>
                                 <m.icon className={cn("w-7 h-7", m.color)} strokeWidth={2.5} />
                              </div>
                              <div>
                                 <h3 className="text-xl font-bold text-[#222222] tracking-tight mb-1">{entry.title}</h3>
                                 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#999999]">
                                    <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    {entry.date}
                                 </div>
                              </div>
                           </div>
                           <Button variant="ghost" size="sm" className="hidden group-hover:flex text-[#4DAFFF] bg-[#4DAFFF]/5 hover:bg-[#4DAFFF]/10 rounded-full h-9 px-4 text-xs font-bold transition-all">
                              <Sparkles className="w-3.5 h-3.5 mr-2" strokeWidth={2.5} />
                              AI Analyze
                           </Button>
                        </div>
                        <div className="pl-0 md:pl-[76px]">
                           <p className="text-[#555555] leading-relaxed text-[16px] font-medium">
                              {entry.text}
                           </p>
                        </div>
                     </motion.div>
                  );
               })}
            </motion.div>
         </div>
      </DashboardLayout>
   );
}
