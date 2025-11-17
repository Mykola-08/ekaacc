'use client';

import { Badge } from '@/components/ui/badge';
import { Heart, HandHeart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';

interface UserStatusBadgesProps {
  user: User;
  showVip?: boolean;
  showDonor?: boolean;
  showSeeker?: boolean;
  showChildren?: boolean;
  className?: string;
}

export function UserStatusBadges({
  user,
  showVip = true,
  showDonor = true,
  showSeeker = true,
  showChildren = true,
  className,
}: UserStatusBadgesProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {showVip && user.isVip && user.vipTier && (
        <Badge variant="border" className="bg-gradient-to-r from-yellow-500/10 to-yellow-300/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
          {user.vipTier} VIP
        </Badge>
      )}
      
      {showDonor && user.isDonor && (
        <Badge variant="border" className="bg-gradient-to-r from-pink-500/10 to-rose-300/10 border-pink-500/50 text-pink-700 dark:text-pink-400">
          <Heart className="h-3 w-3 mr-1" />
          Donor
        </Badge>
      )}
      
      {showSeeker && user.isDonationSeeker && (
        <Badge variant="border" className="bg-gradient-to-r from-blue-500/10 to-cyan-300/10 border-blue-500/50 text-blue-700 dark:text-blue-400">
          <HandHeart className="h-3 w-3 mr-1" />
          Seeking Support
        </Badge>
      )}
      
      {showChildren && user.linkedChildren && user.linkedChildren.length > 0 && (
        <Badge variant="border" className="bg-gradient-to-r from-purple-500/10 to-purple-300/10 border-purple-500/50 text-purple-700 dark:text-purple-400">
          <Users className="h-3 w-3 mr-1" />
          {user.linkedChildren.length} {user.linkedChildren.length === 1 ? 'Child' : 'Children'}
        </Badge>
      )}
    </div>
  );
}
