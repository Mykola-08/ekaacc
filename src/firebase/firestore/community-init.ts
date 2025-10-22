/**
 * Firestore Database Initialization for Community Features
 * Run this script once to set up the initial database structure and indexes
 */

import { db } from '@/firebase/config';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { COMMUNITY_COLLECTIONS } from '@/lib/community-types';

/**
 * Initialize Community Database Structure
 * Creates default groups, sample data, and sets up indexes
 */
export async function initializeCommunityDatabase() {
  console.log('🚀 Initializing Community Database...');

  try {
    // ============================================
    // CREATE DEFAULT GROUPS
    // ============================================
    
    const defaultGroups = [
      {
        id: 'back-pain-support',
        name: 'Back Pain Support',
        description: 'A community for those dealing with chronic back pain',
        longDescription: 'Share experiences, tips, and support for managing chronic back pain. Connect with others who understand your journey and learn from their experiences.',
        category: 'Support',
        privacy: 'public',
        ownerId: 'system',
        ownerName: 'EKA Community',
        adminIds: ['system'],
        moderatorIds: [],
        tags: ['back pain', 'chronic pain', 'support', 'recovery'],
        topics: ['Pain Management', 'Exercise Tips', 'Success Stories'],
        membersCount: 0,
        pendingMembersCount: 0,
        requiresApproval: false,
        postsCount: 0,
        activeMembers: 0,
        weeklyPosts: 0,
        rules: [
          {
            id: 'rule_1',
            title: 'Be Respectful',
            description: 'Treat all members with kindness and respect',
            order: 1,
          },
          {
            id: 'rule_2',
            title: 'No Medical Advice',
            description: 'Share experiences but avoid giving medical advice',
            order: 2,
          },
          {
            id: 'rule_3',
            title: 'Stay On Topic',
            description: 'Keep discussions relevant to back pain management',
            order: 3,
          },
        ],
        allowMemberPosts: true,
        allowComments: true,
        allowReactions: true,
        requirePostApproval: false,
        isVerified: true,
        isFeatured: true,
        isArchived: false,
        createdAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      },
      {
        id: 'post-surgery-recovery',
        name: 'Post-Surgery Recovery',
        description: 'Share experiences and tips for post-surgical rehabilitation',
        longDescription: 'A supportive community for those recovering from surgery. Share your recovery journey, ask questions, and get encouragement from others who have been there.',
        category: 'Recovery',
        privacy: 'public',
        ownerId: 'system',
        ownerName: 'EKA Community',
        adminIds: ['system'],
        moderatorIds: [],
        tags: ['surgery', 'recovery', 'rehabilitation', 'healing'],
        topics: ['Recovery Timeline', 'Physical Therapy', 'Managing Pain'],
        membersCount: 0,
        pendingMembersCount: 0,
        requiresApproval: false,
        postsCount: 0,
        activeMembers: 0,
        weeklyPosts: 0,
        rules: [
          {
            id: 'rule_1',
            title: 'Share Your Story',
            description: 'Your experience can help others on their recovery journey',
            order: 1,
          },
          {
            id: 'rule_2',
            title: 'Be Supportive',
            description: 'Offer encouragement and understanding to fellow members',
            order: 2,
          },
        ],
        allowMemberPosts: true,
        allowComments: true,
        allowReactions: true,
        requirePostApproval: false,
        isVerified: true,
        isFeatured: true,
        isArchived: false,
        createdAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      },
      {
        id: 'athletes-corner',
        name: 'Athletes Corner',
        description: 'For athletes focusing on injury prevention and performance',
        longDescription: 'A community for athletes of all levels to discuss injury prevention, performance optimization, and recovery strategies.',
        category: 'Performance',
        privacy: 'public',
        ownerId: 'system',
        ownerName: 'EKA Community',
        adminIds: ['system'],
        moderatorIds: [],
        tags: ['athletes', 'performance', 'injury prevention', 'sports'],
        topics: ['Training Tips', 'Injury Prevention', 'Recovery Methods'],
        membersCount: 0,
        pendingMembersCount: 0,
        requiresApproval: false,
        postsCount: 0,
        activeMembers: 0,
        weeklyPosts: 0,
        rules: [
          {
            id: 'rule_1',
            title: 'All Levels Welcome',
            description: 'From beginners to professionals, everyone is welcome',
            order: 1,
          },
          {
            id: 'rule_2',
            title: 'Evidence-Based',
            description: 'Share scientifically-backed information when possible',
            order: 2,
          },
        ],
        allowMemberPosts: true,
        allowComments: true,
        allowReactions: true,
        requirePostApproval: false,
        isVerified: true,
        isFeatured: true,
        isArchived: false,
        createdAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      },
      {
        id: 'daily-motivation',
        name: 'Daily Motivation',
        description: 'Share progress, wins, and encourage each other daily',
        longDescription: 'Start your day with positivity! Share your daily wins, progress updates, and motivational stories. Celebrate small victories and support others on their wellness journey.',
        category: 'Motivation',
        privacy: 'public',
        ownerId: 'system',
        ownerName: 'EKA Community',
        adminIds: ['system'],
        moderatorIds: [],
        tags: ['motivation', 'progress', 'wins', 'positivity'],
        topics: ['Daily Wins', 'Motivation', 'Progress Updates'],
        membersCount: 0,
        pendingMembersCount: 0,
        requiresApproval: false,
        postsCount: 0,
        activeMembers: 0,
        weeklyPosts: 0,
        rules: [
          {
            id: 'rule_1',
            title: 'Stay Positive',
            description: 'Focus on encouraging and uplifting content',
            order: 1,
          },
          {
            id: 'rule_2',
            title: 'Celebrate All Wins',
            description: 'No win is too small to celebrate!',
            order: 2,
          },
        ],
        allowMemberPosts: true,
        allowComments: true,
        allowReactions: true,
        requirePostApproval: false,
        isVerified: true,
        isFeatured: true,
        isArchived: false,
        createdAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      },
      {
        id: 'mental-health-wellness',
        name: 'Mental Health & Wellness',
        description: 'Discuss mental health, stress management, and overall wellness',
        longDescription: 'A safe space to discuss mental health, stress management techniques, mindfulness, and the connection between mental and physical wellness.',
        category: 'Support',
        privacy: 'public',
        ownerId: 'system',
        ownerName: 'EKA Community',
        adminIds: ['system'],
        moderatorIds: [],
        tags: ['mental health', 'wellness', 'stress', 'mindfulness'],
        topics: ['Stress Management', 'Mindfulness', 'Mental-Physical Connection'],
        membersCount: 0,
        pendingMembersCount: 0,
        requiresApproval: false,
        postsCount: 0,
        activeMembers: 0,
        weeklyPosts: 0,
        rules: [
          {
            id: 'rule_1',
            title: 'Safe Space',
            description: 'This is a judgment-free zone for sharing',
            order: 1,
          },
          {
            id: 'rule_2',
            title: 'Crisis Support',
            description: 'If in crisis, please contact emergency services immediately',
            order: 2,
          },
          {
            id: 'rule_3',
            title: 'Confidentiality',
            description: 'Respect the privacy of all members',
            order: 3,
          },
        ],
        allowMemberPosts: true,
        allowComments: true,
        allowReactions: true,
        requirePostApproval: false,
        isVerified: true,
        isFeatured: true,
        isArchived: false,
        createdAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      },
    ];

    console.log('📝 Creating default groups...');
    for (const group of defaultGroups) {
      await setDoc(doc(db, COMMUNITY_COLLECTIONS.GROUPS, group.id), group);
      console.log(`✅ Created group: ${group.name}`);
    }

    // ============================================
    // CREATE WELCOME POST
    // ============================================
    
    const welcomePost = {
      id: 'welcome-post',
      authorId: 'system',
      authorName: 'EKA Community Team',
      authorRole: 'Admin',
      content: `🎉 Welcome to the EKA Community!

We're thrilled to have you here. This is a space where you can:

✨ Share your wellness journey and celebrate progress
💬 Connect with others who understand what you're going through
🤝 Get support during challenging times
📚 Learn from others' experiences and insights
💪 Find motivation to stay consistent with your goals

Remember:
• Be kind and respectful to all members
• Share your experiences, but avoid giving medical advice
• Celebrate wins - big and small!
• Ask questions - there's no such thing as a silly question

Together, we're stronger. Let's support each other on this journey to better health and wellness! 💙`,
      category: 'general',
      visibility: 'public',
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
      isPinned: true,
      isEdited: false,
      isReported: false,
      reportCount: 0,
      isHidden: false,
      isArchived: false,
      createdAt: Timestamp.now(),
      lastActivityAt: Timestamp.now(),
    };

    await setDoc(doc(db, COMMUNITY_COLLECTIONS.POSTS, welcomePost.id), welcomePost);
    console.log('✅ Created welcome post');

    console.log('✨ Community database initialized successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Add the Firestore security rules from community-rules.txt to firestore.rules');
    console.log('2. Deploy the security rules using Firebase CLI');
    console.log('3. Create the following composite indexes in Firestore:');
    console.log('   - Collection: community_posts');
    console.log('     Fields: isArchived (ASC), isHidden (ASC), lastActivityAt (DESC)');
    console.log('   - Collection: community_posts');
    console.log('     Fields: groupId (ASC), isArchived (ASC), isHidden (ASC), lastActivityAt (DESC)');
    console.log('   - Collection: community_groups');
    console.log('     Fields: isArchived (ASC), membersCount (DESC)');
    console.log('   - Collection: community_groups');
    console.log('     Fields: category (ASC), isArchived (ASC), membersCount (DESC)');
    console.log('   - Collection: community_comments');
    console.log('     Fields: postId (ASC), createdAt (DESC)');
    console.log('   - Collection: community_group_members');
    console.log('     Fields: groupId (ASC), joinedAt (DESC)');

    return { success: true, message: 'Community database initialized' };
  } catch (error) {
    console.error('❌ Error initializing community database:', error);
    throw error;
  }
}

