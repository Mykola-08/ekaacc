
export interface SquareWebhookEvent {
  merchant_id: string;
  type: string;
  event_id: string;
  created_at: string;
  data: {
    type: string;
    id: string;
    object: any; // Using any for flexibility as Square objects vary
  };
}

export interface EnhancedSquareWebhookEvent extends SquareWebhookEvent {
  // Add any enhanced properties if needed, or just aliases
  // The code seems to expect these properties directly on the event, 
  // or maybe they were spread?
  // Let's look at usage: "const { type, data } = event;" 
  // This matches SquareWebhookEvent.
  // "eventId: event.eventId" -> this is camelCase, but Square sends snake_case event_id.
  
  // It seems the code expects camelCase versions?
  // Or the type definition was extending something else.
  
  eventId?: string;
  merchantId?: string;
  locationId?: string;
}

// If the code is using snake_case properties from Square, but also tries to access camelCase
// we might need to fix the code or the type.
// Error: "Property 'eventId' does not exist on type 'EnhancedSquareWebhookEvent'."
// Usage: event.eventId.

// I'll add the camelCase properties to the interface.
