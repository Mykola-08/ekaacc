import { supabase } from '@/lib/supabase';

export interface AcademyStatistics {
  total_courses: number;
  total_enrollments: number;
  completed_enrollments: number;
  avg_progress: number;
  total_reviews: number;
  avg_rating: number;
  certificates_issued: number;
}

export async function getAcademyStatistics(): Promise<AcademyStatistics> {
  const { data, error } = await supabase
    .from('academy_course_statistics')
    .select('*');

  if (error) {
    console.error('Error fetching academy statistics:', error);
    return {
      total_courses: 0,
      total_enrollments: 0,
      completed_enrollments: 0,
      avg_progress: 0,
      total_reviews: 0,
      avg_rating: 0,
      certificates_issued: 0,
    };
  }

  // Aggregate the data from the view (which is per course)
  const stats = data.reduce(
    (acc, curr) => ({
      total_courses: acc.total_courses + 1,
      total_enrollments: acc.total_enrollments + (curr.total_enrollments || 0),
      completed_enrollments: acc.completed_enrollments + (curr.completed_enrollments || 0),
      avg_progress: acc.avg_progress + (curr.avg_progress || 0),
      total_reviews: acc.total_reviews + (curr.total_reviews || 0),
      avg_rating: acc.avg_rating + (curr.avg_rating || 0),
      certificates_issued: acc.certificates_issued + (curr.certificates_issued || 0),
    }),
    {
      total_courses: 0,
      total_enrollments: 0,
      completed_enrollments: 0,
      avg_progress: 0,
      total_reviews: 0,
      avg_rating: 0,
      certificates_issued: 0,
    }
  );

  // Average the averages
  if (stats.total_courses > 0) {
    stats.avg_progress = Math.round(stats.avg_progress / stats.total_courses);
    stats.avg_rating = Number((stats.avg_rating / stats.total_courses).toFixed(2));
  }

  return stats;
}
