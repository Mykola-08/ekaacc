'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth-context';
import { format } from 'date-fns';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Save,
  Globe,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  created_by?: string;
  meta_title?: string;
  meta_description?: string;
}

export default function PagesManagementPage() {
  const { canAccessResource } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title: '',
    meta_description: '',
  });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, show empty state
        if (error.code === '42P01') {
          setPages([]);
          return;
        }
        throw error;
      }
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const filteredPages = pages.filter((page) => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdate = async () => {
    try {
      if (selectedPage) {
        const { error } = await supabase
          .from('cms_pages')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedPage.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Page updated successfully' });
      } else {
        const { error } = await supabase
          .from('cms_pages')
          .insert({
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Page created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({ title: 'Error', description: 'Failed to save page', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Page deleted successfully' });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({ title: 'Error', description: 'Failed to delete page', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
    });
    setSelectedPage(null);
  };

  const openEditDialog = (page: Page) => {
    setSelectedPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!canAccessResource('content_management', 'read')) {
    return (
      <SettingsShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">You don't have permission to access content management.</p>
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
          <FileText className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Pages"
            description="Manage website pages and content"
          />
        </div>
        {canAccessResource('content_management', 'create') && (
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pages</CardTitle>
          <CardDescription>{filteredPages.length} pages found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pages found. Create your first page to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                    <TableCell>
                      {page.updated_at ? format(new Date(page.updated_at), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canAccessResource('content_management', 'update') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(page)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canAccessResource('content_management', 'delete') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(page.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPage ? 'Edit Page' : 'Create Page'}</DialogTitle>
            <DialogDescription>
              {selectedPage ? 'Update page details' : 'Create a new page for your website'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      title: e.target.value,
                      slug: !selectedPage ? generateSlug(e.target.value) : formData.slug 
                    });
                  }}
                  placeholder="Page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="page-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Page content..."
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published' | 'archived') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">SEO Settings</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="SEO title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="SEO description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrUpdate}>
              <Save className="mr-2 h-4 w-4" />
              {selectedPage ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
