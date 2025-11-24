'use client';

import { useEffect, useState } from 'react';
import { academyService } from '@/services/academy-service';
import { Course } from '@/types/academy';
import { PageContainer } from '@/components/eka/page-container';
import { PageHeader } from '@/components/eka/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Clock, BookOpen, BarChart } from 'lucide-react';

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await academyService.getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <PageContainer>Loading courses...</PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Course Catalog"
        description="Explore our library of mental health and wellness courses."
        badge="Academy"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline" className={
                  course.difficulty === 'beginner' ? 'bg-green-50 text-green-700 border-green-200' :
                  course.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }>
                  {course.difficulty}
                </Badge>
              </div>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.estimated_hours}h</span>
                </div>
                {/* Placeholder for lesson count if available in future */}
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Course</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/academy/catalog/${course.id}`}>View Course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
