'use client';

import { AdminService } from "@/server/admin/actions";
import { Search, Plus, MoreHorizontal, Layers, Eye, EyeOff, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ServicesListProps {
    services: AdminService[];
}

export function ServicesList({ services }: ServicesListProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'public' | 'hidden' | 'active' | 'inactive'>('all');

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
        
        const matchesFilter = 
            filter === 'all' ? true :
            filter === 'public' ? service.isPublic :
            filter === 'hidden' ? !service.isPublic :
            filter === 'active' ? service.active :
            !service.active;
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="w-full h-full p-6 md:p-12 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-foreground">Services Catalog</h1>
                    <p className="text-muted-foreground mt-1">Manage offerings, pricing and visibility.</p>
                </div>
                <Link href="/admin/services/new">
                    <Button className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Service
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        type="text" 
                        placeholder="Search services..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {['all', 'public', 'hidden', 'active', 'inactive'].map(f => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f as any)}
                            className="capitalize rounded-full"
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* List */}
            <div className="space-y-4">
                {filteredServices.length === 0 ? (
                    <Card className="py-20 flex flex-col items-center justify-center border-dashed bg-muted/50">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Layers className="w-6 h-6 text-muted-foreground" />
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

function ServiceRow({ service, index }: { service: AdminService, index: number }) {
    return (
        <Card 
            className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            
            <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 relative">
                    {service.imageUrl ? (
                        <Image 
                            src={service.imageUrl} 
                            alt={service.name} 
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <Layers className="w-8 h-8 text-muted-foreground/50" />
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                        {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                        {service.description || 'No description provided'}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                 {service.isPublic ? (
                     <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent">
                        <Eye className="w-3 h-3 mr-1.5" />
                        Public
                     </Badge>
                 ) : (
                     <Badge variant="secondary" className="gap-1.5">
                        <EyeOff className="w-3 h-3" />
                        Hidden
                     </Badge>
                 )}

                 {service.active ? (
                     <div className="w-2 h-2 rounded-full bg-emerald-500 mx-2" title="Active" />
                 ) : (
                     <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mx-2" title="Inactive" />
                 )}
            </div>

            {service.tags && service.tags.length > 0 && (
                <div className="hidden lg:flex items-center gap-2 max-w-[200px] overflow-hidden">
                    {service.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs uppercase font-bold tracking-wider">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                        </Badge>
                    ))}
                    {service.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{service.tags.length - 2}</span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-end border-l pl-6 border-border ml-auto md:ml-0">
                <Link href={`/admin/services/${service.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
            </div>

        </Card>
    );
}
