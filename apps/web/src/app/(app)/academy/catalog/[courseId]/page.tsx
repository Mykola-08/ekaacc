'use client';

import { useEffect, useState, use } from 'react';
import { academyService } from '@/services/academy-service';
import { Course, Module } from '@/types/academy';
import { PageContainer } from '@/components/eka/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/context/auth-context'; // Assuming this exists
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, PlayCircle, FileText, HelpCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth(); // Need to verify if this hook exists and returns user object
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, modulesData] = await Promise.all([
          academyService.getCourseById(courseId),
          academyService.getCourseModules(courseId)
        ]);
        setCourse(courseData);
        setModules(modulesData);

        if (user) {
          const enrolledCourses = await academyService.getEnrolledCourses(user.id);
          const enrolled = enrolledCourses.some(e => e.course_id === courseId);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll');
      return;
    }

    setEnrolling(true);
    try {
      await academyService.enrollInCourse(user.id, courseId);
      toast.success('Successfully enrolled!');
      setIsEnrolled(true);
      router.push(`/academy/learn/${courseId}`);
    } catch (error) {
      console.error('Enrollment failed:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (!course) return <PageContainer>Course not found</PageContainer>;

  return (
    <PageContainer>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex gap-2 mb-4">
              <Badge>{course.category}</Badge>
              <Badge variant="outline">{course.difficulty}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-muted-foreground">{course.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {course.learning_objectives?.map((objective: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <Accordion type="single" collapsible className="w-full">
              {modules.map((module) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold">{module.title}</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        {module.lessons?.length || 0} lessons
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {module.lessons?.map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                          {lesson.content_type === 'video' ? <PlayCircle className="w-4 h-4" /> :
                           lesson.content_type === 'quiz' ? <HelpCircle className="w-4 h-4" /> :
                           <FileText className="w-4 h-4" />}
                          <span className="flex-grow">{lesson.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration_minutes} min
                          </span>
                          {!isEnrolled && <Lock className="w-3 h-3 text-muted-foreground" />}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{course.estimated_hours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lessons</span>
                  <span className="font-medium">
                    {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium capitalize">{course.difficulty}</span>
                </div>
              </div>

              {isEnrolled ? (
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/academy/learn/${course.id}`}>Continue Learning</Link>
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
