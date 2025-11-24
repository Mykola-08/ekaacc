import { createClient } from '@/lib/supabase/client';
import { Course, Enrollment, Module, Lesson, LessonProgress } from '@/types/academy';

export const academyService = {
  async getCourses() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Course[];
  },

  async getCourseById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_courses')
      .select(`
        *,
        instructor:instructor_id (
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getEnrolledCourses(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_enrollments')
      .select(`
        *,
        course:course_id (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data as Enrollment[];
  },

  async enrollInCourse(userId: string, courseId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();

    if (error) throw error;
    return data as Enrollment;
  },

  async getCourseModules(courseId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_course_modules')
      .select(`
        *,
        lessons:academy_lessons (*)
      `)
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    
    // Sort lessons within modules
    if (data) {
      data.forEach((module: any) => {
        if (module.lessons) {
          module.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
        }
      });
    }

    return data as Module[];
  },

  async getLesson(lessonId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) throw error;
    return data as Lesson;
  },

  async getLessonProgress(userId: string, lessonId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    return data as LessonProgress | null;
  },

  async updateLessonProgress(userId: string, lessonId: string, updates: Partial<LessonProgress>) {
    const supabase = createClient();
    
    // Upsert progress
    const { data, error } = await supabase
      .from('academy_lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        last_accessed_at: new Date().toISOString(),
        ...updates
      }, { onConflict: 'user_id,lesson_id' })
      .select()
      .single();

    if (error) throw error;
    return data as LessonProgress;
  },

  // CMS Methods
  async getInstructorCourses(instructorId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_courses')
      .select('*')
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Course[];
  },

  async createCourse(course: Partial<Course>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_courses')
      .insert(course)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  },

  async updateCourse(id: string, updates: Partial<Course>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  },

  async createModule(module: Partial<Module>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_course_modules')
      .insert(module)
      .select()
      .single();

    if (error) throw error;
    return data as Module;
  },

  async updateModule(id: string, updates: Partial<Module>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_course_modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Module;
  },

  async createLesson(lesson: Partial<Lesson>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_lessons')
      .insert(lesson)
      .select()
      .single();

    if (error) throw error;
    return data as Lesson;
  },

  async updateLesson(id: string, updates: Partial<Lesson>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Lesson;
  },
  
  async deleteLesson(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('academy_lessons')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async deleteModule(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('academy_course_modules')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async getUserCertificates(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_certificates')
      .select(`
        *,
        course:course_id (
          title,
          instructor:instructor_id (full_name)
        )
      `)
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getCertificate(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('academy_certificates')
      .select(`
        *,
        course:course_id (
          title,
          description,
          instructor:instructor_id (full_name)
        ),
        user:user_id (
          email,
          raw_user_meta_data
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};
