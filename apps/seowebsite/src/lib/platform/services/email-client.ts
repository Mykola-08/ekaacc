import { Resend } from 'resend';

// Lazy / safe Resend initialization to avoid build-time crashes when
// RESEND_API_KEY is not provided (e.g. preview deployments without secrets).
const apiKey = process.env.RESEND_API_KEY;
let resend: Resend | null = null;

if (apiKey && apiKey.trim()) {
	try {
		resend = new Resend(apiKey.trim());
	} catch (e) {
		// Constructor could throw if key is invalid format; log and keep null.
		console.warn('Failed to initialize Resend client:', e);
		resend = null;
	}
} else {
	// Only warn in production to avoid noise in local dev/test where key may be intentionally absent.
	if (process.env.NODE_ENV === 'production') {
		console.warn('RESEND_API_KEY missing; email functionality disabled.');
	}
}

export function getResend(): Resend {
	if (!resend) {
		throw new Error('Resend client not configured (missing RESEND_API_KEY).');
	}
	return resend;
}

export function safeResend(): Resend | null {
	return resend;
}

export { resend };
