'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { Enrollment } from '@/types/academy';

interface AcademyQuickAccessProps {
  enrollments: Enrollment[];
  userId: string;
}

export function AcademyQuickAccess({ enrollments, userId }: AcademyQuickAccessProps) {
  const inProgressCourses = enrollments.filter(e => e.status === 'active');
  const completedCourses = enrollments.filter(e => e.status === 'completed');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Statistics */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">{inProgressCourses.length}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{completedCourses.length}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
            <p className="text-2xl font-bold">
              {Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length || 0)}%
            </p>
          </div>
        </div>
      </Card>
      
      {/* Active Courses */}
      <Card className="md:col-span-3 p-4">
        <h3 className="font-semibold mb-4">Continue Learning</h3>
        {inProgressCourses.length > 0 ? (
          <div className="space-y-4">
            {inProgressCourses.slice(0, 3).map(enrollment => (
              <div key={enrollment.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{enrollment.course.title}</p>
                  <Progress value={enrollment.progress_percentage} className="mt-2" />
                </div>
                <Button asChild variant="outline" size="sm" className="ml-4">
                  <Link href={`/academy/learn/${enrollment.id}`}>
                    Continue
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No courses in progress</p>
            <Button asChild>
              <Link href="/academy">Browse Courses</Link>
            </Button>
          </div>
        )}
      </Card>
      
      {/* Quick Actions */}
      <Card className="md:col-span-3 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="space-x-2">
            <Button asChild variant="outline">
              <Link href="/academy">Browse Courses</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/academy/my-courses">My Courses</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/academy/certificates">My Certificates</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
