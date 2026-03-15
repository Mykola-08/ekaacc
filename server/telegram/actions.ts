'use server';

// ─── Telegram Admin Server Actions ──────────────────────────
// Called from the admin dashboard. All actions require admin role.

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import * as telegramService from './service';
import * as telegramAnalytics from './analytics';
import * as botApi from './bot-api';
import type { CreatePostInput, UpdatePostInput } from './types';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const role = user.app_metadata?.role || user.user_metadata?.role || 'Patient';
  if (!['admin', 'super_admin', 'Admin', 'SuperAdmin'].includes(role)) {
    throw new Error('Forbidden: Admin role required');
  }

  return user;
}

// ─── Channel Actions ────────────────────────────────────────

export async function addChannelAction(chatId: number) {
  const user = await requireAdmin();
  const channel = await telegramService.registerChannel(chatId, user.id);
  if (!channel)
    return { success: false, error: 'Failed to register channel. Is the bot an admin?' };
  revalidatePath('/console/telegram');
  return { success: true, data: channel };
}

export async function listChannelsAction() {
  await requireAdmin();
  const channels = await telegramService.listChannels();
  return { success: true, data: channels };
}

export async function refreshChannelAction(channelId: string) {
  await requireAdmin();
  const channel = await telegramService.refreshChannel(channelId);
  if (!channel) return { success: false, error: 'Failed to refresh channel info' };
  revalidatePath('/console/telegram');
  return { success: true, data: channel };
}

