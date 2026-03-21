'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  getBotInfoAction,
  setupWebhookAction,
  setBotCommandsAction,
  setGroupPermissionsAction,
} from '@/server/telegram/actions';
import type { TelegramChannel, TelegramUser } from '@/server/telegram/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface BotSettingsProps {
  channels: TelegramChannel[];
}

interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
  allowed_updates?: string[];
}

export function BotSettings({ channels }: BotSettingsProps) {
  const [botInfo, setBotInfo] = useState<TelegramUser | null>(null);
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isPending, startTransition] = useTransition();

  // Group permissions state
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.id ?? '');
  const [permissions, setPermissions] = useState({
    can_send_messages: true,
    can_send_photos: true,
    can_send_videos: true,
    can_send_documents: true,
    can_send_audios: true,
    can_send_polls: true,
    can_send_other_messages: true,
    can_add_web_page_previews: true,
    can_change_info: false,
    can_invite_users: true,
    can_pin_messages: false,
  });

  useEffect(() => {
    startTransition(async () => {
      const res = await getBotInfoAction();
      if (res.success && res.data) {
        setBotInfo(res.data.bot ?? null);
        setWebhookInfo(res.data.webhook ?? null);
        if (res.data.webhook?.url) {
          setWebhookUrl(res.data.webhook.url);
        }
      }
    });
  }, []);

  function handleSetWebhook() {
    if (!webhookUrl.trim()) {
      toast.error('Enter a webhook URL');
      return;
    }
    startTransition(async () => {
      const res = await setupWebhookAction(webhookUrl.trim());
      if (res.success) {
        toast.success('Webhook configured');
        // Refresh info
        const info = await getBotInfoAction();
        if (info.success && info.data) setWebhookInfo(info.data.webhook ?? null);
      } else {
        toast.error(res.error ?? 'Failed to set webhook');
      }
    });
  }

  function handleSetCommands() {
    startTransition(async () => {
      const res = await setBotCommandsAction();
      if (res.success) toast.success('Bot commands updated');
      else toast.error(res.error ?? 'Failed to set commands');
    });
  }

  function handleSavePermissions() {
    if (!selectedChannel) return;
    startTransition(async () => {
      const res = await setGroupPermissionsAction(selectedChannel, permissions);
      if (res.success) toast.success('Group permissions updated');
      else toast.error(res.error ?? 'Failed to update permissions');
    });
  }

  function togglePermission(key: keyof typeof permissions) {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const groupChannels = channels.filter((c) => c.type === 'group' || c.type === 'supergroup');

  return (
    <div className="">
      {/* Bot Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bot Information</CardTitle>
        </CardHeader>
        <CardContent>
          {botInfo ? (
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Name:</span>
                <span>{botInfo.first_name}</span>
                {botInfo.username && <Badge variant="outline">@{botInfo.username}</Badge>}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Bot ID:</span>
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{botInfo.id}</code>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {isPending ? 'Loading bot info…' : 'Could not load bot info. Check your bot token.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Webhook Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className=".5">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://your-domain.com/api/webhooks/telegram"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSetWebhook} disabled={isPending}>
                {isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>

          {webhookInfo && (
            <div className="bg-muted/50 rounded-[calc(var(--radius)*0.8)] border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={webhookInfo.url ? 'default' : 'destructive'}>
                  {webhookInfo.url ? 'Active' : 'Not Set'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pending Updates</span>
                <span className="font-mono">{webhookInfo.pending_update_count}</span>
              </div>
              {webhookInfo.last_error_message && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground">Last Error</span>
                  <span className="text-destructive text-right">
                    {webhookInfo.last_error_message}
                  </span>
                </div>
              )}
              {webhookInfo.max_connections && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max Connections</span>
                  <span className="font-mono">{webhookInfo.max_connections}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bot Commands */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Bot Commands</CardTitle>
          <Button size="sm" variant="outline" onClick={handleSetCommands} disabled={isPending}>
            Sync Commands
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Push the bot&apos;s command menu to Telegram. This updates what users see when they type
            &ldquo;/&rdquo; in chat.
          </p>
          <div className="mt-3 text-sm">
            {[
              { cmd: '/start', desc: 'Get started with EKA Balance' },
              { cmd: '/help', desc: 'Show help message' },
              { cmd: '/link', desc: 'Link Telegram to EKA account' },
              { cmd: '/status', desc: 'Check account status' },
              { cmd: '/info', desc: 'Channel/group info' },
              { cmd: '/stats', desc: 'Quick analytics' },
              { cmd: '/unlink', desc: 'Unlink account' },
            ].map(({ cmd, desc }) => (
              <div key={cmd} className="flex items-center gap-3">
                <code className="bg-muted w-20 rounded px-1.5 py-0.5 text-xs font-medium">
                  {cmd}
                </code>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Group Default Permissions */}
      {groupChannels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Group Default Permissions</CardTitle>
          </CardHeader>
          <CardContent className="">
            <p className="text-muted-foreground text-sm">
              Set default permissions for all non-admin members of a group.
            </p>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groupChannels.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    {ch.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="">
              {(
                [
                  ['can_send_messages', 'Send Messages'],
                  ['can_send_photos', 'Send Photos'],
                  ['can_send_videos', 'Send Videos'],
                  ['can_send_documents', 'Send Documents'],
                  ['can_send_audios', 'Send Audio'],
                  ['can_send_polls', 'Create Polls'],
                  ['can_send_other_messages', 'Send Stickers & GIFs'],
                  ['can_add_web_page_previews', 'Embed Links'],
                  ['can_change_info', 'Change Group Info'],
                  ['can_invite_users', 'Invite Users'],
                  ['can_pin_messages', 'Pin Messages'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm">{label}</Label>
                  <Switch
                    checked={permissions[key]}
                    onCheckedChange={() => togglePermission(key)}
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleSavePermissions} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save Permissions'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
