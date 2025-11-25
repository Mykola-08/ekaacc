'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Image,
  Folder,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { format } from 'date-fns';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  author?: string;
}

interface CMSPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  status: 'draft' | 'published';
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

interface CMSMedia {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt?: string;
  createdAt: string;
}

interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export default function CMSManagementPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pages');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [posts, setPosts] = useState<CMSPost[]>([]);
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  
  // Dialog states
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Form states
  const [pageForm, setPageForm] = useState<{ title: string; slug: string; content: string; status: 'draft' | 'published' }>({ title: '', slug: '', content: '', status: 'draft' });
  const [postForm, setPostForm] = useState<{ title: string; slug: string; content: string; excerpt: string; category: string; status: 'draft' | 'published' }>({ title: '', slug: '', content: '', excerpt: '', category: '', status: 'draft' });
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' });

  // Load CMS data
  useEffect(() => {
    loadCMSData();
  }, []);

  const loadCMSData = async () => {
    setLoading(true);
    try {
      // Load pages
      const { data: pagesData } = await supabase
        .from('cms_pages')
        .select('*')
        .order('updated_at', { ascending: false });
      
      // Load posts
      const { data: postsData } = await supabase
        .from('cms_posts')
        .select('*')
        .order('updated_at', { ascending: false });
      
      // Load media
      const { data: mediaData } = await supabase
        .from('cms_media')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('cms_categories')
        .select('*')
        .order('name', { ascending: true });

      setPages(pagesData?.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        content: p.content || '',
        status: p.status || 'draft',
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        author: p.author
      })) || []);

      setPosts(postsData?.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        content: p.content || '',
        excerpt: p.excerpt,
        coverImage: p.cover_image,
        category: p.category,
        status: p.status || 'draft',
        publishedDate: p.published_date,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        author: p.author
      })) || []);

      setMedia(mediaData?.map(m => ({
        id: m.id,
        filename: m.filename,
        url: m.url,
        mimeType: m.mime_type,
        size: m.size,
        alt: m.alt,
        createdAt: m.created_at
      })) || []);

      setCategories(categoriesData?.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        postCount: 0 // Will be calculated
      })) || []);

    } catch (error) {
      console.error('Error loading CMS data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load CMS data. Using demo mode.',
        variant: 'destructive'
      });
      
      // Set demo data if database tables don't exist
      setPages([
        { id: '1', title: 'Home Page', slug: 'home', content: 'Welcome to EKA', status: 'published', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', title: 'About Us', slug: 'about', content: 'About EKA Account', status: 'published', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', title: 'Privacy Policy', slug: 'privacy', content: 'Privacy policy content', status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]);
      setPosts([
        { id: '1', title: 'Getting Started with EKA', slug: 'getting-started', content: 'Learn how to use EKA', category: 'Guides', status: 'published', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', title: 'New Features Update', slug: 'new-features', content: 'Check out our new features', category: 'News', status: 'published', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]);
      setCategories([
        { id: '1', name: 'Guides', slug: 'guides', description: 'How-to guides', postCount: 1 },
        { id: '2', name: 'News', slug: 'news', description: 'Latest news', postCount: 1 },
        { id: '3', name: 'Tips', slug: 'tips', description: 'Helpful tips', postCount: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async () => {
    try {
      const pageData = {
        title: pageForm.title,
        slug: pageForm.slug || pageForm.title.toLowerCase().replace(/\s+/g, '-'),
        content: pageForm.content,
        status: pageForm.status,
        author: user?.email,
        updated_at: new Date().toISOString()
      };

      if (selectedItem) {
        await supabase.from('cms_pages').update(pageData).eq('id', selectedItem.id);
        toast({ title: 'Success', description: 'Page updated successfully' });
      } else {
        await supabase.from('cms_pages').insert({ ...pageData, created_at: new Date().toISOString() });
        toast({ title: 'Success', description: 'Page created successfully' });
      }

      setShowPageDialog(false);
      setSelectedItem(null);
      setPageForm({ title: '', slug: '', content: '', status: 'draft' });
      loadCMSData();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({ title: 'Error', description: 'Failed to save page', variant: 'destructive' });
    }
  };

  const handleSavePost = async () => {
    try {
      const postData = {
        title: postForm.title,
        slug: postForm.slug || postForm.title.toLowerCase().replace(/\s+/g, '-'),
        content: postForm.content,
        excerpt: postForm.excerpt,
        category: postForm.category,
        status: postForm.status,
        author: user?.email,
        updated_at: new Date().toISOString(),
        published_date: postForm.status === 'published' ? new Date().toISOString() : null
      };

      if (selectedItem) {
        await supabase.from('cms_posts').update(postData).eq('id', selectedItem.id);
        toast({ title: 'Success', description: 'Post updated successfully' });
      } else {
        await supabase.from('cms_posts').insert({ ...postData, created_at: new Date().toISOString() });
        toast({ title: 'Success', description: 'Post created successfully' });
      }

      setShowPostDialog(false);
      setSelectedItem(null);
      setPostForm({ title: '', slug: '', content: '', excerpt: '', category: '', status: 'draft' });
      loadCMSData();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ title: 'Error', description: 'Failed to save post', variant: 'destructive' });
    }
  };

  const handleSaveCategory = async () => {
    try {
      const categoryData = {
        name: categoryForm.name,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryForm.description
      };

      if (selectedItem) {
        await supabase.from('cms_categories').update(categoryData).eq('id', selectedItem.id);
        toast({ title: 'Success', description: 'Category updated successfully' });
      } else {
        await supabase.from('cms_categories').insert(categoryData);
        toast({ title: 'Success', description: 'Category created successfully' });
      }

      setShowCategoryDialog(false);
      setSelectedItem(null);
      setCategoryForm({ name: '', slug: '', description: '' });
      loadCMSData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
    }
  };

  const handleDeleteItem = async (type: 'page' | 'post' | 'category', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const tableName = type === 'page' ? 'cms_pages' : type === 'post' ? 'cms_posts' : 'cms_categories';
      await supabase.from(tableName).delete().eq('id', id);
      toast({ title: 'Success', description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully` });
      loadCMSData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({ title: 'Error', description: `Failed to delete ${type}`, variant: 'destructive' });
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalPages: pages.length,
    publishedPages: pages.filter(p => p.status === 'published').length,
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    totalMedia: media.length,
    totalCategories: categories.length
  };

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Content Management System"
            description="Manage pages, posts, media, and categories for your website."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCMSData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild variant="outline">
            <a href="/api/payload/admin" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open PayloadCMS
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <div className="text-sm text-muted-foreground">Total Pages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.publishedPages}</div>
            <div className="text-sm text-muted-foreground">Published Pages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
            <div className="text-sm text-muted-foreground">Published Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalMedia}</div>
            <div className="text-sm text-muted-foreground">Media Files</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Pages Tab */}
        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pages</CardTitle>
              <Button onClick={() => { setSelectedItem(null); setPageForm({ title: '', slug: '', content: '', status: 'draft' }); setShowPageDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>/{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(page.updatedAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setSelectedItem(page); setPageForm({ title: page.title, slug: page.slug, content: page.content, status: page.status }); setShowPageDialog(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem('page', page.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Posts</CardTitle>
              <Button onClick={() => { setSelectedItem(null); setPostForm({ title: '', slug: '', content: '', excerpt: '', category: '', status: 'draft' }); setShowPostDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.category || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.publishedDate ? format(new Date(post.publishedDate), 'MMM d, yyyy') : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setSelectedItem(post); setPostForm({ title: post.title, slug: post.slug, content: post.content, excerpt: post.excerpt || '', category: post.category || '', status: post.status }); setShowPostDialog(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem('post', post.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Media Library</CardTitle>
              <Button asChild>
                <a href="/api/payload/admin/collections/media" target="_blank" rel="noopener noreferrer">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload via PayloadCMS
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              {media.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No media files yet</p>
                  <p className="text-sm">Upload files using PayloadCMS</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {media.map((file) => (
                    <Card key={file.id} className="overflow-hidden">
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        {file.mimeType.startsWith('image/') ? (
                          <img src={file.url} alt={file.alt || file.filename} className="object-cover w-full h-full" />
                        ) : (
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <CardContent className="p-2">
                        <p className="text-sm truncate">{file.filename}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Categories</CardTitle>
              <Button onClick={() => { setSelectedItem(null); setCategoryForm({ name: '', slug: '', description: '' }); setShowCategoryDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>/{category.slug}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>{category.postCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setSelectedItem(category); setCategoryForm({ name: category.name, slug: category.slug, description: category.description || '' }); setShowCategoryDialog(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem('category', category.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Page Dialog */}
      <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Page' : 'Create New Page'}</DialogTitle>
            <DialogDescription>Fill in the page details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={pageForm.title} onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })} placeholder="Page title" />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={pageForm.slug} onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })} placeholder="page-slug" />
              </div>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={pageForm.content} onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })} placeholder="Page content" rows={8} />
            </div>
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Button variant={pageForm.status === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setPageForm({ ...pageForm, status: 'draft' })}>Draft</Button>
              <Button variant={pageForm.status === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setPageForm({ ...pageForm, status: 'published' })}>Published</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPageDialog(false)}>Cancel</Button>
            <Button onClick={handleSavePage}>Save Page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>Fill in the post details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postTitle">Title</Label>
                <Input id="postTitle" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} placeholder="Post title" />
              </div>
              <div>
                <Label htmlFor="postSlug">Slug</Label>
                <Input id="postSlug" value={postForm.slug} onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })} placeholder="post-slug" />
              </div>
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })} placeholder="Brief summary" rows={2} />
            </div>
            <div>
              <Label htmlFor="postContent">Content</Label>
              <Textarea id="postContent" value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} placeholder="Post content" rows={8} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} placeholder="Category" />
            </div>
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Button variant={postForm.status === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setPostForm({ ...postForm, status: 'draft' })}>Draft</Button>
              <Button variant={postForm.status === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setPostForm({ ...postForm, status: 'published' })}>Published</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPostDialog(false)}>Cancel</Button>
            <Button onClick={handleSavePost}>Save Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>Fill in the category details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Name</Label>
              <Input id="categoryName" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="Category name" />
            </div>
            <div>
              <Label htmlFor="categorySlug">Slug</Label>
              <Input id="categorySlug" value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} placeholder="category-slug" />
            </div>
            <div>
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea id="categoryDescription" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="Category description" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
