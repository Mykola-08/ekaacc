'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ResourceItem } from '@/server/resources/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlayIcon, 
  LegalDocumentIcon, 
  ActivityIcon, 
  LockIcon, 
  Search01Icon, 
  Image01Icon 
} from "@hugeicons/core-free-icons";
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
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 bg-background/80 backdrop-blur-xl z-20 py-4 rounded-[40px] px-2">
             <div className="relative w-full md:w-[480px]">
                <HugeiconsIcon icon={Search01Icon} className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
                <Input 
                   placeholder="Search library..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-14 h-16 bg-card border-none rounded-[32px] shadow-sm text-foreground font-medium text-lg placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar px-1">
                {categories.map(cat => (
                   <button
                      key={cat.id}
                      onClick={() => setFilter(cat.id)}
                      className={`
                         px-8 py-4 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm
                         ${filter === cat.id 
                            ? 'bg-foreground text-background shadow-lg scale-105' 
                            : 'bg-card text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-md'}
                      `}
                   >
                      {cat.label}
                   </button>
                ))}
             </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
           {filtered.map((resource) => (
             <motion.div 
               layout 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               key={resource.id}
             >
                <Card className="h-full border-none bg-card text-foreground shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-700 rounded-[36px] overflow-hidden group flex flex-col relative border border-border/50">
                   <div className="h-64 overflow-hidden relative bg-muted">
                      {resource.imageUrl ? (
                        <Image 
                          src={resource.imageUrl} 
                          alt={resource.title} 
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                          <HugeiconsIcon icon={Image01Icon} className="w-16 h-16 opacity-10" />
                        </div>
                      )}
                      <div className="absolute top-6 left-6">
                          <Badge className="bg-white/90 text-primary backdrop-blur-md border-0 shadow-lg font-black px-4 py-2 rounded-full uppercase text-[10px] tracking-widest flex items-center">
                             {resource.category === 'video' && <HugeiconsIcon icon={PlayIcon} size={14} className="mr-2" strokeWidth={2.5} />}
                             {resource.category === 'article' && <HugeiconsIcon icon={LegalDocumentIcon} size={14} className="mr-2" strokeWidth={2.5} />}
                             {resource.category === 'meditation' && <HugeiconsIcon icon={ActivityIcon} size={14} className="mr-2" strokeWidth={2.5} />}
                             {resource.category}
                          </Badge>
                      </div>
                      {resource.isPremium && (
                         <div className="absolute top-6 right-6 bg-amber-400 text-amber-950 p-3 rounded-2xl shadow-xl">
                            <HugeiconsIcon icon={LockIcon} size={16} strokeWidth={3} />
                         </div>
                      )}
                   </div>
                   <CardHeader className="p-8 pb-4">
                      <CardTitle className="leading-tight text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-muted-foreground mt-3 font-medium text-base leading-relaxed">{resource.description}</CardDescription>
                   </CardHeader>
                   <CardFooter className="p-8 pt-0 mt-auto">
                      <Button className="w-full rounded-2xl bg-secondary text-foreground hover:bg-primary hover:text-white transition-all duration-500 h-14 text-lg font-black shadow-none hover:shadow-xl hover:scale-[1.02]">
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

