'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { ImpersonationBanner } from '@/components/platform/admin/user-impersonation';
import { useToast } from '@/hooks/platform/ui/use-toast';

interface ImpersonationWrapperProps {
  children: React.ReactNode;
}

export function ImpersonationWrapper({ children }: ImpersonationWrapperProps) {
  const { isImpersonating, impersonationData, endImpersonation } = useAuth();
  const { toast } = useToast();

  const handleEndImpersonation = async () => {
    try {
      const { error } = await endImpersonation();
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Impersonation Ended',
          description: 'You have returned to your original account',
        });
      }
    } catch (error) {
      console.error('Error ending impersonation:', error);
      toast({
        title: 'Error',
        description: 'Failed to end impersonation',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {isImpersonating && impersonationData && (
        <ImpersonationBanner
          impersonation={impersonationData}
          onEndImpersonation={handleEndImpersonation}
        />
      )}
      {children}
    </>
  );
}
