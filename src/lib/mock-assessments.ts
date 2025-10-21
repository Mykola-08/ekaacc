import { mockFetch } from './mock-data';

export type MockAssessment = {
  id: string;
  sessionId: string;
  createdAt: string;
  data: any;
};

export const mockAssessments: MockAssessment[] = [];

export const mockAssessmentsAPI = {
  saveAssessment: async (sessionId: string, data: any) => {
    await mockFetch(null, 400);
    const newRec: MockAssessment = {
      id: 'assess-' + (mockAssessments.length + 1),
      sessionId,
      createdAt: new Date().toISOString(),
      data,
    };
    mockAssessments.push(newRec);
    return newRec;
  },
  getAssessmentsForSession: async (sessionId: string) => {
    await mockFetch(null, 200);
    return mockAssessments.filter(a => a.sessionId === sessionId);
  },
  deleteAssessment: async (assessmentId: string) => {
    await mockFetch(null, 100);
    const idx = mockAssessments.findIndex(a => a.id === assessmentId);
    if (idx !== -1) mockAssessments.splice(idx, 1);
    return { id: assessmentId };
  }
};
