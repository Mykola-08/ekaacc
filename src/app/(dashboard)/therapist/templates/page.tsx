'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React, { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  File01Icon,
  Search01Icon,
  FilterIcon,
  Download01Icon,
  Copy01Icon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  MoreVerticalIcon,
  Loading03Icon,
} from '@hugeicons/core-free-icons';
import {
  getSessionTemplates,
  createSessionTemplate,
  updateSessionTemplate,
  deleteSessionTemplate,
} from '@/app/actions/templates-actions';

type Template = {
  id: string;
  name: string;
  content: Record<string, any>;
  type: string | null;
  created_at: string;
};

const TEMPLATE_TYPES = [
  { value: 'note', label: 'Session Note' },
  { value: 'progress', label: 'Progress Note' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'treatment-plan', label: 'Treatment Plan' },
  { value: 'discharge', label: 'Discharge Summary' },
];

const TYPE_BADGE: Record<string, string> = {
  note: 'bg-primary/10 text-primary',
  progress: 'bg-success/10 text-success',
  assessment: 'bg-warning/10 text-warning-foreground',
  'treatment-plan': 'bg-secondary text-secondary-foreground',
  discharge: 'bg-destructive/10 text-destructive',
};

function getTemplateBody(content: Record<string, any>): string {
  if (typeof content === 'string') return content;
  if (content.body) return String(content.body);
  if (content.text) return String(content.text);
  return JSON.stringify(content, null, 2);
}

export default function TherapistTemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Create / Edit dialog
  const [editTarget, setEditTarget] = useState<Template | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('note');
  const [formBody, setFormBody] = useState('');
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Preview dialog
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await getSessionTemplates();
      setTemplates((res.data as Template[]) ?? []);
      setIsLoading(false);
    })();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setFormName('');
    setFormType('note');
    setFormBody('');
    setFormError(null);
    setShowCreateDialog(true);
  };

  const openEdit = (t: Template) => {
    setEditTarget(t);
    setFormName(t.name);
    setFormType(t.type ?? 'note');
    setFormBody(getTemplateBody(t.content));
    setFormError(null);
    setShowCreateDialog(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) { setFormError('Template name is required.'); return; }
    if (!formBody.trim()) { setFormError('Template content is required.'); return; }
    setFormSaving(true);
    setFormError(null);
    const content = { body: formBody.trim() };
    if (editTarget) {
      const res = await updateSessionTemplate(editTarget.id, { name: formName.trim(), content, type: formType });
      setFormSaving(false);
      if (!res.success) { setFormError(res.error ?? 'Failed to update'); return; }
      setTemplates((prev) =>
        prev.map((t) => t.id === editTarget.id ? { ...t, name: formName.trim(), content, type: formType } : t)
      );
      toast({ title: 'Template updated' });
    } else {
      const res = await createSessionTemplate({ name: formName.trim(), content, type: formType });
      setFormSaving(false);
      if (!res.success) { setFormError(res.error ?? 'Failed to create'); return; }
      setTemplates((prev) => [res.data as Template, ...prev]);
      toast({ title: 'Template created' });
    }
    setShowCreateDialog(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteSessionTemplate(id);
    if (!res.success) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
      return;
    }
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast({ title: 'Template deleted' });
  };

  const handleCopy = (t: Template) => {
    navigator.clipboard.writeText(getTemplateBody(t.content));
    toast({ title: 'Copied to clipboard' });
  };

  const handleDownload = (t: Template) => {
    const blob = new Blob([getTemplateBody(t.content)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [templates, searchQuery, typeFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-[var(--radius)]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Skeleton className="h-8 w-8 rounded-[var(--radius)]" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-full rounded-[var(--radius)]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Session Templates</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Reusable note templates to speed up documentation.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-[calc(var(--radius)*0.8)]">
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
          New Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 px-4 lg:px-6">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates…"
            className="pl-9 rounded-[var(--radius)] h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-10 rounded-[var(--radius)]">
            <HugeiconsIcon icon={FilterIcon} className="mr-1.5 size-4 text-muted-foreground" />
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TEMPLATE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {filtered.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed py-16 text-center lg:mx-6">
          <div className="rounded-[var(--radius)] bg-muted p-4">
            <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold">No templates yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery || typeFilter !== 'all' ? 'No templates match your filters.' : 'Create your first template to get started.'}
            </p>
          </div>
          {!searchQuery && typeFilter === 'all' && (
            <Button onClick={openCreate} className="rounded-[calc(var(--radius)*0.8)] gap-2">
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              Create Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id} className="group rounded-[var(--radius)] transition-all hover:-translate-y-px">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0 rounded-[var(--radius)] bg-muted p-2">
                      <HugeiconsIcon icon={File01Icon} className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold">{t.name}</h4>
                      {t.type && (
                        <span className={cn('mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium', TYPE_BADGE[t.type] ?? 'bg-muted text-muted-foreground')}>
                          {TEMPLATE_TYPES.find((x) => x.value === t.type)?.label ?? t.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7 shrink-0 rounded-[calc(var(--radius)*0.8)] opacity-0 group-hover:opacity-100 transition-opacity">
                          <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(t)}>
                          <HugeiconsIcon icon={PencilEdit01Icon} className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopy(t)}>
                          <HugeiconsIcon icon={Copy01Icon} className="mr-2 size-4" /> Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(t)}>
                          <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" /> Download
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete template?</AlertDialogTitle>
                        <AlertDialogDescription>
                          &ldquo;{t.name}&rdquo; will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleDelete(t.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="line-clamp-3 text-xs text-muted-foreground leading-relaxed">
                  {getTemplateBody(t.content)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full rounded-[var(--radius)] gap-2"
                  onClick={() => setPreviewTemplate(t)}
                >
                  <HugeiconsIcon icon={File01Icon} className="size-3.5" />
                  Preview & Use
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="rounded-[var(--radius)] max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Template' : 'New Template'}</DialogTitle>
            <DialogDescription>
              {editTarget ? 'Update your template content.' : 'Create a reusable session note template.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Template Name <span className="text-destructive">*</span></Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. CBT Session Note"
                className="h-10 rounded-[var(--radius)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="h-10 rounded-[var(--radius)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Content <span className="text-destructive">*</span></Label>
              <Textarea
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Write your template content here. Use {{field_name}} for dynamic fields."
                className="min-h-40 resize-none rounded-[var(--radius)] font-mono text-xs"
              />
            </div>
            {formError && (
              <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-[calc(var(--radius)*0.8)]" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={formSaving} className="gap-2 rounded-[calc(var(--radius)*0.8)]">
              {formSaving && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
              {formSaving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => { if (!open) setPreviewTemplate(null); }}>
        <DialogContent className="rounded-[var(--radius)] max-w-xl">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-80 rounded-[var(--radius)] border bg-muted/30 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{previewTemplate ? getTemplateBody(previewTemplate.content) : ''}</p>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" className="rounded-[calc(var(--radius)*0.8)]" onClick={() => setPreviewTemplate(null)}>Close</Button>
            <Button
              variant="outline"
              className="gap-2 rounded-[calc(var(--radius)*0.8)]"
              onClick={() => previewTemplate && handleCopy(previewTemplate)}
            >
              <HugeiconsIcon icon={Copy01Icon} className="size-4" /> Copy
            </Button>
            <Button
              className="gap-2 rounded-[calc(var(--radius)*0.8)]"
              onClick={() => previewTemplate && handleDownload(previewTemplate)}
            >
              <HugeiconsIcon icon={Download01Icon} className="size-4" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