/**
 * Helper function to create required Firestore indexes
 * Note: Indexes must be created manually in Firebase Console or via firebase.json
 */
export const REQUIRED_INDEXES = {
  community_posts: [
    {
      fields: ['isArchived', 'isHidden', 'lastActivityAt'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['groupId', 'isArchived', 'isHidden', 'lastActivityAt'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['authorId', 'isArchived', 'createdAt'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['category', 'isArchived', 'isHidden', 'lastActivityAt'],
      queryScope: 'COLLECTION',
    },
  ],
  community_groups: [
    {
      fields: ['isArchived', 'membersCount'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['category', 'isArchived', 'membersCount'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['privacy', 'isArchived', 'membersCount'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['isFeatured', 'isArchived', 'membersCount'],
      queryScope: 'COLLECTION',
    },
  ],
  community_comments: [
    {
      fields: ['postId', 'createdAt'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['postId', 'parentCommentId', 'createdAt'],
      queryScope: 'COLLECTION',
    },
  ],
  community_group_members: [
    {
      fields: ['groupId', 'joinedAt'],
      queryScope: 'COLLECTION',
    },
    {
      fields: ['userId', 'joinedAt'],
      queryScope: 'COLLECTION',
    },
  ],
};

/**
 * Generate firebase.json indexes configuration
 */
export function generateFirebaseIndexesConfig() {
  const indexes: any[] = [];

  Object.entries(REQUIRED_INDEXES).forEach(([collectionGroup, collectionIndexes]) => {
    collectionIndexes.forEach((index) => {
      indexes.push({
        collectionGroup,
        queryScope: index.queryScope,
        fields: index.fields.map((field) => ({
          fieldPath: field,
          order: field.includes('Count') || field.includes('At') ? 'DESCENDING' : 'ASCENDING',
        })),
      });
    });
  });

  return {
    firestore: {
      indexes,
    },
  };
}
