import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getBookingTokenSecret } from '@/lib/config';

export interface ManageTokenPayload {
  bookingId: string;
  scope: 'view' | 'manage';
  iat?: number;
  exp?: number; // seconds since epoch
}

export async function signManageToken(
  bookingId: string,
  scope: 'view' | 'manage',
  ttlSeconds = 900
) {
  const secret = await getBookingTokenSecret();
  const payload: ManageTokenPayload = { bookingId, scope };
  return jwt.sign(payload, secret, { expiresIn: ttlSeconds });
}

export async function verifyManageToken(token: string): Promise<ManageTokenPayload | null> {
  const secret = await getBookingTokenSecret();
  try {
    return jwt.verify(token, secret) as ManageTokenPayload;
  } catch {
    return null;
  }
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
