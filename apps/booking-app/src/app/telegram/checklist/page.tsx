'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, CheckSquare } from 'lucide-react';

export default function ChecklistPage() {
 const [items, setItems] = useState([
  { id: 1, label: 'Morning Meditation', checked: false },
  { id: 2, label: 'Drink Water (2L)', checked: false },
  { id: 3, label: 'Journaling', checked: false },
  { id: 4, label: 'Evening Stretch', checked: false },
 ]);

 const toggleItem = (id: number) => {
  setItems(items.map(item => 
   item.id === id ? { ...item, checked: !item.checked } : item
  ));
 };

 const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

 return (
  <div className="min-h-screen bg-background px-6 py-8 font-sans">
   <div className="mb-8 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-card border border-black/5 flex items-center justify-center shadow-sm">
        <CheckSquare className="w-5 h-5 text-gray-700" />
      </div>
      <div>
        <h1 className="text-2xl font-light text-[#1F1F1F] tracking-tight">Daily Checklist</h1>
        <p className="text-sm text-muted-foreground">{progress}% Completed</p>
      </div>
   </div>

   {/* Progress Bar */}
   <div className="mb-8 w-full h-2 bg-muted rounded-full overflow-hidden">
     <motion.div 
       initial={{ width: 0 }}
       animate={{ width: `${progress}%` }}
       className="h-full bg-black rounded-full"
     />
   </div>

   <div className="space-y-3">
    {items.map((item) => (
     <motion.div 
       key={item.id}
       layout
       onClick={() => toggleItem(item.id)}
       className={cn(
         "cursor-pointer group flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300",
         item.checked 
           ? "bg-background border-transparent opacity-80" 
           : "bg-card border-black/4 shadow-sm hover:shadow-md hover:-translate-y-0.5"
       )}
     >
      <div className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
        item.checked ? "bg-black border-black" : "border-gray-300 group-hover:border-black"
      )}>
        {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      
      <span className={cn(
        "text-base font-medium transition-colors duration-300",
        item.checked ? "text-muted-foreground line-through" : "text-[#1F1F1F]"
      )}>
       {item.label}
      </span>
     </motion.div>
    ))}
   </div>
  </div>
 );
}
