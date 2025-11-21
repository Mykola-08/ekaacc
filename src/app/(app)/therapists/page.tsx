'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@/components/eka/page-container';
import { PageHeader } from '@/components/eka/page-header';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';

export default function TherapistsPage() {
  const dataService = useAppStore((state) => state.dataService);

  const [therapists, setTherapists] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTherapists() {
      if (dataService) {
        setIsLoading(true);
        const allUsers = await dataService.getAllUsers();
        const therapistUsers = allUsers.filter(user => user.role === 'Therapist');
        setTherapists(therapistUsers);
        setIsLoading(false);
      }
    }
    fetchTherapists();
  }, [dataService]);

  const filteredTherapists = useMemo(() => {
    return therapists
      .filter((therapist) => {
        if (!searchTerm) return true;
        return therapist.name?.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .filter((therapist) => {
        if (!specialty) return true;
        return therapist.therapistProfile?.specializations?.includes(specialty);
      });
  }, [therapists, searchTerm, specialty]);

  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    therapists.forEach(therapist => {
      therapist.therapistProfile?.specializations?.forEach(s => specialties.add(s));
    });
    return Array.from(specialties);
  }, [therapists]);

  return (
    <PageContainer>
      <PageHeader
        icon={Users}
        title="Find Your Therapist"
        description="Browse our network of qualified therapists to find the right fit for you"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex gap-4 mb-8"
      >
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select onValueChange={(value) => setSpecialty(value === 'all' ? null : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {allSpecialties.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading ? (
          [...Array(6)].map((_, i) => <TherapistSkeleton key={i} />)
        ) : (
          filteredTherapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <TherapistCard therapist={therapist} />
            </motion.div>
          ))
        )}
      </motion.div>
    </PageContainer>
  );
}

function TherapistCard({ therapist }: { therapist: User }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={therapist.avatarUrl} alt={therapist.name} />
            <AvatarFallback>{therapist.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{therapist.name}</h3>
            <p className="text-sm text-muted-foreground">
              {therapist.therapistProfile?.certifications?.[0] || 'Licensed Therapist'}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">
          {therapist.bio?.substring(0, 100) || 'No bio available.'}...
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {therapist.therapistProfile?.specializations?.slice(0, 3).map(spec => (
            <Badge key={spec} color="primary">{spec}</Badge>
          ))}
        </div>
        <Button className="w-full">View Profile</Button>
      </CardContent>
    </Card>
  );
}

function TherapistSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
