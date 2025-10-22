# Community & Groups Backend Implementation Guide

## Overview
This document provides a comprehensive guide to the community and groups backend infrastructure implemented for the EKA app.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Structure](#database-structure)
3. [Type Definitions](#type-definitions)
4. [Service Layer](#service-layer)
5. [Security Rules](#security-rules)
6. [Initialization](#initialization)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)

---

## Architecture Overview

The community backend follows a three-tier architecture:

```
┌─────────────────────────────────────────┐
│        React Components (UI)            │
│  (Hidden for now - /community page)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Service Layer                     │
│  src/services/community-service.ts      │
│  - postService                          │
│  - commentService                       │
│  - groupService                         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Firebase Firestore                │
│  Collections:                           │
│  - community_posts                      │
│  - community_comments                   │
│  - community_groups                     │
│  - community_group_members              │
│  - community_reactions                  │
│  - community_notifications              │
│  - community_reports                    │
│  - community_user_profiles              │
└─────────────────────────────────────────┘
```

---

## Database Structure

### Collections

#### 1. **community_posts**
Stores all community posts with engagement metrics.

**Fields:**
- `id`: string - Unique post identifier
- `authorId`: string - User who created the post
- `content`: string - Post text content
- `category`: PostCategory - Type of post (success, question, support, etc.)
- `visibility`: PostVisibility - Who can see the post (public, group, friends)
- `groupId`: string? - Optional group association
- `likesCount`, `commentsCount`, `sharesCount`: number - Engagement metrics
- `reactions`: object - Breakdown of reaction types
- `isPinned`, `isEdited`, `isReported`, `isHidden`, `isArchived`: boolean - Status flags
- `createdAt`, `updatedAt`, `lastActivityAt`: Timestamp

**Indexes Required:**
```javascript
// Main feed query
{ isArchived: ASC, isHidden: ASC, lastActivityAt: DESC }

// Group feed query
{ groupId: ASC, isArchived: ASC, isHidden: ASC, lastActivityAt: DESC }

// User posts
{ authorId: ASC, isArchived: ASC, createdAt: DESC }

// Category filtering
{ category: ASC, isArchived: ASC, isHidden: ASC, lastActivityAt: DESC }
```

---

#### 2. **community_comments**
Stores comments and replies on posts.

**Fields:**
- `id`: string
- `postId`: string - Associated post
- `userId`: string - Comment author
- `content`: string
- `parentCommentId`: string? - For nested replies
- `likes`: number
- `replyCount`: number
- `isEdited`: boolean
- `createdAt`, `updatedAt`: Timestamp

**Indexes Required:**
```javascript
{ postId: ASC, createdAt: DESC }
{ postId: ASC, parentCommentId: ASC, createdAt: DESC }
```

---

#### 3. **community_groups**
Stores community groups with membership and activity stats.

**Fields:**
- `id`: string
- `name`: string
- `description`: string
- `category`: GroupCategory
- `privacy`: GroupPrivacy (public, private, secret)
- `ownerId`: string
- `adminIds`: string[] - Group administrators
- `moderatorIds`: string[]
- `membersCount`: number
- `postsCount`: number
- `activeMembers`: number
- `rules`: GroupRule[] - Group rules
- `allowMemberPosts`, `allowComments`, `allowReactions`: boolean - Features
- `requiresApproval`, `requirePostApproval`: boolean - Moderation settings
- `isVerified`, `isFeatured`, `isArchived`: boolean
- `createdAt`, `lastActivityAt`: Timestamp

**Indexes Required:**
```javascript
{ isArchived: ASC, membersCount: DESC }
{ category: ASC, isArchived: ASC, membersCount: DESC }
{ privacy: ASC, isArchived: ASC, membersCount: DESC }
{ isFeatured: ASC, isArchived: ASC, membersCount: DESC }
```

---

#### 4. **community_group_members**
Junction table for group membership.

**Document ID Format:** `{groupId}_{userId}`

**Fields:**
- `groupId`: string
- `userId`: string
- `role`: GroupMemberRole (owner, admin, moderator, member)
- `joinedAt`: Timestamp
- `postsCount`: number - Posts in this group
- `isActive`, `isBanned`: boolean

**Indexes Required:**
```javascript
{ groupId: ASC, joinedAt: DESC }
{ userId: ASC, joinedAt: DESC }
```

---

#### 5. **community_reactions**
Stores user reactions to posts.

**Document ID Format:** `{postId}_{userId}`

**Fields:**
- `postId`: string
- `userId`: string
- `type`: ReactionType (like, heart, support, celebrate, insightful)
- `createdAt`: Timestamp

---

#### 6. **community_user_profiles**
Extended user profile for community features.

**Document ID:** Same as `userId`

**Fields:**
- `userId`: string
- `postsCount`, `commentsCount`: number - Activity stats
- `likesReceived`, `reactionsReceived`: number - Engagement received
- `groupsJoined`, `groupsOwned`, `groupsModerated`: string[]
- `followersCount`, `followingCount`: number
- `reputationScore`: number
- `badges`: string[] - Achievement badges
- `notificationSettings`: object - Notification preferences
- `privacySettings`: object - Privacy preferences
- `warningsCount`: number - Moderation warnings
- `isBanned`: boolean

---

#### 7. **community_notifications**
User notifications for community events.

**Fields:**
- `userId`: string - Recipient
- `type`: CommunityNotificationType
- `title`, `message`: string
- `actionUrl`: string? - Link to related content
- `actorId`, `actorName`: string? - User who triggered notification
- `postId`, `commentId`, `groupId`: string? - Related entities
- `isRead`: boolean
- `createdAt`, `readAt`: Timestamp

---

#### 8. **community_reports**
Content moderation reports.

**Fields:**
- `reporterId`: string
- `contentType`: 'post' | 'comment' | 'user' | 'group'
- `contentId`: string
- `reason`: ReportReason
- `description`: string?
- `status`: ReportStatus (pending, under_review, resolved, dismissed)
- `priority`: 'low' | 'medium' | 'high' | 'critical'
- `assignedTo`: string? - Moderator
- `resolution`: string?
- `action`: string? - Action taken
- `createdAt`, `reviewedAt`, `resolvedAt`: Timestamp

---

#### 9. **community_group_invitations**
Group invitation tracking.

**Fields:**
- `groupId`, `groupName`: string
- `inviterId`, `inviterName`: string
- `inviteeId`: string
- `message`: string?
- `status`: 'pending' | 'accepted' | 'declined' | 'expired'
- `createdAt`, `expiresAt`, `respondedAt`: Timestamp

---

#### 10. **community_group_join_requests**
Join requests for private groups.

**Fields:**
- `groupId`, `groupName`: string
- `userId`, `userName`: string
- `message`: string?
- `status`: 'pending' | 'approved' | 'rejected'
- `createdAt`, `reviewedBy`, `reviewedAt`: Timestamp

---

## Service Layer

### Post Service

```typescript
import { postService } from '@/services/community-service';

// Create a post
const postId = await postService.createPost({
  authorId: currentUser.id,
  authorName: currentUser.name,
  authorRole: currentUser.role,
  content: 'This is my post content',
  category: 'success',
  visibility: 'public',
  tags: ['motivation', 'progress'],
});

// Get posts with pagination
const { posts, lastDoc } = await postService.getPosts({
  limitCount: 20,
  category: 'success',
});

// Get single post
const post = await postService.getPost(postId);

// React to post
await postService.reactToPost(postId, userId, 'heart');

// Update post
await postService.updatePost(postId, { content: 'Updated content' });

// Delete post
await postService.deletePost(postId);
```

### Comment Service

```typescript
import { commentService } from '@/services/community-service';

// Add comment
const commentId = await commentService.addComment({
  postId,
  userId: currentUser.id,
  userName: currentUser.name,
  content: 'Great post!',
});

// Add reply to comment
const replyId = await commentService.addComment({
  postId,
  userId: currentUser.id,
  userName: currentUser.name,
  content: 'Thanks for sharing!',
  parentCommentId: commentId, // This makes it a reply
});

// Get comments
const comments = await commentService.getComments(postId);

// Get replies to a comment
const replies = await commentService.getComments(postId, commentId);

// Delete comment
await commentService.deleteComment(commentId, postId);
```

### Group Service

```typescript
import { groupService } from '@/services/community-service';

// Create a group
const groupId = await groupService.createGroup({
  name: 'My Support Group',
  description: 'A supportive community',
  category: 'Support',
  privacy: 'public',
  ownerId: currentUser.id,
  ownerName: currentUser.name,
  tags: ['support', 'recovery'],
  rules: [
    { title: 'Be Respectful', description: 'Treat everyone kindly' },
    { title: 'Stay On Topic', description: 'Keep discussions relevant' },
  ],
});

// Get all groups
const groups = await groupService.getGroups({ limitCount: 20 });

// Get groups by category
const supportGroups = await groupService.getGroups({
  category: 'Support',
  limitCount: 10,
});

// Get featured groups
const featuredGroups = await groupService.getGroups({
  featured: true,
  limitCount: 5,
});

// Get single group
const group = await groupService.getGroup(groupId);

// Add member to group
await groupService.addMember(groupId, userId, userName, 'member');

// Remove member
await groupService.removeMember(groupId, userId);

// Check membership
const isMember = await groupService.isMember(groupId, userId);

// Get group members
const members = await groupService.getMembers(groupId);
```

---

## Security Rules

### Key Security Principles

1. **Authentication Required**: Most operations require authenticated users
2. **Ownership Verification**: Users can only modify their own content
3. **Role-Based Access**: Admins and moderators have elevated permissions
4. **Privacy Enforcement**: Private content is only visible to authorized users
5. **Anti-Abuse**: Rate limiting and reporting mechanisms

### Important Rules

```javascript
// Users can only create posts with their own ID
allow create: if request.auth != null
  && request.resource.data.authorId == request.auth.uid;

// Group owners and admins can moderate
allow update: if request.auth != null
  && (resource.data.ownerId == request.auth.uid
      || request.auth.uid in resource.data.adminIds);

// Privacy-based visibility
allow read: if resource.data.visibility == 'public'
  || (request.auth != null && resource.data.authorId == request.auth.uid);
```

**Full rules are in:** `src/firebase/community-rules.txt`

---

## Initialization

### Step 1: Run Initialization Script

```typescript
import { initializeCommunityDatabase } from '@/firebase/firestore/community-init';

// Run once to set up database
await initializeCommunityDatabase();
```

This creates:
- 5 default groups (Back Pain Support, Post-Surgery Recovery, etc.)
- Welcome post
- Initial data structure

### Step 2: Create Firestore Indexes

Indexes can be created via:

**Option A: Firebase Console**
1. Go to Firestore → Indexes
2. Create composite indexes as shown in the initialization log

**Option B: Firebase CLI**
```bash
# Add indexes to firebase.json
firebase deploy --only firestore:indexes
```

**Option C: Auto-create via generateFirebaseIndexesConfig()**
```typescript
import { generateFirebaseIndexesConfig } from '@/firebase/firestore/community-init';

const config = generateFirebaseIndexesConfig();
// Save to firebase.json
```

### Step 3: Deploy Security Rules

```bash
# Copy rules from community-rules.txt to firestore.rules
# Then deploy
firebase deploy --only firestore:rules
```

---

## Usage Examples

### Example 1: Create a Post in a Group

```typescript
import { postService, groupService } from '@/services/community-service';

// First, check if user is a member
const isMember = await groupService.isMember(groupId, currentUser.id);

if (!isMember) {
  throw new Error('Must join group first');
}

// Create post
const postId = await postService.createPost({
  authorId: currentUser.id,
  authorName: currentUser.name,
  authorAvatar: currentUser.avatarUrl,
  authorRole: currentUser.role,
  content: 'Just hit a major milestone in my recovery! 🎉',
  category: 'success',
  visibility: 'group',
  groupId: groupId,
  tags: ['milestone', 'recovery', 'progress'],
});
```

### Example 2: Display Community Feed

```typescript
'use client';

import { useState, useEffect } from 'react';
import { postService } from '@/services/community-service';

export function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const { posts } = await postService.getPosts({
          limitCount: 20,
          visibility: 'public',
        });
        setPosts(posts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Example 3: Group Management Dashboard

```typescript
import { groupService } from '@/services/community-service';

async function createNewGroup(formData: any) {
  const groupId = await groupService.createGroup({
    name: formData.name,
    description: formData.description,
    longDescription: formData.longDescription,
    category: formData.category,
    privacy: formData.privacy,
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    tags: formData.tags,
    coverImage: formData.coverImage,
    rules: formData.rules,
  });

  return groupId;
}

async function inviteMember(groupId: string, userId: string) {
  await groupService.addMember(groupId, userId, userName, 'member');
}

async function promoteMember(groupId: string, userId: string) {
  const memberId = `${groupId}_${userId}`;
  await updateDoc(doc(db, COMMUNITY_COLLECTIONS.GROUP_MEMBERS, memberId), {
    role: 'moderator',
  });
}
```

---

## Best Practices

### 1. Performance Optimization

```typescript
// ✅ Good: Use pagination
const { posts, lastDoc } = await postService.getPosts({
  limitCount: 20,
  lastDoc: previousLastDoc, // For next page
});

// ❌ Bad: Load all posts at once
const allPosts = await getAllPosts(); // Can be thousands of documents
```

### 2. Real-time Updates

```typescript
import { onSnapshot, collection, query, where } from 'firebase/firestore';

// Listen to new posts in real-time
const unsubscribe = onSnapshot(
  query(
    collection(db, COMMUNITY_COLLECTIONS.POSTS),
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc'),
    limit(20)
  ),
  (snapshot) => {
    const posts = snapshot.docs.map((doc) => doc.data());
    setPosts(posts);
  }
);

// Don't forget to unsubscribe
return () => unsubscribe();
```

### 3. Error Handling

```typescript
try {
  await postService.createPost(postData);
  toast.success('Post created successfully!');
} catch (error) {
  if (error.code === 'permission-denied') {
    toast.error('You do not have permission to post in this group');
  } else {
    toast.error('Failed to create post. Please try again.');
  }
  console.error('Error creating post:', error);
}
```

### 4. Content Moderation

```typescript
// Report inappropriate content
async function reportContent(contentId: string, reason: ReportReason) {
  const report: ContentReport = {
    id: generateId(),
    reporterId: currentUser.id,
    reporterName: currentUser.name,
    contentType: 'post',
    contentId,
    reason,
    description: 'Violates community guidelines',
    status: 'pending',
    priority: 'medium',
    createdAt: Timestamp.now(),
  };

  await setDoc(doc(db, COMMUNITY_COLLECTIONS.REPORTS, report.id), report);
}
```

### 5. Notification System

```typescript
// Create notification when someone comments on your post
async function createCommentNotification(
  postAuthorId: string,
  commenterId: string,
  commenterName: string,
  postId: string
) {
  // Don't notify if commenting on own post
  if (postAuthorId === commenterId) return;

  const notification: CommunityNotification = {
    id: generateId(),
    userId: postAuthorId,
    type: 'post_comment',
    title: 'New comment on your post',
    message: `${commenterName} commented on your post`,
    actionUrl: `/community/posts/${postId}`,
    actorId: commenterId,
    actorName: commenterName,
    postId,
    isRead: false,
    createdAt: Timestamp.now(),
  };

  await setDoc(
    doc(db, COMMUNITY_COLLECTIONS.NOTIFICATIONS, notification.id),
    notification
  );
}
```

---

## Integration with Existing App

### 1. Update User Context

Add community profile to user context:

```typescript
// src/context/user-context.tsx
export type User = {
  // ... existing fields
  communityProfile?: UserCommunityProfile;
};
```

### 2. Add Navigation (When Ready)

Uncomment in `src/components/eka/app-sidebar.tsx`:

```typescript
const userLinks = [
  // ...
  { href: '/community', icon: Users, label: 'Community' }, // Uncomment this line
  // ...
];
```

### 3. Create Community Pages

When ready to launch:
- `/community` - Main feed and groups
- `/community/groups/[id]` - Individual group page
- `/community/posts/[id]` - Individual post page
- `/community/profile` - User community profile

---

## Monitoring & Analytics

### Track Key Metrics

```typescript
// Daily analytics snapshot
type DailyMetrics = {
  date: string;
  newPosts: number;
  newComments: number;
  newMembers: number;
  activeUsers: number;
  topGroups: { id: string; postsCount: number }[];
};

// Implement in a scheduled Cloud Function
async function recordDailyMetrics() {
  const metrics = await calculateDailyMetrics();
  await setDoc(
    doc(db, COMMUNITY_COLLECTIONS.ANALYTICS, getTodayDate()),
    metrics
  );
}
```

---

## Future Enhancements

### Phase 2 Features (To Implement)

1. **Direct Messages**: User-to-user private messaging
2. **Live Chat**: Real-time group chat rooms
3. **Events**: Group events and meetups
4. **Badges & Gamification**: Achievement system
5. **Content Discovery**: AI-powered content recommendations
6. **Rich Media**: Image/video uploads with Cloud Storage
7. **Polls**: Interactive polls in groups
8. **Hashtag System**: Advanced tagging and search
9. **Trending Content**: Algorithm for popular posts
10. **User Reputation**: Karma/reputation system

### Phase 3 Features (Advanced)

1. **Video Streaming**: Live video sessions
2. **Translation**: Multi-language support
3. **AI Moderation**: Automated content moderation
4. **Advanced Analytics**: Detailed insights dashboard
5. **Mobile App**: React Native app with push notifications

---

## Troubleshooting

### Common Issues

**Issue: "Missing required index"**
- Solution: Create the required composite index in Firebase Console

**Issue: "Permission denied"**
- Solution: Check Firestore security rules and user authentication

**Issue: "Document does not exist"**
- Solution: Ensure user has a community profile (auto-created on first post)

**Issue: "Rate limit exceeded"**
- Solution: Implement client-side debouncing and rate limiting

---

## Support & Resources

- **Firestore Documentation**: https://firebase.google.com/docs/firestore
- **Security Rules Guide**: https://firebase.google.com/docs/firestore/security/get-started
- **Type Definitions**: `src/lib/community-types.ts`
- **Service Layer**: `src/services/community-service.ts`
- **Initialization Script**: `src/firebase/firestore/community-init.ts`

---

## Conclusion

The community backend is now fully configured and ready for development. The infrastructure supports:

✅ **Posts & Comments** with full CRUD operations
✅ **Groups** with membership management
✅ **Reactions & Engagement** tracking
✅ **Notifications** system
✅ **Content Moderation** with reporting
✅ **Privacy Controls** and security rules
✅ **Analytics** framework
✅ **Scalable Architecture** for future growth

When you're ready to launch the community feature:
1. Uncomment the sidebar navigation
2. Build the UI components
3. Test with production data
4. Enable for users

The backend is production-ready and waiting! 🚀
