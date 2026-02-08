'use client';

import { useEffect, useState, use } from 'react';
import { academyService } from '@/lib/platform/services/academy-service';
import { Course, Module } from '@/lib/platform/types/academy';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/platform/ui/accordion';
import { Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, modulesData] = await Promise.all([
          academyService.getCourseById(courseId),
          academyService.getCourseModules(courseId),
        ]);
        setCourse(courseData);
        setModules(modulesData);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleAddModule = async () => {
    if (!course) return;
    try {
      const newModule = await academyService.createModule({
        course_id: course.id,
        title: 'New Module',
        description: '',
        order_index: modules.length,
        is_published: true,
      } as any);
      setModules([...modules, newModule]);
    } catch (error) {
      console.error('Failed to create module:', error);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    try {
      const newLesson = await academyService.createLesson({
        module_id: moduleId,
        title: 'New Lesson',
        content_type: 'article',
        content: { article_text: '' },
        order_index: 999,
        is_published: false,
      } as any);
      // Refresh modules to see new lesson
      const updatedModules = await academyService.getCourseModules(courseId);
      setModules(updatedModules);
    } catch (error) {
      console.error('Failed to create lesson:', error);
    }
  };

  const handleUpdateModule = async (moduleId: string, title: string) => {
    try {
      await academyService.updateModule(moduleId, { title });
      // Update local state
      setModules(modules.map((m) => (m.id === moduleId ? { ...m, title } : m)));
    } catch (error) {
      console.error('Failed to update module:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Course: {course.title}</h1>
        <Link href={`/academy/catalog/${course.id}`} target="_blank">
          <Button variant="outline">Preview Course</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <span>{module.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {module.lessons?.length || 0} lessons
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="flex gap-2">
                      <Input
                        defaultValue={module.title}
                        onBlur={(e) => handleUpdateModule(module.id, e.target.value)}
                      />
                      <Button size="sm" variant="ghost" disabled>
                        Saved on blur
                      </Button>
                    </div>

                    <div className="space-y-2 border-l-2 pl-4">
                      {module.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="bg-muted/50 flex items-center justify-between rounded border p-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{lesson.title}</span>
                            <span className="text-muted-foreground text-xs uppercase">
                              ({lesson.content_type})
                            </span>
                          </div>
                          <Link href={`/educator/lessons/${lesson.id}/edit`}>
                            <Button size="sm" variant="ghost">
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddLesson(module.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lesson
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button onClick={handleAddModule} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
