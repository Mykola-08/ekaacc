'use client';

import { UserProfile } from "@/server/admin/user-actions";
import { format } from "date-fns";
import { Search, Plus, MoreHorizontal, User, Shield, Phone, Mail, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UsersListProps {
    users: UserProfile[];
}

export function UsersList({ users }: UsersListProps) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'therapist' | 'client'>('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            (user.company || '').toLowerCase().includes(search.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="w-full h-full p-6 md:p-12 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">User Directory</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Manage platform access and permissions.</p>
                </div>
                <Link href="/admin/users/invite">
                    <Button className="apple-button h-11 px-8">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New User
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name, email or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-11 bg-secondary border-border focus:bg-background transition-all rounded-xl"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {['all', 'admin', 'therapist', 'client'].map(role => (
                        <Button
                            key={role}
                            variant={roleFilter === role ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRoleFilter(role as any)}
                            className={cn("capitalize rounded-full px-5 h-9", roleFilter === role ? "bg-primary" : "text-muted-foreground border-border")}
                        >
                            {role}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* List */}
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <Card className="py-20 flex flex-col items-center justify-center border-dashed bg-muted/50">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-muted-foreground" />
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

function UserRow({ user, index }: { user: UserProfile, index: number }) {
    const isLead = user.role !== 'client';

    return (
        <Card
            className="p-5 flex flex-col lg:flex-row items-start lg:items-center gap-6 apple-card"
            style={{ animationDelay: `${index * 50}ms` }}
        >

            <div className="flex items-center gap-4 flex-1">
                <Avatar className={cn("w-14 h-14 border-2 shadow-sm", isLead ? "border-primary/20" : "border-border")}>
                    <AvatarFallback className={cn(isLead ? "bg-primary/10 text-primary font-bold" : "bg-secondary text-muted-foreground font-medium")}>
                        {user.fullName ? user.fullName.substring(0, 1).toUpperCase() : 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        {user.fullName || 'Unnamed User'}
                        {isLead && (
                            <Shield className="w-3 h-3 text-primary fill-primary/20" />
                        )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                        </span>
                        {user.phone && (
                            <>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {user.phone}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 min-w-50 justify-start lg:justify-end w-full lg:w-auto">
                {user.company && (
                    <Badge variant="outline" className="gap-1">
                        <Building className="w-3 h-3" />
                        {user.company}
                    </Badge>
                )}
                <Badge variant={user.status === 'active' ? "default" : user.status === 'suspended' ? "destructive" : "secondary"}>
                    {user.status}
                </Badge>
                <Badge variant="secondary" className="uppercase tracking-wider">
                    {user.role}
                </Badge>
            </div>

            <div className="w-full lg:w-auto flex items-center justify-end border-t lg:border-t-0 p-4 lg:p-0 mt-2 lg:mt-0 pt-4 lg:pt-0 border-border ml-auto">
                <Link href={`/admin/users/${user.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
            </div>

        </Card>
    );
}