export async function deactivateChannelAction(channelId: string) {
  await requireAdmin();
  const success = await telegramService.deactivateChannel(channelId);
  if (!success) return { success: false, error: 'Failed to deactivate channel' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function getChannelAction(channelId: string) {
  await requireAdmin();
  const channel = await telegramService.getChannel(channelId);
  if (!channel) return { success: false, error: 'Channel not found' };
  return { success: true, data: channel };
}

export async function updateChannelTitleAction(channelId: string, title: string) {
  await requireAdmin();
  const success = await telegramService.updateChannelTitle(channelId, title);
  if (!success) return { success: false, error: 'Failed to update title' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function updateChannelDescriptionAction(channelId: string, description: string) {
  await requireAdmin();
  const success = await telegramService.updateChannelDescription(channelId, description);
  if (!success) return { success: false, error: 'Failed to update description' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function getInviteLinkAction(channelId: string) {
  await requireAdmin();
  const link = await telegramService.getInviteLink(channelId);
  if (!link) return { success: false, error: 'Failed to generate invite link' };
  return { success: true, data: link };
}

// ─── Post Actions ───────────────────────────────────────────

export async function createPostAction(input: CreatePostInput) {
  const user = await requireAdmin();
  const post = await telegramService.createPost(input, user.id);
  if (!post) return { success: false, error: 'Failed to create post' };
  revalidatePath('/console/telegram');
  return { success: true, data: post };
}

export async function updatePostAction(input: UpdatePostInput) {
  await requireAdmin();
  const post = await telegramService.updatePost(input);
  if (!post) return { success: false, error: 'Failed to update post' };
  revalidatePath('/console/telegram');
  return { success: true, data: post };
}

export async function publishPostAction(postId: string) {
  await requireAdmin();
  const post = await telegramService.publishPost(postId);
  if (!post) return { success: false, error: 'Failed to publish post' };
  revalidatePath('/console/telegram');
  return { success: true, data: post };
}

export async function deletePostAction(postId: string) {
  await requireAdmin();
  const success = await telegramService.deletePost(postId);
  if (!success) return { success: false, error: 'Failed to delete post' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function listPostsAction(channelId: string, status?: string) {
  await requireAdmin();
  const posts = await telegramService.listPosts(channelId, status);
  return { success: true, data: posts };
}

export async function pinMessageAction(channelId: string, messageId: number) {
  await requireAdmin();
  const success = await telegramService.pinChannelMessage(channelId, messageId);
  if (!success) return { success: false, error: 'Failed to pin message' };
  return { success: true };
}

export async function unpinMessageAction(channelId: string, messageId?: number) {
  await requireAdmin();
  const success = await telegramService.unpinChannelMessage(channelId, messageId);
  if (!success) return { success: false, error: 'Failed to unpin message' };
  return { success: true };
}

// ─── Member Actions ─────────────────────────────────────────

export async function listMembersAction(channelId: string) {
  await requireAdmin();
  const members = await telegramService.listGroupMembers(channelId);
  return { success: true, data: members };
}

export async function banMemberAction(channelId: string, userId: number) {
  await requireAdmin();
  const success = await telegramService.banMember(channelId, userId);
  if (!success) return { success: false, error: 'Failed to ban member' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function unbanMemberAction(channelId: string, userId: number) {
  await requireAdmin();
  const success = await telegramService.unbanMember(channelId, userId);
  if (!success) return { success: false, error: 'Failed to unban member' };
  revalidatePath('/console/telegram');
  return { success: true };
}

// ─── Analytics Actions ──────────────────────────────────────

export async function getChannelOverviewAction(channelId: string) {
  await requireAdmin();
  const overview = await telegramAnalytics.getChannelOverview(channelId);
  return { success: true, data: overview };
}

export async function getChannelAnalyticsAction(channelId: string, days = 30) {
  await requireAdmin();
  const analytics = await telegramAnalytics.getChannelAnalytics(channelId, days);
  return { success: true, data: analytics };
}

export async function getTopPostsAction(channelId: string, limit = 10) {
  await requireAdmin();
  const posts = await telegramAnalytics.getTopPosts(channelId, limit);
  return { success: true, data: posts };
}

export async function recordSnapshotAction(channelId: string) {
  await requireAdmin();
  const channel = await telegramService.getChannel(channelId);
  if (!channel) return { success: false, error: 'Channel not found' };
  await telegramAnalytics.recordChannelSnapshot(channelId, channel.chat_id);
  revalidatePath('/console/telegram');
  return { success: true };
}

// ─── Bot Info & Webhook ─────────────────────────────────────

export async function getBotInfoAction() {
  await requireAdmin();
  const [meRes, webhookRes] = await Promise.all([botApi.getMe(), botApi.getWebhookInfo()]);

  return {
    success: true,
    data: {
      bot: meRes.ok ? meRes.result : null,
      webhook: webhookRes.ok ? webhookRes.result : null,
    },
  };
}

export async function setupWebhookAction(url: string) {
  await requireAdmin();

  const { getTelegramSecretToken } = await import('@/lib/config');
  const secretToken = await getTelegramSecretToken();

  const result = await botApi.setWebhook(url, {
    secretToken: secretToken ?? undefined,
    allowedUpdates: [
      'message',
      'edited_message',
      'channel_post',
      'edited_channel_post',
      'callback_query',
      'my_chat_member',
      'chat_member',
    ],
  });

  if (!result.ok) return { success: false, error: result.description ?? 'Failed to set webhook' };
  return { success: true };
}

export async function sendDirectMessageAction(chatId: number, text: string) {
  await requireAdmin();
  const result = await botApi.sendMessage(chatId, text);
  if (!result.ok) return { success: false, error: result.description ?? 'Failed to send message' };
  return { success: true, data: result.result };
}

// ─── Group Management Actions ───────────────────────────

export async function promoteMemberAction(channelId: string, userId: number) {
  await requireAdmin();
  const success = await telegramService.promoteMember(channelId, userId, {
    canDeleteMessages: true,
    canInviteUsers: true,
    canRestrictMembers: true,
    canPinMessages: true,
    canManageChat: true,
  });
  if (!success) return { success: false, error: 'Failed to promote member' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function demoteMemberAction(channelId: string, userId: number) {
  await requireAdmin();
  const success = await telegramService.demoteMember(channelId, userId);
  if (!success) return { success: false, error: 'Failed to demote member' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function restrictMemberAction(
  channelId: string,
  userId: number,
  permissions: Record<string, boolean>,
  untilDate?: number
) {
  await requireAdmin();
  const success = await telegramService.restrictMember(channelId, userId, permissions, untilDate);
  if (!success) return { success: false, error: 'Failed to restrict member' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function setGroupPermissionsAction(
  channelId: string,
  permissions: Parameters<typeof telegramService.setGroupPermissions>[1]
) {
  await requireAdmin();
  const success = await telegramService.setGroupPermissions(channelId, permissions);
  if (!success) return { success: false, error: 'Failed to set group permissions' };
  return { success: true };
}

export async function getAdminsAction(channelId: string) {
  await requireAdmin();
  const admins = await telegramService.getAdmins(channelId);
  return { success: true, data: admins };
}

export async function unpinAllMessagesAction(channelId: string) {
  await requireAdmin();
  const success = await telegramService.unpinAllMessages(channelId);
  if (!success) return { success: false, error: 'Failed to unpin messages' };
  return { success: true };
}

export async function leaveGroupAction(channelId: string) {
  await requireAdmin();
  const success = await telegramService.leaveGroup(channelId);
  if (!success) return { success: false, error: 'Failed to leave group' };
  revalidatePath('/console/telegram');
  return { success: true };
}

export async function setBotCommandsAction() {
  await requireAdmin();
  const result = await botApi.setMyCommands([
    { command: 'start', description: 'Get started with EKA Balance' },
    { command: 'help', description: 'Show help message' },
    { command: 'link', description: 'Link your Telegram to EKA account' },
    { command: 'status', description: 'Check your account status' },
    { command: 'info', description: 'Channel/group info' },
    { command: 'stats', description: 'Quick analytics (admin)' },
    { command: 'unlink', description: 'Unlink your Telegram account' },
  ]);
  if (!result.ok) return { success: false, error: result.description ?? 'Failed to set commands' };
  return { success: true };
}
