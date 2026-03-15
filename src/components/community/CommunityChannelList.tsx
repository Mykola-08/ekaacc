'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { HashtagIcon, LockIcon, Add01Icon } from '@hugeicons/core-free-icons';

export function CommunityChannelList({ channels, activeChannelId, onSelectChannel }: any) {
  return (
    <Card className="h-full rounded-2xl border-none bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Communities</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HugeiconsIcon icon={Add01Icon} className="size-4"  />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 flex flex-col gap-1">
        {channels.map((channel: any) => (
          <Button
            key={channel.id}
            variant={activeChannelId === channel.id ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start gap-2',
              activeChannelId === channel.id && 'bg-muted font-medium'
            )}
            onClick={() => onSelectChannel(channel.id)}
          >
            {channel.type === 'private' ? (
              <HugeiconsIcon icon={LockIcon} className="text-muted-foreground size-4"  />
            ) : (
              <HugeiconsIcon icon={HashtagIcon} className="text-muted-foreground size-4"  />
            )}
            {channel.name || 'General'}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
