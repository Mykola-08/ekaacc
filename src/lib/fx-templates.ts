const _templates: any[] = [];

export const fxTemplates = {
  async listTemplates() {
    return _templates.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  },
  async createTemplate({ title, content, authorId }: { title: string; content: string; authorId?: string }) {
    const id = Math.random().toString(36).slice(2);
    const payload = { id, title, content, authorId, createdAt: new Date().toISOString() } as any;
    _templates.push(payload);
    return payload;
  },
  async deleteTemplate(id: string) {
    const idx = _templates.findIndex(t => t.id === id);
    if (idx >= 0) _templates.splice(idx, 1);
    return true;
  }
};

export default fxTemplates;
