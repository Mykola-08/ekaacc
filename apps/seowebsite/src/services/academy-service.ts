export const academyService = {
  getInstructorCourses: async (userId: string) => [],
  createCourse: async (data: any) => ({ ...data, id: '1' }),
  getCourseById: async (id: string) => ({ id, title: 'Stub Course' }),
  getCourseModules: async (id: string) => [],
  createModule: async (data: any) => ({ ...data, id: '1' }),
  createLesson: async (data: any) => ({ ...data, id: '1' }),
  updateModule: async (id: string, data: any) => ({ id, ...data }),
  getLesson: async (id: string) => ({ id, title: 'Stub Lesson', content: '' }),
  updateLesson: async (id: string, data: any) => ({ id, ...data }),
};
