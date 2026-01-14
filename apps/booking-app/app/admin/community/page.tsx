import { MessageSquare } from "lucide-react";

export default function AdminCommunityPage() {
  return (
   <div className="w-full bg-[#FDFBF9] min-h-screen p-6 md:p-12">
     <div className="max-w-4xl mx-auto space-y-8">
       <div>
         <h1 className="text-3xl font-serif text-slate-900">Community Management</h1>
         <p className="text-slate-500 mt-1">Moderate forums and user content.</p>
       </div>
       
       <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-4xl border border-slate-100 shadow-xl border-dashed">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-slate-300" />
         </div>
         <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
         <p className="text-slate-500 max-w-sm">The community module is currently under development.</p>
       </div>
     </div>
   </div>
  );
 }
