import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  collectionGroup,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// --------------- Date helpers ---------------

const pad = (n: number) => String(n).padStart(2, '0');

// Legacy helper (device-local). Prefer toDateKeyInZone when a user tz is known.
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function toDateKeyInZone(d: Date, tz?: string | null): string {
  if (!tz) return toDateKey(d);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== 'literal') map[p.type] = p.value;
  return `${map.year}-${map.month}-${map.day}`;
}

export function todayKey(tz?: string | null): string {
  return toDateKeyInZone(new Date(), tz);
}

export function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function prevDateKey(key: string): string {
  // Pure string math via UTC so DST transitions and device tz can't shift us.
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 1);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

// --------------- Check-ins ---------------

export type Checkin = {
  uid: string;
  answer: 'yes' | 'no';
  date: string;
  displayName: string;
  habit: string;
  streak: number;
  photoURL: string | null;
};

export async function getCheckin(uid: string, date: string) {
  const snap = await getDoc(doc(db, 'users', uid, 'checkins', date));
  return snap.exists() ? (snap.data() as Checkin) : null;
}

export type CheckinSummary = { answer: 'yes' | 'no'; streak: number };

export async function getRecentCheckins(
  uid: string,
  maxDocs = 180
): Promise<Map<string, CheckinSummary>> {
  const map = new Map<string, CheckinSummary>();
  try {
    const q = query(
      collection(db, 'users', uid, 'checkins'),
      orderBy('date', 'desc'),
      limit(maxDocs)
    );
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      const data = d.data() as { date?: string; answer: 'yes' | 'no'; streak?: number };
      const key = data.date ?? d.id;
      map.set(key, { answer: data.answer, streak: data.streak ?? 0 });
    }
  } catch (err) {
    console.error('getRecentCheckins failed', err);
  }
  return map;
}

export async function getWeekCheckins(uid: string, dates: string[]) {
  const results: Record<string, 'yes' | 'no'> = {};
  await Promise.all(
    dates.map(async (date) => {
      const snap = await getDoc(doc(db, 'users', uid, 'checkins', date));
      if (snap.exists()) {
        results[date] = (snap.data() as { answer: 'yes' | 'no' }).answer;
      }
    })
  );
  return results;
}

async function computeStreakEndingBefore(uid: string, dateKey: string): Promise<number> {
  const q = query(
    collection(db, 'users', uid, 'checkins'),
    orderBy('date', 'desc'),
    limit(365)
  );
  const snap = await getDocs(q);

  let expected = prevDateKey(dateKey);
  let streak = 0;

  for (const d of snap.docs) {
    const data = d.data() as { date?: string; answer: 'yes' | 'no' };
    const docDate = data.date ?? d.id;
    if (docDate >= dateKey) continue;
    if (docDate !== expected) break;
    if (data.answer !== 'yes') break;
    streak++;
    expected = prevDateKey(expected);
  }

  return streak;
}

export type CheckinInput = {
  displayName: string;
  habit: string;
  photoURL: string | null;
  bestStreak: number;
  timezone?: string | null;
};

export type CheckinResult = {
  streak: number;
  bestStreak: number;
  pointsAwarded: number;
};

// Atomic-ish check-in: writes today's doc with denormalized profile fields,
// recomputes streak from history, updates user doc. Idempotent on re-tap.
export async function checkIn(
  uid: string,
  answer: 'yes' | 'no',
  profile: CheckinInput
): Promise<CheckinResult> {
  const today = todayKey(profile.timezone);
  const checkinRef = doc(db, 'users', uid, 'checkins', today);

  const existingSnap = await getDoc(checkinRef);
  const existing = existingSnap.exists() ? (existingSnap.data() as { answer: 'yes' | 'no' }) : null;
  const wasYes = existing?.answer === 'yes';
  const isNewYes = answer === 'yes' && !wasYes;

  let newStreak = 0;
  if (answer === 'yes') {
    const streakBefore = await computeStreakEndingBefore(uid, today);
    newStreak = streakBefore + 1;
  }
  const newBest = Math.max(newStreak, profile.bestStreak || 0);
  const pointsAwarded = isNewYes ? 10 : 0;

  await setDoc(checkinRef, {
    uid,
    answer,
    date: today,
    displayName: profile.displayName,
    habit: profile.habit,
    streak: newStreak,
    photoURL: profile.photoURL,
    timestamp: serverTimestamp(),
  });

  const updates: Record<string, unknown> = {
    streak: newStreak,
    bestStreak: newBest,
  };
  if (pointsAwarded > 0) updates.points = increment(pointsAwarded);
  await updateDoc(doc(db, 'users', uid), updates);

  return { streak: newStreak, bestStreak: newBest, pointsAwarded };
}

// --------------- User Profile ---------------

export type UserProfile = {
  displayName: string;
  email: string;
  streak: number;
  bestStreak: number;
  points: number;
  habit?: string;
  photoURL?: string | null;
  timezone?: string;
  reminderEnabled?: boolean;
  lastReminderSentOn?: string;
  createdAt?: Timestamp;
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), data);
}

// --------------- Gratitude ---------------

export async function saveGratitude(uid: string, text: string, tz?: string | null) {
  const id = todayKey(tz);
  await setDoc(doc(db, 'users', uid, 'gratitude', id), {
    text,
    timestamp: serverTimestamp(),
  });
}

export async function getRecentGratitude(uid: string, count = 7) {
  const q = query(
    collection(db, 'users', uid, 'gratitude'),
    orderBy('timestamp', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTodayGratitude(uid: string, tz?: string | null) {
  const today = todayKey(tz);
  const snap = await getDoc(doc(db, 'users', uid, 'gratitude', today));
  return snap.exists() ? (snap.data() as { text: string }) : null;
}

// --------------- Feed ---------------

export type FeedItem = {
  uid: string;
  displayName: string;
  habit: string;
  answer: 'yes' | 'no';
  streak: number;
  photoURL: string | null;
  checkedInAt: Date | null;
  gratitude?: string;
};

const FEED_LIMIT = 50;

export async function getTodayFeed(
  tz?: string | null,
  maxItems = FEED_LIMIT
): Promise<FeedItem[]> {
  const today = todayKey(tz);
  const q = query(
    collectionGroup(db, 'checkins'),
    where('date', '==', today),
    orderBy('timestamp', 'desc'),
    limit(maxItems)
  );
  const snap = await getDocs(q);

  return Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data() as Checkin & { timestamp?: Timestamp };
      const gratSnap = await getDoc(doc(db, 'users', data.uid, 'gratitude', today));
      const gratitude = gratSnap.exists() ? (gratSnap.data() as { text: string }).text : undefined;
      return {
        uid: data.uid,
        displayName: data.displayName || 'Someone',
        habit: data.habit || 'Showed up today',
        answer: data.answer,
        streak: data.streak || 0,
        photoURL: data.photoURL ?? null,
        checkedInAt: data.timestamp ? data.timestamp.toDate() : null,
        gratitude,
      };
    })
  );
}
