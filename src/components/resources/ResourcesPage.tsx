'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ResourceItem } from '@/server/resources/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlayIcon,
  LegalDocumentIcon,
  ActivityIcon,
  LockIcon,
  Search01Icon,
  Image01Icon,
} from '@hugeicons/core-free-icons';
import { motion } from 'motion/react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';

interface ResourcesPageProps {
  initialResources: ResourceItem[];
}

export function ResourcesPage({ initialResources }: ResourcesPageProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = initialResources.filter((r) => {
    const matchesCategory = filter === 'all' || r.category === filter;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
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
    <div className="animate-in fade-in mx-auto max-w-6xl space-y-10 pb-20 duration-500">
      <DashboardHeader
        title="Materials Library"
        subtitle="Curated resources to support your progress between sessions."
      />

      {/* Search & Filter Bar */}
      <div className="bg-background/80 sticky top-4 z-20 flex flex-col items-center justify-between gap-6 rounded-[40px] px-2 py-4 backdrop-blur-xl md:flex-row">
        <div className="relative w-full md:w-[480px]">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2"
            strokeWidth={2.5}
          />
          <Input
            placeholder="Search library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 h-16 rounded-[20px] border-none pl-14 text-lg font-medium shadow-sm focus-visible:ring-2"
          />
        </div>
        <div className="hide-scrollbar flex w-full gap-2 overflow-x-auto px-1 pb-2 md:w-auto md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`rounded-full px-8 py-4 text-sm font-bold whitespace-nowrap shadow-sm transition-all ${
                filter === cat.id
                  ? 'bg-foreground text-background scale-105 shadow-lg'
                  : 'bg-card text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-md'
              } `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((resource) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={resource.id}
          >
            <Card className="bg-card text-foreground group border-border/50 relative flex h-full flex-col overflow-hidden rounded-[20px] border border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
              <div className="bg-muted relative h-64 overflow-hidden">
                {resource.imageUrl ? (
                  <Image
                    src={resource.imageUrl}
                    alt={resource.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="text-muted-foreground bg-muted flex h-full w-full items-center justify-center">
                    <HugeiconsIcon icon={Image01Icon} className="h-16 w-16 opacity-10" />
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="text-primary flex items-center rounded-full border-0 bg-white/90 px-4 py-2 text-[10px] font-black tracking-widest uppercase shadow-lg backdrop-blur-md">
                    {resource.category === 'video' && (
                      <HugeiconsIcon icon={PlayIcon} size={14} className="mr-2" strokeWidth={2.5} />
                    )}
                    {resource.category === 'article' && (
                      <HugeiconsIcon
                        icon={LegalDocumentIcon}
                        size={14}
                        className="mr-2"
                        strokeWidth={2.5}
                      />
                    )}
                    {resource.category === 'meditation' && (
                      <HugeiconsIcon
                        icon={ActivityIcon}
                        size={14}
                        className="mr-2"
                        strokeWidth={2.5}
                      />
                    )}
                    {resource.category}
                  </Badge>
                </div>
                {resource.isPremium && (
                  <div className="absolute top-6 right-6 rounded-[20px] bg-amber-400 p-3 text-amber-950 shadow-xl">
                    <HugeiconsIcon icon={LockIcon} size={16} strokeWidth={3} />
                  </div>
                )}
              </div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="group-hover:text-primary text-2xl leading-tight font-bold tracking-tight transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-3 line-clamp-2 text-base leading-relaxed font-medium">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto p-8 pt-0">
                <Button className="bg-secondary text-foreground hover:bg-primary h-14 w-full rounded-[20px] text-lg font-black shadow-none transition-all duration-500 hover:scale-[1.02] hover:text-white hover:shadow-xl">
                  View Content
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
