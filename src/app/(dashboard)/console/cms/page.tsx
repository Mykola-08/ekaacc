'use client';

import { FileText, Edit, Layout, Image as ImageIcon } from 'lucide-react';

export default function CMSPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-semibold tracking-tight">
            Content
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage website content and pages.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm shadow-border transition-all hover:scale-105 hover:bg-foreground/90 active:scale-95">
          Create Entry
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-card hover:bg-muted/30/50 group flex cursor-pointer flex-col items-center justify-center rounded-lg p-8 py-12 text-center shadow-sm ring-1 shadow-border/50 ring-border transition-colors">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-muted transition-transform group-hover:scale-110">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-semibold">Pages</h3>
          <p className="text-muted-foreground max-w-50 text-sm">
            Edit site pages, SEO metadata, and structural content.
          </p>
        </div>
        <div className="bg-card hover:bg-muted/30/50 group flex cursor-pointer flex-col items-center justify-center rounded-lg p-8 py-12 text-center shadow-sm ring-1 shadow-border/50 ring-border transition-colors">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 transition-transform group-hover:scale-110">
            <Edit className="h-8 w-8 text-accent-foreground" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-semibold">Blog Posts</h3>
          <p className="text-muted-foreground max-w-[200px] text-sm">
            Manage articles, categories, and author profiles.
          </p>
        </div>
        <div className="bg-card hover:bg-muted/30/50 group flex cursor-pointer flex-col items-center justify-center rounded-lg p-8 py-12 text-center shadow-sm ring-1 shadow-border/50 ring-border transition-colors">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-warning transition-transform group-hover:scale-110">
            <ImageIcon className="h-8 w-8 text-warning" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-semibold">Media Library</h3>
          <p className="text-muted-foreground max-w-[200px] text-sm">
            Upload and organize images, documents, and videos.
          </p>
        </div>
      </div>
    </div>
  );
}
