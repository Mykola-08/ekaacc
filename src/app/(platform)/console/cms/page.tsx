'use client';

import { FileText, Edit, Layout, Image as ImageIcon } from 'lucide-react';

export default function CMSPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-bold tracking-tight">
            Content
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage website content and pages.</p>
        </div>

        <button className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-border transition-all hover:scale-105 hover:bg-foreground/90 active:scale-95">
          Create Entry
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-card hover:bg-muted/30/50 group flex cursor-pointer flex-col items-center justify-center rounded-[20px] p-8 py-12 text-center shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 transition-colors">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[12px] bg-purple-50 transition-transform group-hover:scale-110">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-bold">Pages</h3>
          <p className="text-muted-foreground max-w-50 text-sm">
            Edit site pages, SEO metadata, and structural content.
          </p>
        </div>

        <div className="bg-card hover:bg-muted/30/50 group flex cursor-pointer flex-col items-center justify-center rounded-[20px] p-8 py-12 text-center shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 transition-colors">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[12px] bg-pink-50 transition-transform group-hover:scale-110">
            <Edit className="h-8 w-8 text-pink-600" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-bold">Blog Posts</h3>
          <p className="text-muted-foreground max-w-[200px] text-sm">
            Manage articles, categories, and author profiles.
          </p>
        </div>

        <div className="bg-card hover:bg-muted/30/50 group flex cursor-pointer flex-col items-center justify-center rounded-[20px] p-8 py-12 text-center shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 transition-colors">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[12px] bg-orange-50 transition-transform group-hover:scale-110">
            <ImageIcon className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-bold">Media Library</h3>
          <p className="text-muted-foreground max-w-[200px] text-sm">
            Upload and organize images, documents, and videos.
          </p>
        </div>
      </div>
    </div>
  );
}
