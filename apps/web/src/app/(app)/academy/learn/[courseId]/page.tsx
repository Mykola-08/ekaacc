'use client';

import { useEffect, useState, use } from 'react';
import { academyService } from '@/services/academy-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'lucide-react';

export default function CourseWelcomePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [loading, setLoading] = useState(true);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchFirstLesson = async () => {
      try {
        const modules = await academyService.getCourseModules(courseId);
        if (modules.length > 0 && modules[0].lessons && modules[0].lessons.length > 0) {
          setFirstLessonId(modules[0].lessons[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch course modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstLesson();
  }, [courseId]);

  const handleStart = () => {
    if (firstLessonId) {
      router.push(`/academy/learn/${courseId}/${firstLessonId}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to the Course</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Ready to start learning? Click the button below to begin your first lesson.
        </p>
      </div>
      
      <Button size="lg" onClick={handleStart} disabled={!firstLessonId} className="gap-2">
        <PlayCircle className="w-5 h-5" />
        Start Learning
      </Button>
    </div>
  );
}
