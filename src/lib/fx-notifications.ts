const _notifications: any[] = [];

export const fxNotifications = {
  async listNotifications() {
    return _notifications.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  },
  async createNotification(n: { userId?: string; title: string; body?: string; type?: string }) {
    const id = Math.random().toString(36).slice(2);
    const payload = { id, userId: n.userId, title: n.title, body: n.body, type: n.type || 'system', createdAt: new Date().toISOString(), seen: false } as any;
    _notifications.push(payload);
    return payload;
  },
  async markSeen(id: string) {
    const n = _notifications.find(n => n.id === id);
    if (n) n.seen = true;
    return true;
  }
};

export default fxNotifications;
