'use client';

import { use } from 'react';
import { Construction } from 'lucide-react';

export default function TelegramActionPage({ params }: { params: Promise<{ slug: string[] }> }) {
 const { slug } = use(params);
 const title = slug.join(' ');

 return (
  <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-center">
   <div className="w-16 h-16 bg-white rounded-full border border-black/3 flex items-center justify-center mb-6 shadow-sm">
     <Construction className="w-8 h-8 text-black/20" />
   </div>
   <h1 className="text-2xl font-light text-[#1F1F1F] capitalize mb-2">{title}</h1>
   <p className="text-muted-foreground max-w-xs mx-auto">
     We're still working on this feature. Check back soon.
   </p>
  </div>
 );
}
