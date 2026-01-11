export const academyService = {
  getInstructorCourses: async (userId: string) => [],
  createCourse: async (data: any) => ({ ...data, id: '1' }),
  getCourseById: async (id: string) => ({ id, title: 'Stub Course', description: '', modules: [] }),
  getCourseModules: async (id: string) => [],
  createModule: async (data: any) => ({ ...data, id: '1' }),
  createLesson: async (data: any) => ({ ...data, id: '1' }),
  updateModule: async (id: string, data: any) => ({ id, ...data }),
  getLesson: async (id: string) => ({ 
    id, 
    title: 'Stub Lesson', 
    content: '', 
    content_type: 'article' as const,
    is_published: false,
    article_text: '',
    video_url: '',
    questions: []
  }),
  updateLesson: async (id: string, data: any) => ({ id, ...data }),
};
