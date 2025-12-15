import RoleGuard from '@/components/RoleGuard';

export default function ApiReference() {
  return (
    <RoleGuard allowedRoles={['developer', 'admin']} fallback={<div>You need Developer or Admin access to view API Reference.</div>}>
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
  manageToken,
  totalCents,
  basePriceCents,
  addonsTotalCents,
  depositCents?,
  reservationExpiresAt
  staffId,
}`}</code></pre>

        <h3>POST /api/booking/{`{id}`}/pay</h3>
        <p>Initiates Stripe Checkout for full or deposit amount.</p>
        <h4>Request:</h4>
        <pre><code>{`{ manageToken }`}</code></pre>
        <h4>Response:</h4>
        <pre><code>{`{ sessionId, url }`}</code></pre>

        <h3>POST /api/booking/{`{id}`}/cancel</h3>
        <p>Applies cancellation policy; may issue refund.</p>
        <h4>Request:</h4>
        <pre><code>{`{ manageToken }`}</code></pre>
        <h4>Response:</h4>
        <pre><code>{`{ bookingId, status: 'canceled', refundCents, manageToken }`}</code></pre>

        <h3>POST /api/booking/{`{id}`}/reschedule</h3>
        <p>Reschedules booking if within policy window.</p>
        <h4>Request:</h4>
        <pre><code>{`{ manageToken, newStartTime: ISO }`}</code></pre>
        <h4>Response:</h4>
        <pre><code>{`{ bookingId, newStartTime, newEndTime, priceDeltaCents, manageToken }`}</code></pre>

        <h3>POST /api/booking/{`{id}`}/request-manage-link</h3>
        <p>Issues a new manage token if email matches.</p>
        <h4>Request:</h4>
        <pre><code>{`{ email }`}</code></pre>
      </div>
    </RoleGuard>
  );
}
