import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | null = null;
let firestore: Firestore | null = null;

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var is not set');
  // Accept either raw JSON or base64-encoded JSON (easier Vercel env pasting).
  let jsonStr = raw.trim();
  if (!jsonStr.startsWith('{')) {
    jsonStr = Buffer.from(jsonStr, 'base64').toString('utf8');
  }
  const parsed = JSON.parse(jsonStr);
  if (typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  return parsed;
}

export function adminApp(): App {
  if (app) return app;
  const existing = getApps();
  if (existing.length) {
    app = existing[0];
    return app;
  }
  app = initializeApp({ credential: cert(loadServiceAccount()) });
  return app;
}

export function adminDb(): Firestore {
  if (firestore) return firestore;
  firestore = getFirestore(adminApp());
  return firestore;
}
