import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

function secret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET;
  if (!s) throw new Error('UNSUBSCRIBE_SECRET env var is not set');
  return s;
}

export function signUid(uid: string): string {
  return createHmac('sha256', secret()).update(uid).digest('hex');
}

export function verifyUid(uid: string, token: string): boolean {
  try {
    const expected = Buffer.from(signUid(uid), 'hex');
    const provided = Buffer.from(token, 'hex');
    if (expected.length !== provided.length) return false;
    return timingSafeEqual(expected, provided);
  } catch {
    return false;
  }
}
