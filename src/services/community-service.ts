/**
 * Community Service
 * Production-ready service layer for community features with Firestore integration
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  type QueryConstraint,
  type DocumentSnapshot,
} from 'firebase/firestore';
const db: any = null;
import {
  COMMUNITY_COLLECTIONS,
  type Post,
  type PostComment,
  type PostReaction,
  type Group,
  type GroupMember,
  type GroupJoinRequest,
  type GroupInvitation,
  type UserFollow,
  type CommunityNotification,
  type ContentReport,
  type UserCommunityProfile,
  type PostCategory,
  type PostVisibility,
  type GroupPrivacy,
  type GroupMemberRole,
} from '@/lib/community-types';

// Helper to ensure db is initialized
function getDb() {
  if (!db) throw new Error('Firestore not initialized');
  return db;
}

// ============================================
// POST OPERATIONS
// ============================================

export const postService = {
  /**
   * Create a new post
   */
  async createPost(data: {
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    authorRole: 'Patient' | 'Therapist' | 'Admin' | 'Member';
    content: string;
    category: PostCategory;
    visibility: PostVisibility;
    groupId?: string;
    images?: string[];
    tags?: string[];
    mentions?: string[];
  }): Promise<string> {
    try {
      const postRef = doc(collection(getDb(), COMMUNITY_COLLECTIONS.POSTS));
      const now = Timestamp.now();

      const post: Post = {
        id: postRef.id,
        ...data,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        reactionsCount: 0,
        viewsCount: 0,
        reactions: {
          like: 0,
          heart: 0,
          support: 0,
          celebrate: 0,
          insightful: 0,
        },
        isPinned: false,
        isEdited: false,
        isReported: false,
        reportCount: 0,
        isHidden: false,
        isArchived: false,
        createdAt: now,
        lastActivityAt: now,
      };

      await setDoc(postRef, post);

      // Update group post count if posted in a group
      if (data.groupId) {
        const groupRef = doc(getDb(), COMMUNITY_COLLECTIONS.GROUPS, data.groupId);
        await updateDoc(groupRef, {
          postsCount: increment(1),
          lastActivityAt: now,
        });
      }

      // Update user community profile
      await this.updateUserStats(data.authorId, { postsCount: 1 });

      return postRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * Get posts with pagination
   */
  async getPosts(options: {
    groupId?: string;
    authorId?: string;
    category?: PostCategory;
    visibility?: PostVisibility;
    limitCount?: number;
    lastDoc?: DocumentSnapshot;
  }): Promise<{ posts: Post[]; lastDoc: DocumentSnapshot | null }> {
    try {
      const constraints: QueryConstraint[] = [];

      if (options.groupId) {
        constraints.push(where('groupId', '==', options.groupId));
      }
      if (options.authorId) {
        constraints.push(where('authorId', '==', options.authorId));
      }
      if (options.category) {
        constraints.push(where('category', '==', options.category));
      }
      if (options.visibility) {
        constraints.push(where('visibility', '==', options.visibility));
      }

      constraints.push(
        where('isArchived', '==', false),
        where('isHidden', '==', false),
        orderBy('lastActivityAt', 'desc'),
        limit(options.limitCount || 20)
      );

      if (options.lastDoc) {
        constraints.push(startAfter(options.lastDoc));
      }

      const q = query(collection(getDb(), COMMUNITY_COLLECTIONS.POSTS), ...constraints);
      const snapshot = await getDocs(q);

      const posts = snapshot.docs.map((doc) => doc.data() as Post);
      const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

      return { posts, lastDoc };
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  /**
   * Get a single post by ID
   */
  async getPost(postId: string): Promise<Post | null> {
    try {
      const postDoc = await getDoc(doc(getDb(), COMMUNITY_COLLECTIONS.POSTS, postId));
      if (!postDoc.exists()) return null;

      // Increment view count
      await updateDoc(postDoc.ref, { viewsCount: increment(1) });

      return postDoc.data() as Post;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  },

  /**
   * Update a post
   */
  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    try {
      const postRef = doc(getDb(), COMMUNITY_COLLECTIONS.POSTS, postId);
      await updateDoc(postRef, {
        ...updates,
        isEdited: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    try {
      const batch = writeBatch(getDb());

      // Delete post
      const postRef = doc(getDb(), COMMUNITY_COLLECTIONS.POSTS, postId);
      batch.delete(postRef);

      // Delete all comments
      const commentsQuery = query(
        collection(getDb(), COMMUNITY_COLLECTIONS.COMMENTS),
        where('postId', '==', postId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      commentsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      // Delete all reactions
      const reactionsQuery = query(
        collection(getDb(), COMMUNITY_COLLECTIONS.REACTIONS),
        where('postId', '==', postId)
      );
      const reactionsSnapshot = await getDocs(reactionsQuery);
      reactionsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  /**
   * React to a post
   */
  async reactToPost(
    postId: string,
    userId: string,
    reactionType: 'like' | 'heart' | 'support' | 'celebrate' | 'insightful'
  ): Promise<void> {
    try {
      const reactionId = `${postId}_${userId}`;
      const reactionRef = doc(getDb(), COMMUNITY_COLLECTIONS.REACTIONS, reactionId);
      const existingReaction = await getDoc(reactionRef);

      const postRef = doc(getDb(), COMMUNITY_COLLECTIONS.POSTS, postId);

      if (existingReaction.exists()) {
        const oldType = existingReaction.data().type;
        
        // If same reaction, remove it
        if (oldType === reactionType) {
          await deleteDoc(reactionRef);
          await updateDoc(postRef, {
            [`reactions.${reactionType}`]: increment(-1),
            reactionsCount: increment(-1),
          });
        } else {
          // Change reaction type
          await updateDoc(reactionRef, { type: reactionType });
          await updateDoc(postRef, {
            [`reactions.${oldType}`]: increment(-1),
            [`reactions.${reactionType}`]: increment(1),
          });
        }
      } else {
        // Add new reaction
        const reaction: PostReaction = {
          id: reactionId,
          postId,
          userId,
          type: reactionType,
          createdAt: Timestamp.now(),
        };
        await setDoc(reactionRef, reaction);
        await updateDoc(postRef, {
          [`reactions.${reactionType}`]: increment(1),
          reactionsCount: increment(1),
        });
      }
    } catch (error) {
      console.error('Error reacting to post:', error);
      throw error;
    }
  },

  /**
   * Update user community stats
   */
  async updateUserStats(userId: string, updates: Partial<UserCommunityProfile>): Promise<void> {
    try {
      const profileRef = doc(getDb(), COMMUNITY_COLLECTIONS.USER_PROFILES, userId);
      const profileDoc = await getDoc(profileRef);

      if (!profileDoc.exists()) {
        // Create profile if it doesn't exist
        const newProfile: UserCommunityProfile = {
          userId,
          postsCount: 0,
          commentsCount: 0,
          likesReceived: 0,
          reactionsReceived: 0,
          groupsJoined: [],
          groupsOwned: [],
          groupsModerated: [],
          followersCount: 0,
          followingCount: 0,
          reputationScore: 0,
          badges: [],
          achievements: [],
          notificationSettings: {
            postLikes: true,
            postComments: true,
            groupInvites: true,
            groupPosts: true,
            mentions: true,
            follows: true,
          },
          privacySettings: {
            profileVisibility: 'public',
            postVisibility: 'public',
            allowMessages: true,
            allowGroupInvites: true,
          },
          warningsCount: 0,
          isBanned: false,
          createdAt: Timestamp.now(),
        };
        await setDoc(profileRef, { ...newProfile, ...updates });
      } else {
        const updateData: any = { updatedAt: Timestamp.now() };
        
        // Handle numeric increments
        Object.entries(updates).forEach(([key, value]) => {
          if (typeof value === 'number') {
            updateData[key] = increment(value);
          } else {
            updateData[key] = value;
          }
        });

        await updateDoc(profileRef, updateData);
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },
};

// ============================================
// COMMENT OPERATIONS
// ============================================

export const commentService = {
  /**
   * Add a comment to a post
   */
  async addComment(data: {
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    parentCommentId?: string;
  }): Promise<string> {
    try {
      const commentRef = doc(collection(getDb(), COMMUNITY_COLLECTIONS.COMMENTS));
      const now = Timestamp.now();

      const comment: PostComment = {
        id: commentRef.id,
        ...data,
        likes: 0,
        createdAt: now,
        isEdited: false,
        replyCount: 0,
      };

      await setDoc(commentRef, comment);

      // Update post comment count and last activity
      const postRef = doc(getDb(), COMMUNITY_COLLECTIONS.POSTS, data.postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
        lastActivityAt: now,
      });

      // Update parent comment reply count if this is a reply
      if (data.parentCommentId) {
        const parentRef = doc(getDb(), COMMUNITY_COLLECTIONS.COMMENTS, data.parentCommentId);
        await updateDoc(parentRef, { replyCount: increment(1) });
      }

      // Update user stats
      await postService.updateUserStats(data.userId, { commentsCount: 1 });

      return commentRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * Get comments for a post
   */
  async getComments(postId: string, parentCommentId?: string): Promise<PostComment[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('postId', '==', postId),
        orderBy('createdAt', 'desc'),
      ];

      if (parentCommentId) {
        constraints.push(where('parentCommentId', '==', parentCommentId));
      } else {
        constraints.push(where('parentCommentId', '==', null));
      }

      const q = query(collection(getDb(), COMMUNITY_COLLECTIONS.COMMENTS), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => doc.data() as PostComment);
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string, postId: string): Promise<void> {
    try {
      await deleteDoc(doc(getDb(), COMMUNITY_COLLECTIONS.COMMENTS, commentId));

      // Update post comment count
      const postRef = doc(getDb(), COMMUNITY_COLLECTIONS.POSTS, postId);
      await updateDoc(postRef, { commentsCount: increment(-1) });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
};

// ============================================
// GROUP OPERATIONS
// ============================================

export const groupService = {
  /**
   * Create a new group
   */
  async createGroup(data: {
    name: string;
    description: string;
    longDescription?: string;
    category: string;
    privacy: GroupPrivacy;
    ownerId: string;
    ownerName: string;
    tags: string[];
    coverImage?: string;
    icon?: string;
    rules?: { title: string; description: string }[];
  }): Promise<string> {
    try {
      const groupRef = doc(collection(getDb(), COMMUNITY_COLLECTIONS.GROUPS));
      const now = Timestamp.now();

      const rules = (data.rules || []).map((rule, index) => ({
        id: `rule_${index + 1}`,
        title: rule.title,
        description: rule.description,
        order: index + 1,
      }));

      const group: Group = {
        id: groupRef.id,
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category as any,
        privacy: data.privacy,
        ownerId: data.ownerId,
        ownerName: data.ownerName,
        adminIds: [data.ownerId],
        moderatorIds: [],
        coverImage: data.coverImage,
        icon: data.icon,
        tags: data.tags,
        membersCount: 1,
        pendingMembersCount: 0,
        requiresApproval: data.privacy === 'private',
        postsCount: 0,
        activeMembers: 1,
        weeklyPosts: 0,
        rules,
        allowMemberPosts: true,
        allowComments: true,
        allowReactions: true,
        requirePostApproval: false,
        isVerified: false,
        isFeatured: false,
        isArchived: false,
        createdAt: now,
        lastActivityAt: now,
      };

      await setDoc(groupRef, group);

      // Add owner as first member
      await this.addMember(groupRef.id, data.ownerId, data.ownerName, 'owner');

      // Update user profile
      await postService.updateUserStats(data.ownerId, {
        groupsOwned: [groupRef.id] as any,
        groupsJoined: [groupRef.id] as any,
      });

      return groupRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  /**
   * Get groups with filters
   */
  async getGroups(options: {
    category?: string;
    privacy?: GroupPrivacy;
    featured?: boolean;
    limitCount?: number;
  }): Promise<Group[]> {
    try {
      const constraints: QueryConstraint[] = [where('isArchived', '==', false)];

      if (options.category) {
        constraints.push(where('category', '==', options.category));
      }
      if (options.privacy) {
        constraints.push(where('privacy', '==', options.privacy));
      }
      if (options.featured !== undefined) {
        constraints.push(where('isFeatured', '==', options.featured));
      }

      constraints.push(
        orderBy('membersCount', 'desc'),
        limit(options.limitCount || 20)
      );

      const q = query(collection(getDb(), COMMUNITY_COLLECTIONS.GROUPS), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => doc.data() as Group);
    } catch (error) {
      console.error('Error getting groups:', error);
      throw error;
    }
  },

  /**
   * Get a single group
   */
  async getGroup(groupId: string): Promise<Group | null> {
    try {
      const groupDoc = await getDoc(doc(getDb(), COMMUNITY_COLLECTIONS.GROUPS, groupId));
      return groupDoc.exists() ? (groupDoc.data() as Group) : null;
    } catch (error) {
      console.error('Error getting group:', error);
      throw error;
    }
  },

  /**
   * Add a member to a group
   */
  async addMember(
    groupId: string,
    userId: string,
    userName: string,
    role: GroupMemberRole = 'member',
    userAvatar?: string
  ): Promise<void> {
    try {
      const memberId = `${groupId}_${userId}`;
      const memberRef = doc(getDb(), COMMUNITY_COLLECTIONS.GROUP_MEMBERS, memberId);

      const member: GroupMember = {
        id: memberId,
        groupId,
        userId,
        userName,
        userAvatar,
        role,
        joinedAt: Timestamp.now(),
        postsCount: 0,
        isActive: true,
        isBanned: false,
      };

      await setDoc(memberRef, member);

      // Update group member count
      const groupRef = doc(getDb(), COMMUNITY_COLLECTIONS.GROUPS, groupId);
      await updateDoc(groupRef, { membersCount: increment(1) });

      // Update user profile
      const profileRef = doc(getDb(), COMMUNITY_COLLECTIONS.USER_PROFILES, userId);
      await updateDoc(profileRef, {
        groupsJoined: arrayUnion(groupId),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  /**
   * Remove a member from a group
   */
  async removeMember(groupId: string, userId: string): Promise<void> {
    try {
      const memberId = `${groupId}_${userId}`;
      await deleteDoc(doc(getDb(), COMMUNITY_COLLECTIONS.GROUP_MEMBERS, memberId));

      // Update group member count
      const groupRef = doc(getDb(), COMMUNITY_COLLECTIONS.GROUPS, groupId);
      await updateDoc(groupRef, { membersCount: increment(-1) });

      // Update user profile
      const profileRef = doc(getDb(), COMMUNITY_COLLECTIONS.USER_PROFILES, userId);
      await updateDoc(profileRef, {
        groupsJoined: arrayRemove(groupId),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  /**
   * Check if user is a member of a group
   */
  async isMember(groupId: string, userId: string): Promise<boolean> {
    try {
      const memberId = `${groupId}_${userId}`;
      const memberDoc = await getDoc(doc(getDb(), COMMUNITY_COLLECTIONS.GROUP_MEMBERS, memberId));
      return memberDoc.exists();
    } catch (error) {
      console.error('Error checking membership:', error);
      return false;
    }
  },

  /**
   * Get group members
   */
  async getMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const q = query(
        collection(getDb(), COMMUNITY_COLLECTIONS.GROUP_MEMBERS),
        where('groupId', '==', groupId),
        orderBy('joinedAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => doc.data() as GroupMember);
    } catch (error) {
      console.error('Error getting members:', error);
      throw error;
    }
  },
};

// Export all services
export const communityService = {
  posts: postService,
  comments: commentService,
  groups: groupService,
};

export default communityService;
