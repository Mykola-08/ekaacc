'use client';

import { AdminService } from '@/server/admin/actions';
import { Layers01Icon, Add01Icon, MoreHorizontalIcon, EyeIcon, ViewIcon, Tag01Icon } from '@hugeicons/core-free-icons';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/filter-bar';
import { PageSection } from '@/components/ui/page-section';
import { EmptyState } from '@/components/ui/empty-state';
import { HugeiconsIcon } from '@hugeicons/react';

interface ServicesListProps {
  services: AdminService[];
}

export function ServicesList({ services }: ServicesListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

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
    <div className="animate-fade-in h-full w-full p-6 md:p-12">
      <PageSection
        title="Services Catalog"
        description="Manage offerings, pricing and visibility."
        actions={
          <Link href="/console/services/new">
            <Button className="hover: rounded-full transition-all hover:-translate-y-0.5">
              <HugeiconsIcon icon={Add01Icon} className="mr-2 size-4"  />
              Create Service
            </Button>
          </Link>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search services..."
        filters={['all', 'public', 'hidden', 'active', 'inactive']}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="">
        {filteredServices.length === 0 ? (
          <EmptyState icon={Layers01Icon} title="No services found" />
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
      className="hover: flex flex-col items-start gap-6 p-6 transition-all duration-300 md:flex-row md:items-center"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-1 items-center gap-4">
        <div className="bg-muted border-border relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <HugeiconsIcon icon={Layers01Icon} className="text-muted-foreground/50 size-8"  />
          )}
        </div>
        <div>
          <h3 className="text-foreground mb-1 text-xl font-semibold">{service.name}</h3>
          <p className="text-muted-foreground line-clamp-1 max-w-md text-sm">
            {service.description || 'No description provided'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {service.isPublic ? (
          <Badge variant="success" className="gap-1.5">
            <HugeiconsIcon icon={EyeIcon} className="size-3"  />
            Public
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1.5">
            <HugeiconsIcon icon={ViewIcon} className="size-3"  />
            Hidden
          </Badge>
        )}

        {service.active ? (
          <div className="bg-success mx-2 h-2 w-2 rounded-full" title="Active" />
        ) : (
          <div className="bg-muted-foreground/30 mx-2 h-2 w-2 rounded-full" title="Inactive" />
        )}
      </div>

      {service.tags && service.tags.length > 0 && (
        <div className="hidden max-w-50 items-center gap-2 overflow-hidden lg:flex">
          {service.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs font-semibold tracking-wider uppercase"
            >
              <HugeiconsIcon icon={Tag01Icon} className="mr-1 size-2"  />
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
            <HugeiconsIcon icon={MoreHorizontalIcon} className="text-muted-foreground size-5"  />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
