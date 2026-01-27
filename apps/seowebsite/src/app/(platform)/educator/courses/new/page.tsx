'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/platform/auth-context';
import { academyService } from '@/lib/platform/services/academy-service';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { Textarea } from '@/components/platform/ui/textarea';
import { Label } from '@/components/platform/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/platform/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';

export default function CreateCoursePage() {
 const { user } = useAuth();
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
  title: '',
  description: '',
  category: '',
  difficulty: 'beginner',
  estimated_hours: 0,
 });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setLoading(true);
  try {
   const newCourse = await academyService.createCourse({
    ...formData,
    instructor_id: user.id,
    is_published: false,
    difficulty: formData.difficulty as 'beginner' | 'intermediate' | 'advanced',
   } as any);
   router.push(`/educator/courses/${newCourse.id}/edit`);
  } catch (error) {
   console.error('Failed to create course:', error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="max-w-2xl mx-auto">
   <Card>
    <CardHeader>
     <CardTitle>Create New Course</CardTitle>
    </CardHeader>
    <CardContent>
     <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
       <Label htmlFor="title">Course Title</Label>
       <Input
        id="title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="e.g. Introduction to CBT"
       />
      </div>

      <div className="space-y-2">
       <Label htmlFor="description">Description</Label>
       <Textarea
        id="description"
        required
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="What will students learn?"
        rows={4}
       />
      </div>

      <div className="grid grid-cols-2 gap-4">
       <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
         id="category"
         value={formData.category}
         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
         placeholder="e.g. Psychology"
        />
       </div>

       <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
         value={formData.difficulty}
         onValueChange={(val) => setFormData({ ...formData, difficulty: val })}
        >
         <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
         </SelectTrigger>
         <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
         </SelectContent>
        </Select>
       </div>
      </div>

      <div className="space-y-2">
       <Label htmlFor="hours">Estimated Hours</Label>
       <Input
        id="hours"
        type="number"
        min="0"
        value={formData.estimated_hours}
        onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
       />
      </div>

      <div className="flex justify-end gap-4">
       <Button type="button" variant="ghost" onClick={() => router.back()}>
        Cancel
       </Button>
       <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Course'}
       </Button>
      </div>
     </form>
    </CardContent>
   </Card>
  </div>
 );
}
