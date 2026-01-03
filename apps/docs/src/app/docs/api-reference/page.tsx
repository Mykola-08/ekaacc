import { RoleProtected } from '@/components/RoleProtected';

export default function ApiReference() {
  return (
    <RoleProtected allowedRoles={['developer', 'admin']}>
      <div className="prose dark:prose-invert max-w-none">
        <h1>Booking API Schema</h1>
        <p>This document outlines the public booking micro-app endpoints and their request/response bodies.</p>

        <h2>Conventions</h2>
        <ul>
          <li><strong>Times:</strong> ISO-8601 UTC strings.</li>
          <li><strong>Currency:</strong> minor units (cents) for amounts in payloads.</li>
          <li><strong>Authentication:</strong> tokenized manage link via signed JWT.</li>
          <li><strong>Errors:</strong> JSON <code>{`{ error: string }`}</code> with appropriate HTTP status.</li>
        </ul>

        <h2>Endpoints</h2>

        <h3>GET /api/services</h3>
        <p>Returns minimal list of services.</p>
        <pre><code>{`{ services: [ { id, name, price, duration, description, image_url } ] }`}</code></pre>

        <h3>GET /api/services/{`{id}`}/availability?date=YYYY-MM-DD</h3>
        <p>Generates slots per active staff schedule for the weekday, excluding overlapping pending/authorized/captured bookings.</p>
        <pre><code>{`{
  serviceId,
  date,
  durationMinutes,
  generatedAt,
  slots: [ { startTime, endTime, staffId } ]
}`}</code></pre>

        <h3>POST /api/booking</h3>
        <p>Creates a pending booking and reserves slot for TTL (5 minutes).</p>
        <h4>Request:</h4>
        <pre><code>{`{
  serviceId: string,
  startTime: string (ISO),
  email: string,
  phone?: string,
  displayName?: string,
  paymentMode: 'full' | 'deposit',
  depositCents?: number,
  addons?: [ { addonId, name, priceCents } ],
  staffId?: string  // optional; if omitted auto-assigned
}`}</code></pre>
        <h4>Response:</h4>
        <pre><code>{`{
  bookingId,
  clientSecret, // Stripe PaymentIntent client_secret
  expiresAt     // ISO timestamp when reservation expires
}`}</code></pre>
      </div>
    </RoleProtected>
  );
}
