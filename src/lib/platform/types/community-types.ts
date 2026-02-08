/**
 * Community & Groups Types
 * Comprehensive type definitions for community features, groups, posts, and interactions
 */

// Using Supabase - Date type instead of Firebase Timestamp
type Timestamp = Date;

// ============================================
// POST TYPES
// ============================================

export type PostCategory = 'success' | 'question' | 'support' | 'general' | 'advice' | 'milestone';

export type PostVisibility = 'public' | 'group' | 'friends' | 'private';

export type PostReaction = {
  id: string;
  postId: string;
  userId: string;
  type: 'like' | 'heart' | 'support' | 'celebrate' | 'insightful';
  createdAt: Timestamp;
};

export type PostComment = {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  isEdited: boolean;
  parentCommentId?: string; // For nested replies
  replyCount?: number;
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'Patient' | 'Therapist' | 'Admin' | 'Member';
  content: string;
  category: PostCategory;
  visibility: PostVisibility;
  groupId?: string; // If posted in a specific group

  // Media & Content
  images?: string[]; // Image URLs
  tags?: string[]; // Hashtags
  mentions?: string[]; // @mentions user IDs

  // Engagement Metrics
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  reactionsCount: number;
  viewsCount: number;

  // Reactions breakdown
  reactions: {
    like: number;
    heart: number;
    support: number;
    celebrate: number;
    insightful: number;
  };

  // Moderation
  isPinned: boolean;
  isEdited: boolean;
  isReported: boolean;
  reportCount: number;
  isHidden: boolean;
  isArchived: boolean;
  moderationStatus?: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderatedBy?: string;
  moderatedAt?: Timestamp;

  // Timestamps
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  lastActivityAt: Timestamp; // For sorting by recent activity
};

// ============================================
// GROUP TYPES
// ============================================

export type GroupCategory =
  | 'Support'
  | 'Recovery'
  | 'Performance'
  | 'Motivation'
  | 'Condition-Specific'
  | 'General';

export type GroupPrivacy = 'public' | 'private' | 'secret';

export type GroupMemberRole = 'owner' | 'admin' | 'moderator' | 'member';

export type GroupMember = {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: GroupMemberRole;
  joinedAt: Timestamp;
  lastActiveAt?: Timestamp;
  postsCount: number;
  isActive: boolean;
  isBanned: boolean;
  bannedReason?: string;
  bannedUntil?: Timestamp;
};

export type GroupRule = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: GroupCategory;
  privacy: GroupPrivacy;

  // Owner & Admins
  ownerId: string;
  ownerName: string;
  adminIds: string[];
  moderatorIds: string[];

  // Visuals
  coverImage?: string;
  icon?: string;
  color?: string; // Theme color for the group

  // Metadata
  tags: string[];
  topics?: string[]; // Main discussion topics

  // Membership
  membersCount: number;
  pendingMembersCount: number; // For private groups
  maxMembers?: number;
  requiresApproval: boolean; // For joining

  // Activity Stats
  postsCount: number;
  activeMembers: number; // Members active in last 30 days
  weeklyPosts: number;

  // Rules & Guidelines
  rules: GroupRule[];
  guidelines?: string;

  // Features & Settings
  allowMemberPosts: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  requirePostApproval: boolean; // Moderator approval for posts

  // Moderation
  isVerified: boolean; // Official/verified group
  isFeatured: boolean; // Featured on community page
  isArchived: boolean;

  // Timestamps
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  lastActivityAt: Timestamp;
};

// ============================================
// INTERACTION TYPES
// ============================================

export type UserFollow = {
  id: string;
  followerId: string; // User who follows
  followingId: string; // User being followed
  createdAt: Timestamp;
  notificationsEnabled: boolean;
};

export type GroupInvitation = {
  id: string;
  groupId: string;
  groupName: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Timestamp;
  expiresAt: Timestamp;
  respondedAt?: Timestamp;
};

export type GroupJoinRequest = {
  id: string;
  groupId: string;
  groupName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
};

// ============================================
// NOTIFICATION TYPES
// ============================================

