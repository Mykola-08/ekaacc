"use client";

import { Card } from '@/components/ui/card';
import React from 'react';
;

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border rounded-xl animate-pulse"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-muted/50"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/50 rounded w-1/3"></div>
              <div className="h-3 bg-muted/30 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 bg-muted/50 rounded"></div>
            <div className="h-8 w-24 bg-muted/30 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted/50 rounded-lg w-12 h-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted/50 rounded w-1/2"></div>
              <div className="h-6 bg-muted/30 rounded w-1/3"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-6 border border-border/50 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-8 bg-muted/50 rounded w-1/3"></div>
          <div className="h-4 bg-muted/30 rounded w-1/2"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-muted/50 rounded"></div>
          <div className="h-10 w-32 bg-muted/30 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card className="shadow-lg border-border/50 animate-pulse">
      <div className="p-6 space-y-4">
        <div className="h-6 bg-muted/50 rounded w-1/4"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/50 rounded w-1/3"></div>
                <div className="h-3 bg-muted/30 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-24 bg-muted/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function UserListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted/50"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded w-32"></div>
                <div className="h-3 bg-muted/30 rounded w-48"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-muted/50 rounded"></div>
              <div className="h-8 w-20 bg-muted/30 rounded"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
