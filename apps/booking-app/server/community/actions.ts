"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  likesCount: number;
  userId: string;
}

export async function getPosts(): Promise<Post[]> {
  const query = `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.category,
      p.created_at as "createdAt",
      p.likes_count as "likesCount",
      p.user_id as "userId"
    FROM posts p
    ORDER BY p.created_at DESC
    LIMIT 50;
  `;
  
  const { rows } = await db.query(query);
  return rows.map(row => ({
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt
  })) as Post[];
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string || "general";
  const userId = formData.get("userId") as string;

  if (!title || !content || !userId) {
      throw new Error("Missing fields");
  }

  const query = `
    INSERT INTO posts (user_id, title, content, category)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;

  await db.query(query, [userId, title, content, category]);
  revalidatePath("/community");
  redirect("/community");
}

export async function getPost(id: string): Promise<Post | null> {
  const query = `SELECT * FROM posts WHERE id = $1`;
  const { rows } = await db.query(query, [id]);
  if (rows.length === 0) return null;
  const row = rows[0]!;
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    createdAt: row.created_at.toISOString(),
    likesCount: row.likes_count, 
    userId: row.user_id 
  } as Post;
}
