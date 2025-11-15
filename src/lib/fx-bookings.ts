const _bookings: any[] = [];

export const fxBookings = {
  async createBooking(userId: string, therapistId: string, date: string, notes?: string) {
    const id = Math.random().toString(36).slice(2);
    const payload: any = { id, userId, therapistId, date, notes: notes || null, status: 'confirmed', createdAt: new Date().toISOString() };
    _bookings.push(payload);
    return payload;
  },
  async getBookingsForUser(userId: string) {
    return _bookings.filter(b => b.userId === userId).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  },
  async getBookingsForTherapist(therapistId: string) {
    return _bookings.filter(b => b.therapistId === therapistId).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  },
  async cancelBooking(bookingId: string) {
    const b = _bookings.find(b => b.id === bookingId);
    if (b) b.status = 'cancelled';
    return { id: bookingId, status: 'cancelled' } as any;
  }
  ,
  async updateBooking(bookingId: string, updates: Record<string, any>) {
    const b = _bookings.find(b => b.id === bookingId);
    if (b) Object.assign(b, updates);
    return { id: bookingId, ...(updates || {}) } as any;
  },
  async getAllBookings() {
    return _bookings.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  },
};

export default fxBookings;
