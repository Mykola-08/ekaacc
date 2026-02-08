'use client';

import { AdminService } from '@/server/admin/actions';
import { Search, Plus, MoreHorizontal, Layers, Eye, EyeOff, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ServicesListProps {
  services: AdminService[];
}

export function ServicesList({ services }: ServicesListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'hidden' | 'active' | 'inactive'>('all');

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'public'
          ? service.isPublic
          : filter === 'hidden'
            ? !service.isPublic
            : filter === 'active'
              ? service.active
              : !service.active;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in h-full w-full space-y-8 p-6 md:p-12">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground font-serif text-3xl">Services Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage offerings, pricing and visibility.</p>
        </div>
        <Link href="/admin/services/new">
          <Button className="rounded-full shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
            <Plus className="mr-2 h-4 w-4" />
            Create Service
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="flex flex-col items-center gap-4 p-4 md:flex-row">
        <div className="relative w-full flex-1 md:w-auto">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {['all', 'public', 'hidden', 'active', 'inactive'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f as any)}
              className="rounded-full capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <Card className="bg-muted/50 flex flex-col items-center justify-center border-dashed py-20">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Layers className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground font-medium">No services found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.map((service, idx) => (
              <ServiceRow key={service.id} service={service} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceRow({ service, index }: { service: AdminService; index: number }) {
  return (
    <Card
      className="flex flex-col items-start gap-6 p-6 transition-all duration-300 hover:shadow-md md:flex-row md:items-center"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-1 items-center gap-4">
        <div className="bg-muted border-border relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border">
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <Layers className="text-muted-foreground/50 h-8 w-8" />
          )}
        </div>
        <div>
          <h3 className="text-foreground mb-1 text-xl font-bold">{service.name}</h3>
          <p className="text-muted-foreground line-clamp-1 max-w-md text-sm">
            {service.description || 'No description provided'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {service.isPublic ? (
          <Badge
            variant="secondary"
            className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          >
            <Eye className="mr-1.5 h-3 w-3" />
            Public
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1.5">
            <EyeOff className="h-3 w-3" />
            Hidden
          </Badge>
        )}

        {service.active ? (
          <div className="mx-2 h-2 w-2 rounded-full bg-emerald-500" title="Active" />
        ) : (
          <div className="bg-muted-foreground/30 mx-2 h-2 w-2 rounded-full" title="Inactive" />
        )}
      </div>

      {service.tags && service.tags.length > 0 && (
        <div className="hidden max-w-[200px] items-center gap-2 overflow-hidden lg:flex">
          {service.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs font-bold tracking-wider uppercase"
            >
              <Tag className="mr-1 h-2 w-2" />
              {tag}
            </Badge>
          ))}
          {service.tags.length > 2 && (
            <span className="text-muted-foreground text-xs">+{service.tags.length - 2}</span>
          )}
        </div>
      )}

      <div className="border-border ml-auto flex items-center justify-end border-l pl-6 md:ml-0">
        <Link href={`/admin/services/${service.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="text-muted-foreground h-5 w-5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
