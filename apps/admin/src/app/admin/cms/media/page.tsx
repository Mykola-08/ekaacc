'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth-context';
import { format } from 'date-fns';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Search, 
  ArrowLeft,
  FileIcon,
  Film,
  Music,
  File,
  Grid,
  List,
  Copy,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string;
  created_at: string;
  uploaded_by?: string;
}

export default function MediaManagementPage() {
  const { canAccessResource } = useAuth();
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          setMedia([]);
          return;
        }
        throw error;
      }
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.original_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || getFileType(item.mime_type) === typeFilter;
    return matchesSearch && matchesType;
  });

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (mimeType: string) => {
    const type = getFileType(mimeType);
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8" />;
      case 'video':
        return <Film className="h-8 w-8" />;
      case 'audio':
        return <Music className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filename, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(filename);

        if (!urlData?.publicUrl) {
          throw new Error('Failed to get public URL for uploaded file');
        }

        const publicUrl = urlData.publicUrl;

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('cms_media')
          .insert({
            filename,
            original_name: file.name,
            mime_type: file.type,
            size: file.size,
            url: publicUrl,
            created_at: new Date().toISOString(),
          });

        if (dbError) throw dbError;
      }

      toast({ title: 'Success', description: 'Files uploaded successfully' });
      fetchMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({ title: 'Error', description: 'Failed to upload files', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([item.filename]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('cms_media')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      toast({ title: 'Success', description: 'File deleted successfully' });
      fetchMedia();
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({ title: 'Error', description: 'Failed to delete file', variant: 'destructive' });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Copied', description: 'URL copied to clipboard' });
  };

  if (!canAccessResource('content_management', 'read')) {
    return (
      <SettingsShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">You don't have permission to access media management.</p>
        </div>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/cms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <ImageIcon className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Media Library"
            description="Upload and manage media files"
          />
        </div>
        {canAccessResource('content_management', 'create') && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleUpload}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Media Files</CardTitle>
          <CardDescription>{filteredMedia.length} files</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No media files found. Upload your first file to get started.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => { setSelectedMedia(item); setIsDetailOpen(true); }}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {item.mime_type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.alt_text || item.original_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">
                        {getFileIcon(item.mime_type)}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-sm truncate">{item.original_name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  onClick={() => { setSelectedMedia(item); setIsDetailOpen(true); }}
                >
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {item.mime_type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.alt_text || item.original_name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-muted-foreground">
                        {getFileIcon(item.mime_type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.original_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(item.size)} • {format(new Date(item.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline">{getFileType(item.mime_type)}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
            <DialogDescription>
              View and manage file information
            </DialogDescription>
          </DialogHeader>

          {selectedMedia && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {selectedMedia.mime_type.startsWith('image/') ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.alt_text || selectedMedia.original_name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    {getFileIcon(selectedMedia.mime_type)}
                    <p className="mt-2">{selectedMedia.original_name}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Filename</Label>
                  <p className="font-medium">{selectedMedia.original_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Size</Label>
                  <p className="font-medium">{formatFileSize(selectedMedia.size)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedMedia.mime_type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Uploaded</Label>
                  <p className="font-medium">
                    {format(new Date(selectedMedia.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={selectedMedia.url} readOnly className="flex-1" />
                  <Button variant="outline" onClick={() => copyToClipboard(selectedMedia.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" asChild>
              <a href={selectedMedia?.url} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            {canAccessResource('content_management', 'delete') && selectedMedia && (
              <Button variant="destructive" onClick={() => handleDelete(selectedMedia)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