export type CommunityNotificationType =
  | 'post_like'
  | 'post_comment'
  | 'comment_reply'
  | 'post_share'
  | 'group_invite'
  | 'group_join_request'
  | 'group_post'
  | 'group_announcement'
  | 'user_follow'
  | 'mention'
  | 'milestone_reached';

export type CommunityNotification = {
  id: string;
  userId: string; // Recipient
  type: CommunityNotificationType;
  title: string;
  message: string;
  actionUrl?: string;

  // Related entities
  actorId?: string; // User who triggered the notification
  actorName?: string;
  actorAvatar?: string;
  postId?: string;
  commentId?: string;
  groupId?: string;

  isRead: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
};

// ============================================
// MODERATION TYPES
// ============================================

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'misinformation'
  | 'hate_speech'
  | 'violence'
  | 'self_harm'
  | 'other';

export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';

export type ContentReport = {
  id: string;
  reporterId: string;
  reporterName: string;

  // What was reported
  contentType: 'post' | 'comment' | 'user' | 'group';
  contentId: string;
  groupId?: string;

  reason: ReportReason;
  description?: string;

  // Moderation
  status: ReportStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string; // Moderator ID
  resolution?: string;
  action?: 'no_action' | 'warning' | 'content_removed' | 'user_banned' | 'group_closed';

  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  resolvedAt?: Timestamp;
};

// ============================================
// USER COMMUNITY PROFILE
// ============================================

export type UserCommunityProfile = {
  userId: string;

  // Activity Stats
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  reactionsReceived: number;

  // Groups
  groupsJoined: string[];
  groupsOwned: string[];
  groupsModerated: string[];

  // Connections
  followersCount: number;
  followingCount: number;

  // Reputation & Badges
  reputationScore: number;
  badges: string[]; // Badge IDs
  achievements: {
    id: string;
    name: string;
    unlockedAt: Timestamp;
  }[];

  // Settings
  notificationSettings: {
    postLikes: boolean;
    postComments: boolean;
    groupInvites: boolean;
    groupPosts: boolean;
    mentions: boolean;
    follows: boolean;
  };

  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    postVisibility: PostVisibility;
    allowMessages: boolean;
    allowGroupInvites: boolean;
  };

  // Moderation
  warningsCount: number;
  isBanned: boolean;
  bannedUntil?: Timestamp;
  bannedReason?: string;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

// ============================================
// ANALYTICS TYPES
// ============================================

export type GroupAnalytics = {
  groupId: string;
  date: string; // YYYY-MM-DD

  // Daily metrics
  newMembers: number;
  activeMembers: number;
  postsCreated: number;
  commentsCreated: number;
  reactions: number;
  views: number;

  // Engagement
  avgPostsPerMember: number;
  avgCommentsPerPost: number;
  memberRetentionRate: number;

  createdAt: Timestamp;
};

export type CommunityAnalytics = {
  date: string; // YYYY-MM-DD

  // Overall metrics
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalPosts: number;
  totalComments: number;

  // Engagement
  avgSessionDuration: number;
  postsPerUser: number;
  commentsPerPost: number;

  // Growth
  newUsers: number;
  newGroups: number;
  userRetentionRate: number;

  createdAt: Timestamp;
};

// ============================================
// FIRESTORE COLLECTION NAMES
// ============================================

export const COMMUNITY_COLLECTIONS = {
  POSTS: 'community_posts',
  COMMENTS: 'community_comments',
  REACTIONS: 'community_reactions',
  GROUPS: 'community_groups',
  GROUP_MEMBERS: 'community_group_members',
  GROUP_INVITATIONS: 'community_group_invitations',
  GROUP_JOIN_REQUESTS: 'community_group_join_requests',
  FOLLOWS: 'community_follows',
  NOTIFICATIONS: 'community_notifications',
  REPORTS: 'community_reports',
  USER_PROFILES: 'community_user_profiles',
  GROUP_ANALYTICS: 'community_group_analytics',
  ANALYTICS: 'community_analytics',
} as const;
