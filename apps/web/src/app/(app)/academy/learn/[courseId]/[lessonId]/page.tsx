'use client';

import { useEffect, useState, use } from 'react';
import { academyService } from '@/services/academy-service';
import { Lesson, LessonProgress } from '@/types/academy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { QuizComponent } from '@/components/academy/quiz-component';

export default function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const [nextLessonId, setNextLessonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [lessonData, progressData, modulesData] = await Promise.all([
          academyService.getLesson(lessonId),
          academyService.getLessonProgress(user.id, lessonId),
          academyService.getCourseModules(courseId)
        ]);
        setLesson(lessonData);
        setProgress(progressData);

        // Calculate next lesson
        if (modulesData) {
          const allLessons = modulesData.flatMap(m => m.lessons || []);
          const currentIndex = allLessons.findIndex(l => l.id === lessonId);
          if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
            setNextLessonId(allLessons[currentIndex + 1].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, user, courseId]);

  const handleComplete = async () => {
    if (!user || !lesson) return;
    setCompleting(true);
    try {
      await academyService.updateLessonProgress(user.id, lessonId, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });
      
      // Refresh progress
      const newProgress = await academyService.getLessonProgress(user.id, lessonId);
      setProgress(newProgress);

      if (nextLessonId) {
        router.push(`/academy/learn/${courseId}/${nextLessonId}`);
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    if (passed) {
      await handleComplete();
    }
  };

  if (loading) return <div className="p-8">Loading lesson...</div>;
  if (!lesson) return <div className="p-8">Lesson not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          {progress?.status === 'completed' && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {lesson.content_type === 'video' && (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white overflow-hidden">
              {lesson.content?.video_url ? (
                 <iframe 
                 src={lesson.content.video_url.replace('watch?v=', 'embed/')} 
                 className="w-full h-full" 
                 allowFullScreen
                 title={lesson.title}
               />
              ) : (
                <div className="flex flex-col items-center">
                  <PlayCircle className="w-12 h-12 mb-2" />
                  <p>Video Content Placeholder</p>
                </div>
              )}
            </div>
          )}

          {lesson.content_type === 'article' && (
            <div className="prose max-w-none dark:prose-invert">
              {/* In a real app, use a Markdown renderer here */}
              <div className="whitespace-pre-wrap">{lesson.content?.article_text}</div>
            </div>
          )}

          {lesson.content_type === 'quiz' && lesson.content?.questions && (
            <QuizComponent 
              data={{
                questions: lesson.content.questions.map((q: any) => ({
                  id: q.id,
                  text: q.question,
                  options: q.options,
                  correctAnswer: q.correct_answer
                })),
                passingScore: 70
              }} 
              onComplete={handleQuizComplete} 
            />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="ghost" onClick={() => router.back()}>
          Previous Lesson
        </Button>
        
        {lesson.content_type !== 'quiz' && (
          <Button 
            size="lg" 
            onClick={handleComplete} 
            disabled={completing || progress?.status === 'completed'}
            className={progress?.status === 'completed' ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {progress?.status === 'completed' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                Mark as Complete
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
