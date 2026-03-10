'use client';

import { useState, useTransition } from 'react';
import {
  createPostAction,
  publishPostAction,
} from '@/server/telegram/actions';
import type { TelegramChannel } from '@/server/telegram/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface PostComposerProps {
  channels: TelegramChannel[];
}

export function PostComposer({ channels }: PostComposerProps) {
  const [selectedChannel, setSelectedChannel] = useState(
    channels[0]?.id ?? ''
  );
  const [content, setContent] = useState('');
  const [parseMode, setParseMode] = useState<'HTML' | 'Markdown'>('HTML');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isPending, startTransition] = useTransition();

  function handlePublishNow() {
    if (!selectedChannel || !content.trim()) {
      toast.error('Select a channel and enter content');
      return;
    }

    startTransition(async () => {
      const createRes = await createPostAction({
        channelId: selectedChannel,
        content: content.trim(),
        parseMode,
        mediaUrl: mediaUrl.trim() || null,
        mediaType: mediaUrl.trim() ? 'photo' : null,
      });

      if (!createRes.success || !createRes.data) {
        toast.error(createRes.error ?? 'Failed to create post');
        return;
      }

      const publishRes = await publishPostAction(createRes.data.id);
      if (publishRes.success) {
        toast.success('Post published successfully');
        setContent('');
        setMediaUrl('');
      } else {
        toast.error(publishRes.error ?? 'Failed to publish');
      }
    });
  }

  function handleSchedule() {
    if (!selectedChannel || !content.trim() || !scheduleDate) {
      toast.error('Fill in all required fields');
      return;
    }

    startTransition(async () => {
      const res = await createPostAction({
        channelId: selectedChannel,
        content: content.trim(),
        parseMode,
        mediaUrl: mediaUrl.trim() || null,
        mediaType: mediaUrl.trim() ? 'photo' : null,
        scheduledAt: new Date(scheduleDate).toISOString(),
      });

      if (res.success) {
        toast.success('Post scheduled');
        setContent('');
        setMediaUrl('');
        setScheduleDate('');
        setScheduleEnabled(false);
      } else {
        toast.error(res.error ?? 'Failed to schedule');
      }
    });
  }

  function handleSaveDraft() {
    if (!selectedChannel || !content.trim()) {
      toast.error('Select a channel and enter content');
      return;
    }

    startTransition(async () => {
      const res = await createPostAction({
        channelId: selectedChannel,
        content: content.trim(),
        parseMode,
        mediaUrl: mediaUrl.trim() || null,
        mediaType: mediaUrl.trim() ? 'photo' : null,
      });

      if (res.success) {
        toast.success('Draft saved');
        setContent('');
        setMediaUrl('');
      } else {
        toast.error(res.error ?? 'Failed to save draft');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Compose Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Channel selector */}
        <div className="space-y-1.5">
          <Label>Channel</Label>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((ch) => (
                <SelectItem key={ch.id} value={ch.id}>
                  {ch.title} {ch.username ? `(@${ch.username})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea
            placeholder="Write your post content…"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {content.length} characters
          </p>
        </div>

        {/* Parse mode */}
        <div className="space-y-1.5">
          <Label>Format</Label>
          <Select
            value={parseMode}
            onValueChange={(v) => setParseMode(v as 'HTML' | 'Markdown')}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HTML">HTML</SelectItem>
              <SelectItem value="Markdown">Markdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media URL */}
        <div className="space-y-1.5">
          <Label>Photo URL (optional)</Label>
          <Input
            placeholder="https://..."
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </div>

        {/* Schedule toggle */}
        <div className="flex items-center gap-2">
          <Switch
            checked={scheduleEnabled}
            onCheckedChange={setScheduleEnabled}
          />
          <Label>Schedule for later</Label>
        </div>

        {scheduleEnabled && (
          <div className="space-y-1.5">
            <Label>Schedule Date & Time</Label>
            <Input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {scheduleEnabled ? (
            <Button onClick={handleSchedule} disabled={isPending}>
              {isPending ? 'Scheduling…' : 'Schedule Post'}
            </Button>
          ) : (
            <Button onClick={handlePublishNow} disabled={isPending}>
              {isPending ? 'Publishing…' : 'Publish Now'}
            </Button>
          )}
          <Button variant="outline" onClick={handleSaveDraft} disabled={isPending}>
            Save as Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
