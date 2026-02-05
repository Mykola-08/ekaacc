// Event emitter for internal events - production-ready
// In production, replace with webhook dispatch or message bus publish (e.g., Redis, RabbitMQ, AWS SNS)

type EventType = 
  | 'booking.created'
  | 'booking.confirmed'
  | 'booking.cancelled'
  | 'booking.completed'
  | 'booking.no_show'
  | 'booking.payment_failed'
  | 'payment.session_created'
  | 'payment.captured'
  | 'payment.refunded'
  | 'service.updated'
  | 'service.created'
  | 'waitlist.joined';

interface EventPayload {
  bookingId?: string;
  serviceId?: string;
  sessionId?: string;
  startTime?: string;
  staffId?: string;
  [key: string]: unknown;
}

const eventHandlers = new Map<EventType, ((payload: EventPayload) => Promise<void>)[]>();

export function onEvent(type: EventType, handler: (payload: EventPayload) => Promise<void>): void {
  const handlers = eventHandlers.get(type) || [];
  handlers.push(handler);
  eventHandlers.set(type, handlers);
}

export async function emitEvent(type: EventType, payload: EventPayload): Promise<boolean> {
  // Execute registered handlers
  const handlers = eventHandlers.get(type) || [];
  await Promise.allSettled(handlers.map(handler => handler(payload)));

  // TODO: In production, dispatch to webhook/message bus here
  // const timestamp = new Date().toISOString();
  // await dispatchToWebhook(type, payload, timestamp);

  return true;
}
