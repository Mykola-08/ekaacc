'use client';

import { UserProfile } from '@/server/admin/user-actions';
import { Plus, MoreHorizontal, Shield, Phone, Mail, Building } from 'lucide-react';
import { UserIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FilterBar } from '@/components/ui/filter-bar';
import { PageSection } from '@/components/ui/page-section';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';

interface UsersListProps {
  users: UserProfile[];
}

export function UsersList({ users }: UsersListProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.company || '').toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="animate-fade-in h-full w-full space-y-8 p-6 md:p-12">
      <PageSection
        title="User Directory"
        description="Manage platform access and permissions."
        actions={
          <Link href="/admin/users/invite">
            <Button className="apple-button h-11 px-8">
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </Link>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email or company..."
        filters={['all', 'admin', 'therapist', 'client']}
        activeFilter={roleFilter}
        onFilterChange={setRoleFilter}
      />

      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <EmptyState icon={UserIcon} title="No users found" />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user, idx) => (
              <UserRow key={user.id} user={user} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({ user, index }: { user: UserProfile; index: number }) {
  const isLead = user.role !== 'client';

  return (
    <Card
      className="bg-card border-border rounded-lg border p-5 shadow-sm flex flex-col items-start gap-6 lg:flex-row lg:items-center"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-1 items-center gap-4">
        <Avatar
          className={cn(
            'h-14 w-14 border-2 shadow-sm',
            isLead ? 'border-primary/20' : 'border-border'
          )}
        >
          <AvatarFallback
            className={cn(
              isLead
                ? 'bg-primary/10 text-primary font-semibold'
                : 'bg-secondary text-muted-foreground font-medium'
            )}
          >
            {user.fullName ? user.fullName.substring(0, 1).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-foreground flex items-center gap-2 text-lg font-semibold">
            {user.fullName || 'Unnamed User'}
            {isLead && <Shield className="text-primary fill-primary/20 h-3 w-3" />}
          </h3>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </span>
            {user.phone && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {user.phone}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-50 flex-wrap items-center justify-start gap-3 lg:w-auto lg:justify-end">
        {user.company && (
          <Badge variant="outline" className="gap-1">
            <Building className="h-3 w-3" />
            {user.company}
          </Badge>
        )}
        <StatusBadge status={user.status} />
        <Badge variant="secondary" className="tracking-wider uppercase">
          {user.role}
        </Badge>
      </div>

      <div className="border-border mt-2 ml-auto flex w-full items-center justify-end border-t p-4 pt-4 lg:mt-0 lg:w-auto lg:border-t-0 lg:p-0 lg:pt-0">
        <Link href={`/admin/users/${user.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="text-muted-foreground h-5 w-5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
