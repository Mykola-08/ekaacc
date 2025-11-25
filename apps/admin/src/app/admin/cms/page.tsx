'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, Image, PenLine, LayoutDashboard, ArrowRight } from 'lucide-react';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

const cmsModules = [
  {
    title: 'Pages',
    description: 'Manage website pages and landing content',
    icon: FileText,
    href: '/admin/cms/pages',
    count: 0,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Posts',
    description: 'Create and manage blog posts and articles',
    icon: PenLine,
    href: '/admin/cms/posts',
    count: 0,
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'Media',
    description: 'Upload and organize images and files',
    icon: Image,
    href: '/admin/cms/media',
    count: 0,
    color: 'bg-purple-500/10 text-purple-600',
  },
];

export default function CMSPage() {
  return (
    <SettingsShell>
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <SettingsHeader
          title="Content Management"
          description="Manage pages, posts, and media content for your application."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {cmsModules.map((module) => (
          <Card key={module.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${module.color}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                {module.count > 0 && (
                  <Badge variant="secondary">{module.count} items</Badge>
                )}
              </div>
              <CardTitle className="mt-4">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={module.href}>
                <Button variant="outline" className="w-full">
                  Manage {module.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common content management tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/cms/pages?action=new">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              New Page
            </Button>
          </Link>
          <Link href="/admin/cms/posts?action=new">
            <Button variant="outline" size="sm">
              <PenLine className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
          <Link href="/admin/cms/media?action=upload">
            <Button variant="outline" size="sm">
              <Image className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </Link>
        </CardContent>
      </Card>
    </SettingsShell>
  );
}
