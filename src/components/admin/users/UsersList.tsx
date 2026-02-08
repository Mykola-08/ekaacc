'use client';

import { UserProfile } from '@/server/admin/user-actions';
import { format } from 'date-fns';
import { Search, Plus, MoreHorizontal, User, Shield, Phone, Mail, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UsersListProps {
  users: UserProfile[];
}

export function UsersList({ users }: UsersListProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'therapist' | 'client'>('all');

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
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">User Directory</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage platform access and permissions.
          </p>
        </div>
        <Link href="/admin/users/invite">
          <Button className="apple-button h-11 px-8">
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="flex flex-col items-center gap-4 p-4 md:flex-row">
        <div className="relative w-full flex-1 md:w-auto">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name, email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary border-border focus:bg-background h-11 rounded-xl pl-10 transition-all"
          />
        </div>
        <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {['all', 'admin', 'therapist', 'client'].map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoleFilter(role as any)}
              className={cn(
                'h-9 rounded-full px-5 capitalize',
                roleFilter === role ? 'bg-primary' : 'text-muted-foreground border-border'
              )}
            >
              {role}
            </Button>
          ))}
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card className="bg-muted/50 flex flex-col items-center justify-center border-dashed py-20">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground font-medium">No users found</p>
          </Card>
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
      className="apple-card flex flex-col items-start gap-6 p-5 lg:flex-row lg:items-center"
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
                ? 'bg-primary/10 text-primary font-bold'
                : 'bg-secondary text-muted-foreground font-medium'
            )}
          >
            {user.fullName ? user.fullName.substring(0, 1).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
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
        <Badge
          variant={
            user.status === 'active'
              ? 'default'
              : user.status === 'suspended'
                ? 'destructive'
                : 'secondary'
          }
        >
          {user.status}
        </Badge>
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
