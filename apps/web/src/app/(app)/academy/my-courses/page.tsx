'use client';

import { useEffect, useState } from 'react';
import { academyService } from '@/services/academy-service';
import { Enrollment } from '@/types/academy';
import { PageContainer } from '@/components/eka/page-container';
import { PageHeader } from '@/components/eka/page-header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { PlayCircle, CheckCircle } from 'lucide-react';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;
      try {
        const data = await academyService.getEnrolledCourses(user.id);
        setEnrollments(data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  if (loading) return <PageContainer>Loading courses...</PageContainer>;

  return (
    <PageContainer>
      <PageHeader
        title="My Learning"
        description="Track your progress and continue your courses."
        badge="Academy"
      />

      {enrollments.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6">Start your learning journey today.</p>
          <Button asChild>
            <Link href="/academy/catalog">Browse Catalog</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{enrollment.course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{enrollment.progress_percentage}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {enrollment.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4" /> In Progress
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/academy/learn/${enrollment.course_id}`}>
                    {enrollment.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
