'use server';

import { createClient } from '@/lib/supabase/server';
import { v4 as uuid } from 'uuid';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or JSON
  category:
    | 'article'
    | 'video'
    | 'exercise'
    | 'meditation'
    | 'protocol'
    | 'worksheet'
    | 'kinesiology';
  tags: string[];
  imageUrl?: string;
  videoUrl?: string; // YouTube/Vimeo
  authorId?: string;
  isPremium: boolean;
  publishedAt: string;
}

export interface ClinicalProtocol {
  id: string;
  title: string;
  version: string;
  description: string;
  modality: string;
  content_json: any; // Format of standard structured steps
  created_at: string;
}

export async function getResources(category?: string): Promise<ResourceItem[]> {
  const supabase = await createClient();
  let query = supabase.from('resources').select('*').order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data.map((d: any) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    content: d.content,
    category: d.category,
    tags: d.tags || [],
    imageUrl: d.image_url,
    videoUrl: d.video_url,
    authorId: d.author_id,
    isPremium: d.is_premium,
    publishedAt: d.published_at ?? d.created_at,
  }));
}

export async function getClinicalProtocols(): Promise<ClinicalProtocol[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clinical_protocols')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching protocols:', error);
    const { getLocalFileProtocols } = await import('./fallbacks');
    const fallbacks = await getLocalFileProtocols();
    return fallbacks.map((f) => ({
      id: f.id,
      title: f.name,
      version: f.version,
      description: f.name,
      modality: f.type,
      content_json: f.contentJson,
      created_at: new Date().toISOString(),
    }));
  }
  return data || [];
}
