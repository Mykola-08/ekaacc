import { put, list, del, type PutBlobResult, type ListBlobResult } from '@vercel/blob';

/**
 * Vercel Blob Storage Utilities
 * Provides a unified interface for file storage across all apps
 */

export interface UploadOptions {
  access?: 'public';
  cacheControlMaxAge?: number;
}

/**
 * Upload a file to Vercel Blob Storage
 * @param filename - Name of the file to upload
 * @param data - File content (string, File, or Blob)
 * @param options - Upload configuration options
 * @returns Upload result with URL and other metadata
 */
export async function uploadFile(
  filename: string,
  data: string | File | Blob,
  options: UploadOptions = { access: 'public' }
): Promise<PutBlobResult> {
  try {
    const result = await put(filename, data, {
      access: options.access || 'public',
      ...(options.cacheControlMaxAge && { 
        cacheControlMaxAge: options.cacheControlMaxAge 
      }),
    });
    return result;
  } catch (error) {
    console.error('[Blob Upload Error]:', error);
    throw new Error(`Failed to upload file: ${filename}`);
  }
}

/**
 * Upload multiple files in parallel
 * @param files - Array of files with their names and content
 * @param options - Upload configuration options
 * @returns Array of upload results
 */
export async function uploadMultipleFiles(
  files: Array<{ filename: string; data: string | File | Blob }>,
  options: UploadOptions = { access: 'public' }
): Promise<PutBlobResult[]> {
  try {
    const uploadPromises = files.map(({ filename, data }) =>
      uploadFile(filename, data, options)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('[Bulk Upload Error]:', error);
    throw new Error('Failed to upload multiple files');
  }
}

/**
 * List all files in Blob storage
 * @param options - Optional filter options
 * @returns List of blob objects
 */
export async function listFiles(options?: {
  limit?: number;
  prefix?: string;
  cursor?: string;
}): Promise<ListBlobResult> {
  try {
    return await list(options);
  } catch (error) {
    console.error('[Blob List Error]:', error);
    throw new Error('Failed to list files');
  }
}

/**
 * Delete a file from Blob storage
 * @param url - Full URL of the blob to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('[Blob Delete Error]:', error);
    throw new Error(`Failed to delete file: ${url}`);
  }
}

/**
 * Delete multiple files in parallel
 * @param urls - Array of blob URLs to delete
 */
export async function deleteMultipleFiles(urls: string[]): Promise<void> {
  try {
    const deletePromises = urls.map((url) => deleteFile(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('[Bulk Delete Error]:', error);
    throw new Error('Failed to delete multiple files');
  }
}

/**
 * Get a signed URL for temporary access to a private blob
 * Note: This is a placeholder - implement based on your needs
 */
export async function getSignedUrl(
  blobUrl: string,
  expiresIn: number = 3600
): Promise<string> {
  // Vercel Blob doesn't have built-in signed URLs like S3
  // You'd need to implement this with your own token system
  // or use the blob's built-in access control
  return blobUrl;
}

/**
 * Upload user avatar
 * @param userId - User ID
 * @param file - Avatar file
 * @returns URL of uploaded avatar
 */
export async function uploadUserAvatar(
  userId: string,
  file: File | Blob
): Promise<string> {
  const filename = `avatars/${userId}/avatar-${Date.now()}.${file.type.split('/')[1]}`;
  const result = await uploadFile(filename, file, {
    access: 'public',
    cacheControlMaxAge: 31536000, // 1 year
  });
  return result.url;
}

/**
 * Upload document with metadata
 * @param document - Document file
 * @param metadata - Document metadata
 * @returns Upload result
 */
export async function uploadDocument(
  document: File | Blob,
  metadata: {
    userId: string;
    documentType: string;
    category?: string;
  }
): Promise<PutBlobResult> {
  const timestamp = Date.now();
  const fileExtension = document instanceof File 
    ? document.name.split('.').pop() 
    : 'bin';
  
  const filename = `documents/${metadata.userId}/${metadata.documentType}/${timestamp}.${fileExtension}`;
  
  return await uploadFile(filename, document, {
    access: 'public', // TODO: Change to private when supported by Vercel Blob
  });
}

/**
 * Clean up old temporary files
 * @param olderThanDays - Delete files older than this many days
 * @param prefix - Optional prefix to filter files
 */
export async function cleanupOldFiles(
  olderThanDays: number = 7,
  prefix?: string
): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const { blobs } = await listFiles({ prefix });
    const oldBlobs = blobs.filter(blob => 
      new Date(blob.uploadedAt) < cutoffDate
    );
    
    if (oldBlobs.length > 0) {
      await deleteMultipleFiles(oldBlobs.map(blob => blob.url));
    }
    
    return oldBlobs.length;
  } catch (error) {
    console.error('[Cleanup Error]:', error);
    return 0;
  }
}
