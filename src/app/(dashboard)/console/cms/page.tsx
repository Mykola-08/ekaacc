'use client';

import { useState, useEffect, useTransition } from 'react';
import { FileText, Plus, Pencil, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCmsPages, createCmsPage, updateCmsPage, deleteCmsPage } from './actions';

interface CmsTranslation {
  id: string;
  language_code: string;
  title: string;
  content: string;
}

interface CmsPage {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  cms_page_translations: CmsTranslation[];
}

export default function CMSPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadPages = async () => {
    const data = await getCmsPages();
    setPages(data as CmsPage[]);
    setLoading(false);
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      await createCmsPage(formData);
      setDialogOpen(false);
      await loadPages();
    });
  };

  const handleUpdate = async (formData: FormData) => {
    startTransition(async () => {
      await updateCmsPage(formData);
      setDialogOpen(false);
      setEditingPage(null);
      await loadPages();
    });
  };

  const handleDelete = async (pageId: string) => {
    startTransition(async () => {
      await deleteCmsPage(pageId);
      await loadPages();
    });
  };

  const openEdit = (page: CmsPage) => {
    setEditingPage(page);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingPage(null);
    setDialogOpen(true);
  };

  const translation = (page: CmsPage) => page.cms_page_translations?.[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-semibold tracking-tight">
            Content
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage website content and pages.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingPage(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" /> Create Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit Page' : 'Create Page'}</DialogTitle>
            </DialogHeader>
            <form action={editingPage ? handleUpdate : handleCreate} className="grid gap-4">
              {editingPage && (
                <>
                  <input type="hidden" name="pageId" value={editingPage.id} />
                  <input type="hidden" name="translationId" value={translation(editingPage)?.id || ''} />
                </>
              )}
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="about-us" defaultValue={editingPage?.slug || ''} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="About Us" defaultValue={translation(editingPage!)?.title || ''} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" rows={8} placeholder="Page content (Markdown supported)" defaultValue={translation(editingPage!)?.content || ''} />
              </div>
              {!editingPage && <input type="hidden" name="language" value="en" />}
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : editingPage ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-20 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="border-border bg-muted/30 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
          <div className="bg-card mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <FileText className="text-muted-foreground/50 h-8 w-8" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">No pages yet</h3>
          <p className="text-muted-foreground mt-1 mb-4 text-sm">Create your first content page.</p>
          <Button onClick={openCreate} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Create Page
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {pages.map((page) => {
            const t = translation(page);
            return (
              <Card key={page.id} className="group hover:border-primary/30 transition-colors">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <FileText className="text-primary h-5 w-5 shrink-0" />
                      <span className="text-foreground truncate font-semibold">{t?.title || page.slug}</span>
                      <Badge variant="outline" className="shrink-0 gap-1 text-xs">
                        <Globe className="h-3 w-3" />
                        {page.cms_page_translations?.length || 0} lang
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-1 ml-8 text-xs">
                      /{page.slug} • Updated {new Date(page.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(page)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-8 w-8"
                      onClick={() => handleDelete(page.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
