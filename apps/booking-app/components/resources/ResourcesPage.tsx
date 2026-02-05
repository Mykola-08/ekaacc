'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ResourceItem } from '@/server/resources/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, FileText, Activity, Lock, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';

interface ResourcesPageProps {
  initialResources: ResourceItem[];
}

export function ResourcesPage({ initialResources }: ResourcesPageProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = initialResources.filter(r => {
    const matchesCategory = filter === 'all' || r.category === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'article', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'exercise', label: 'Movement' },
  ];

  return (
    <DashboardLayout profile={{ first_name: 'Client', role: 'client' }}>
      <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
        <DashboardHeader 
          title="Wellness Library" 
          subtitle="Curated resources to support your journey between sessions."
        />

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 bg-[#F9F9F8] z-20 py-2">
             <div className="relative w-full md:w-[480px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#999999]" strokeWidth={2.5} />
                <Input 
                   placeholder="Search library..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-12 h-14 bg-white border-none rounded-[20px] shadow-sm shadow-black/5 text-[#222222] font-medium text-lg placeholder:text-[#999999] focus-visible:ring-2 focus-visible:ring-[#4DAFFF]/20"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar px-1">
                {categories.map(cat => (
                   <button
                      key={cat.id}
                      onClick={() => setFilter(cat.id)}
                      className={`
                         px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm
                         ${filter === cat.id 
                            ? 'bg-[#222222] text-white shadow-lg shadow-[#222222]/20 hover:scale-105' 
                            : 'bg-white text-[#999999] hover:bg-white hover:text-[#222222] hover:shadow-md'}
                      `}
                   >
                      {cat.label}
                   </button>
                ))}
             </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {filtered.map((resource) => (
             <motion.div 
               layout 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               key={resource.id}
             >
                <Card className="h-full border-none bg-white text-[#222222] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 rounded-[32px] overflow-hidden group flex flex-col">
                   <div className="h-56 overflow-hidden relative bg-[#EAEAEA]">
                      {resource.imageUrl ? (
                        <Image 
                          src={resource.imageUrl} 
                          alt={resource.title} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#999999] bg-[#EAEAEA]">
                          <ImageIcon className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                          <Badge className="bg-white/95 text-[#222222] backdrop-blur-md border-0 shadow-lg font-bold px-3 py-1.5 rounded-full uppercase text-[10px] tracking-wider">
                             {resource.category === 'video' && <PlayCircle className="w-3 h-3 mr-1.5" strokeWidth={2.5} />}
                             {resource.category === 'article' && <FileText className="w-3 h-3 mr-1.5" strokeWidth={2.5} />}
                             {resource.category === 'meditation' && <Activity className="w-3 h-3 mr-1.5" strokeWidth={2.5} />}
                             {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                          </Badge>
                      </div>
                      {resource.isPremium && (
                         <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 p-2 rounded-full shadow-lg">
                            <Lock className="w-3.5 h-3.5" strokeWidth={3} />
                         </div>
                      )}
                   </div>
                   <CardHeader className="p-6 pb-2">
                      <CardTitle className="leading-tight text-xl font-bold tracking-tight">{resource.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-[#555555] mt-2 font-medium leading-relaxed">{resource.description}</CardDescription>
                   </CardHeader>
                   <CardFooter className="p-6 pt-auto mt-auto">
                      <Button className="w-full rounded-[20px] bg-[#F9F9F8] text-[#222222] hover:bg-[#222222] hover:text-white transition-all duration-300 h-12 font-bold shadow-sm">
                         View Content
                      </Button>
                   </CardFooter>
                </Card>
             </motion.div>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
