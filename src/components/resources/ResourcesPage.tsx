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
import { scaleIn } from '@/lib/motion';

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
    <div className="mx-auto max-w-6xl px-4 py-8 pb-20 md:px-8">
      {/* Search & Filter Bar */}
      <div className="bg-background/80 sticky top-4 z-20 flex flex-col items-center justify-between gap-6 rounded-full px-2 py-4 backdrop-blur-xl md:flex-row">
        <div className="relative w-full md:w-120">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2"
            strokeWidth={2.5}
          />
          <Input
            placeholder="Search library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 h-16 rounded-lg border-none pl-14 text-lg font-medium focus-visible:ring-2"
          />
        </div>
        <div className="hide-scrollbar flex w-full gap-2 overflow-x-auto px-1 pb-2 md:w-auto md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`rounded-full px-8 py-4 text-sm font-semibold whitespace-nowrap transition-all ${
                filter === cat.id
                  ? 'bg-foreground text-background scale-105'
                  : 'bg-card text-muted-foreground hover:bg-background hover:text-foreground hover:'
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
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            key={resource.id}
          >
            <Card className="bg-card text-foreground group border-border/50 hover: relative flex h-full flex-col overflow-hidden rounded-lg border border-none transition-all duration-700 hover:-translate-y-3">
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
                  <Badge className="text-primary bg-card/90 text-2xs flex items-center rounded-full border-0 px-4 py-2 font-semibold tracking-widest uppercase backdrop-blur-md">
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
                  <div className="bg-warning text-warning-foreground absolute top-6 right-6 rounded-lg p-3">
                    <HugeiconsIcon icon={LockIcon} size={16} strokeWidth={3} />
                  </div>
                )}
              </div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="group-hover:text-primary text-2xl leading-tight font-semibold tracking-tight transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-3 line-clamp-2 text-base leading-relaxed font-medium">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto p-8 pt-0">
                <Button className="bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground hover: h-10 w-full rounded-lg text-lg font-semibold transition-all duration-500">
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
