import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// --------------- Check-ins ---------------

const pad = (n: number) => String(n).padStart(2, '0');
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export async function saveCheckin(uid: string, date: string, answer: 'yes' | 'no') {
  await setDoc(doc(db, 'users', uid, 'checkins', date), {
    answer,
    timestamp: serverTimestamp(),
  });
}

export async function getCheckin(uid: string, date: string) {
  const snap = await getDoc(doc(db, 'users', uid, 'checkins', date));
  return snap.exists() ? (snap.data() as { answer: 'yes' | 'no' }) : null;
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

// --------------- User Profile ---------------

export type UserProfile = {
  displayName: string;
  email: string;
  streak: number;
  bestStreak: number;
  points: number;
  habit?: string;
  createdAt?: Timestamp;
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function updateStreak(uid: string, currentStreak: number, bestStreak: number) {
  await updateDoc(doc(db, 'users', uid), {
    streak: currentStreak,
    bestStreak,
    points: increment(currentStreak > 0 ? 10 : 0),
  });
}

// --------------- Gratitude ---------------

export async function saveGratitude(uid: string, text: string) {
  const id = toDateKey(new Date());
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
