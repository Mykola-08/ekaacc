export interface NotificationItem { id: string; title: string; body?: string; createdAt: string; seen?: boolean; type?: string }

const notifications: NotificationItem[] = [];

export const mockNotificationsAPI = {
  async listNotifications() {
    return notifications;
  },
  async createNotification(n: { userId?: string; title: string; body?: string; type?: string }) {
    const item: NotificationItem = { id: 'notif-' + (notifications.length + 1), ...n, createdAt: new Date().toISOString(), seen: false };
    notifications.unshift(item);
    return item;
  },
  async markSeen(id: string) {
    const it = notifications.find(x => x.id === id);
    if (it) it.seen = true;
    return true;
  }
};
