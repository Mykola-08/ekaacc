import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

// Card skeleton for appointments, services, etc.
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border dark:border-gray-700">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="divide-y divide-border dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-6 flex items-center space-x-6">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className={`h-4 ${colIndex === 0 ? 'w-32' : colIndex === columns - 1 ? 'w-20' : 'w-24'}`} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Stats skeleton for dashboard
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="w-12 h-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center space-x-6 mb-8">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// List skeleton for notifications, reviews, etc.
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start space-x-4 p-4 bg-muted/30 dark:bg-gray-700 rounded-xl">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Calendar skeleton
export function CalendarSkeleton() {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex space-x-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
      <Skeleton className="h-8 w-48 mb-8" />
      
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
        
        <div className="flex justify-end space-x-4 pt-6">
          <Skeleton className="h-12 w-24 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Text skeleton for loading content
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

export default Skeleton;

