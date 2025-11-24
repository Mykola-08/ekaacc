'use client';

import { useEffect, useState, use } from 'react';
import { academyService } from '@/services/academy-service';
import { Module } from '@/types/academy';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronLeft, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LearnLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [course, modulesData] = await Promise.all([
          academyService.getCourseById(courseId),
          academyService.getCourseModules(courseId)
        ]);
        setCourseTitle(course.title);
        setModules(modulesData);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      }
    };

    fetchData();
  }, [courseId]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link 
          href="/academy/my-courses" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h2 className="font-semibold line-clamp-2">{courseTitle}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons?.map((lesson) => {
                  const isActive = pathname.includes(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/academy/learn/${courseId}/${lesson.id}`}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-md text-sm transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {/* TODO: Check actual completion status */}
                      <PlayCircle className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-1">{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 border-r bg-card">
        <SidebarContent />
      </div>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center p-4 border-b bg-card">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold truncate">{courseTitle}</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
