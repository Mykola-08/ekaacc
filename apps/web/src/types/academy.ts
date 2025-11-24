export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  instructor_id: string;
  thumbnail_url?: string;
  is_published: boolean;
  tags: string[];
  learning_objectives: string[];
  prerequisites: string[];
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  course: Course;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  last_accessed_at: string;
  status: 'active' | 'completed' | 'dropped';
}

export interface AcademyStatistics {
  total_courses: number;
  total_enrollments: number;
  active_students: number;
  completion_rate: number;
  avg_rating: number;
  certificates_issued: number;
}
