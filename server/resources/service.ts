'use server';

import { db } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or HTML
  category: 'article' | 'video' | 'exercise' | 'meditation';
  tags: string[];
  imageUrl?: string;
  videoUrl?: string; // YouTube/Vimeo
  authorId: string;
  isPremium: boolean;
  publishedAt: Date;
}

export async function getResources(category?: string) {
  try {
    const query = category
      ? `SELECT * FROM resources WHERE category = $1 ORDER BY published_at DESC`
      : `SELECT * FROM resources ORDER BY published_at DESC`;

    const params = category ? [category] : [];

    // Fallback Mock until DB migration
    // const { rows } = await db.query(query, params);
    // console.log('Mocking resources for now');
    return MOCK_RESOURCES.filter((r) => !category || r.category === category);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

export async function createResource(data: Omit<ResourceItem, 'id' | 'publishedAt'>) {
  // Mock Implementation
  const newResource = {
    ...data,
    id: uuid(),
    publishedAt: new Date(),
  };
  MOCK_RESOURCES.unshift(newResource);
  return newResource;
}

const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: '1',
    title: 'Understanding Structural Integration',
    description: 'How fascia manipulation restores balance to your body.',
    content: 'Long form content...',
    category: 'article',
    tags: ['fascia', 'education'],
    imageUrl:
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop',
    authorId: 'admin',
    isPremium: false,
    publishedAt: new Date('2023-10-01'),
  },
  {
    id: '2',
    title: '5-Minute Morning Stretch Routine',
    description: 'Start your day with these simple movements.',
    content: 'Video content...',
    category: 'video',
    tags: ['movement', 'morning'],
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    videoUrl: 'https://youtube.com/watch?v=mock',
    authorId: 'admin',
    isPremium: false,
    publishedAt: new Date('2023-10-05'),
  },
  {
    id: '3',
    title: 'Box Breathing for Anxiety',
    description: 'A guided session to lower cortisol levels immediately.',
    content: 'Audio...',
    category: 'meditation',
    tags: ['anxiety', 'breathwork'],
    imageUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop',
    authorId: 'admin',
    isPremium: true,
    publishedAt: new Date('2023-10-10'),
  },
];
