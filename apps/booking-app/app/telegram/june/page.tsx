import { Bot } from "lucide-react";

export default function JuneProgramPage() {
 return (
  <div className="min-h-screen bg-[#FDFBF9] px-6 py-8 font-sans">
    <div className="mb-8 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">
        <Bot className="w-5 h-5 text-gray-700" />
      </div>
      <h1 className="text-2xl font-light text-[#1F1F1F] tracking-tight">June Program</h1>
    </div>

   <div className="bg-white p-8 rounded-4xl border border-black/3 shadow-sm space-y-6">
     <p className="text-lg text-muted-foreground leading-relaxed">
       Welcome to the June Program. Your personalized journey starts here.
     </p>
     
     <div className="space-y-4">
       {[
         { week: 1, title: 'Introduction', status: 'current' },
         { week: 2, title: 'Deep Dive', status: 'locked' },
         { week: 3, title: 'Practice', status: 'locked' },
         { week: 4, title: 'Integration', status: 'locked' }
       ].map((week) => (
         <div key={week.week} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-black/2">
           <div className={`
             w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
             ${week.status === 'current' ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}
           `}>
             {week.week}
           </div>
           <div className="flex-1">
             <div className="font-medium text-[#1F1F1F]">{week.title}</div>
             <div className="text-xs text-muted-foreground capitalize">{week.status}</div>
           </div>
         </div>
       ))}
     </div>
   </div>
  </div>
 );
}
