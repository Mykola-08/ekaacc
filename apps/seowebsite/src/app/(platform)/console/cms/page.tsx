'use client';

import { FileText, Edit, Layout, Image as ImageIcon } from 'lucide-react';

export default function CMSPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Content
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage website content and pages.</p>
        </div>
        
        <button className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all hover:scale-105 active:scale-95">
            Create Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-4xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 transition-colors cursor-pointer group py-12">
            <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pages</h3>
            <p className="text-gray-500 text-sm max-w-50">
                Edit site pages, SEO metadata, and structural content.
            </p>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 transition-colors cursor-pointer group py-12">
            <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Edit className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Blog Posts</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">
                Manage articles, categories, and author profiles.
            </p>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 transition-colors cursor-pointer group py-12">
            <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Media Library</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">
                Upload and organize images, documents, and videos.
            </p>
        </div>
      </div>
    </div>
  );
}
