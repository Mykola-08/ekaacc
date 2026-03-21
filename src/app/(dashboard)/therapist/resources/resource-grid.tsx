'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlayCircleIcon,
  File01Icon,
  Activity01Icon,
  Layers01Icon,
  Share01Icon,
  Bookmark01Icon,
} from '@hugeicons/core-free-icons';
import { useToast } from '@/hooks/platform/ui/use-toast';

function getIcon(category: string) {
  switch (category) {
    case 'video':
      return PlayCircleIcon;
    case 'meditation':
      return Activity01Icon;
    case 'protocol':
    case 'kinesiology':
      return Layers01Icon;
    default:
      return File01Icon;
  }
}

function ResourceCard({ resource }: { resource: any }) {
  const { toast } = useToast();
  const Icon = getIcon(resource.category);

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden">
      {resource.imageUrl && (
        <div className="bg-muted h-48 w-full overflow-hidden">
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <Badge variant={resource.isPremium ? 'default' : 'secondary'} className="capitalize">
            <HugeiconsIcon icon={Icon} className="size-3.5" />
            <span className="ml-1.5">{resource.category}</span>
          </Badge>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground size-8"
              title="Bookmark"
              onClick={() =>
                toast({
                  title: 'Bookmarked',
                  description: `"${resource.title}" saved to your bookmarks.`,
                })
              }
            >
              <HugeiconsIcon icon={Bookmark01Icon} className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground size-8"
              title="Share with client"
              onClick={() =>
                toast({
                  title: 'Share link copied',
                  description: 'Resource link copied to clipboard.',
                })
              }
            >
              <HugeiconsIcon icon={Share01Icon} className="size-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-base leading-snug">{resource.title}</CardTitle>
        <CardDescription className="mt-1 line-clamp-2 text-sm">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-1 flex-col justify-end pt-0">
        <Link
          href={`/therapist/resources/${resource.id}`}
          className="text-primary inline-flex items-center text-sm font-medium hover:underline"
        >
          Open Resource &rarr;
        </Link>
      </CardContent>
    </Card>
  );
}

export function ResourceGrid({ resources }: { resources: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
