export interface SessionTemplate { id: string; title: string; content: string; createdAt: string; authorId?: string }

const templates: SessionTemplate[] = [];

export const mockTemplatesAPI = {
  async listTemplates() {
    return templates;
  },
  async createTemplate(t: { title: string; content: string; authorId?: string }) {
    const tmpl: SessionTemplate = { id: 'tmpl-' + (templates.length + 1), ...t, createdAt: new Date().toISOString() };
    templates.unshift(tmpl);
    return tmpl;
  },
  async deleteTemplate(id: string) {
    const idx = templates.findIndex(t => t.id === id);
    if (idx !== -1) templates.splice(idx, 1);
    return true;
  }
};
