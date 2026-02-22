'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, Lock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CommunityChannelList({ channels, activeChannelId, onSelectChannel }: any) {
  return (
    <Card className="h-full border-r rounded-none shadow-none">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Communities</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        {channels.map((channel: any) => (
          <Button
            key={channel.id}
            variant={activeChannelId === channel.id ? 'secondary' : 'ghost'}
            className={cn("w-full justify-start gap-2", activeChannelId === channel.id && "bg-muted font-medium")}
            onClick={() => onSelectChannel(channel.id)}
          >
            {channel.type === 'private' ? <Lock className="w-4 h-4 text-muted-foreground" /> : <Hash className="w-4 h-4 text-muted-foreground" />}
            {channel.name || 'General'}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
