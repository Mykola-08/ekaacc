import { put, list, del, type PutBlobResult } from '@vercel/blob';
import { createClient } from '@vercel/edge-config';

// Initialize Edge Config client
// Ensure process.env.EDGE_CONFIG is set in your Vercel project settings
export const edgeConfig = createClient(process.env.EDGE_CONFIG);

/**
 * Upload a file to Vercel Blob
 */
export const uploadToBlob = async (
  filename: string,
  data: string | File | Blob,
  options: { access: 'public' } = { access: 'public' }
): Promise<PutBlobResult> => {
  return await put(filename, data, options);
};

/**
 * List files in Vercel Blob
 */
export const listBlobs = async () => {
  return await list();
};

/**
 * Delete a file from Vercel Blob
 */
export const deleteFromBlob = async (url: string) => {
  await del(url);
};

/**
 * Get a value from Edge Config
 */
export const getEdgeConfigValue = async <T>(key: string): Promise<T | undefined> => {
  return await edgeConfig.get<T>(key);
};
