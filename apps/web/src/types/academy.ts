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

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_published: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'article' | 'quiz' | 'assignment' | 'exercise';
  content: any; // JSONB
  duration_minutes?: number;
  order_index: number;
  is_required: boolean;
  is_published: boolean;
}

export interface LessonProgress {
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  time_spent_seconds: number;
  quiz_score?: number;
  last_accessed_at: string;
}
