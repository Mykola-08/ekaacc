'use client';

import { useEffect, useState } from 'react';
import { academyService } from '@/lib/platform/services/academy-service';
import { Course } from '@/lib/platform/types/academy';
import { useAuth } from '@/context/platform/auth-context';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { PlusCircle, Edit, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function EducatorDashboard() {
 const { user } = useAuth();
 const [courses, setCourses] = useState<Course[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchCourses = async () => {
   if (user) {
    try {
     const data = await academyService.getInstructorCourses(user.id);
     setCourses(data);
    } catch (error) {
     console.error('Failed to fetch courses:', error);
    } finally {
     setLoading(false);
    }
   }
  };

  fetchCourses();
 }, [user]);

 if (loading) return <div>Loading courses...</div>;

 return (
  <div className="space-y-6">
   <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">My Courses</h2>
    <Link href="/educator/courses/new">
     <Button>
      <PlusCircle className="w-4 h-4 mr-2" />
      Create New Course
     </Button>
    </Link>
   </div>

   {courses.length === 0 ? (
    <div className="text-center py-12 border-none rounded-2xl bg-muted/10">
     <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
     <h3 className="text-lg font-medium">No courses yet</h3>
     <p className="text-muted-foreground mb-4">Start sharing your knowledge by creating your first course.</p>
     <Link href="/educator/courses/new">
      <Button variant="outline">Create Course</Button>
     </Link>
    </div>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {courses.map((course) => (
      <Card key={course.id}>
       <CardHeader>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
       </CardHeader>
       <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
         {course.description}
        </p>
        <div className="flex justify-between items-center">
         <span className={`text-xs px-2 py-1 rounded-full ${
          course.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
         }`}>
          {course.is_published ? 'Published' : 'Draft'}
         </span>
         <Link href={`/educator/courses/${course.id}/edit`}>
          <Button variant="ghost" size="sm">
           <Edit className="w-4 h-4 mr-2" />
           Edit
          </Button>
         </Link>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   )}
  </div>
 );
}

