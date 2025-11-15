const _assessments: any[] = [];

export const fxAssessments = {
  async saveAssessment(sessionId: string, data: any) {
    const id = Math.random().toString(36).slice(2);
    const payload = { id, sessionId, data, createdAt: new Date().toISOString() };
    _assessments.push(payload);
    return payload;
  },
  async getAssessmentsForSession(sessionId: string) {
    return _assessments
      .filter(a => a.sessionId === sessionId)
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  },
  async deleteAssessment(assessmentId: string) {
    const idx = _assessments.findIndex(a => a.id === assessmentId);
    if (idx >= 0) _assessments.splice(idx, 1);
    return { id: assessmentId };
  }
};

export default fxAssessments;
