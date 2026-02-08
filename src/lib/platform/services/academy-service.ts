import { Course, Module, Lesson, QuizQuestion } from '../types/academy';

// Academy Service - Learning Management
// TODO: Connect to actual database when academy feature is implemented

/*
export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  content_type: 'article' | 'video' | 'quiz';
  is_published: boolean;
  article_text: string;
  video_url: string;
  questions: unknown[];
}
*/

const notImplemented = () => {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[AcademyService] Feature not yet implemented');
  }
};

export const academyService = {
  getInstructorCourses: async (_userId: string): Promise<Course[]> => {
    notImplemented();
    return [];
  },
  createCourse: async (data: Partial<Course>): Promise<Course> => {
    notImplemented();
    return { id: crypto.randomUUID(), title: '', description: '', modules: [], ...data };
  },
  getCourseById: async (id: string): Promise<Course | null> => {
    notImplemented();
    return { id, title: '', description: '', modules: [] };
  },
  getCourseModules: async (_id: string): Promise<Module[]> => {
    notImplemented();
    return [];
  },
  createModule: async (data: Partial<Module>): Promise<Module> => {
    notImplemented();
    return { id: crypto.randomUUID(), title: '', order: 0, lessons: [], ...data };
  },
  createLesson: async (data: Partial<Lesson>): Promise<Lesson> => {
    notImplemented();
    return {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      content_type: 'article',
      is_published: false,
      article_text: '',
      video_url: '',
      questions: [],
      ...data,
    };
  },
  updateModule: async (id: string, data: Partial<Module>): Promise<Module> => {
    notImplemented();
    return { id, title: '', order: 0, lessons: [], ...data };
  },
  getLesson: async (id: string): Promise<Lesson | null> => {
    notImplemented();
    return {
      id,
      title: '',
      content: '',
      content_type: 'article',
      is_published: false,
      article_text: '',
      video_url: '',
      questions: [],
    };
  },
  updateLesson: async (id: string, data: Partial<Lesson>): Promise<Lesson> => {
    notImplemented();
    return {
      id,
      title: '',
      content: '',
      content_type: 'article',
      is_published: false,
      article_text: '',
      video_url: '',
      questions: [],
      ...data,
    };
  },
};
