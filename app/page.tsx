'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';
import {
  saveCheckin,
  getWeekCheckins,
  saveGratitude,
  getUserProfile,
  updateUserProfile,
  updateStreak,
  toDateKey,
} from '@/lib/firestore';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const addDays = (d: Date, n: number) => {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
};
const startOfWeek = (d: Date) => {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay());
  return out;
};

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todayAnswer, setTodayAnswer] = useState<'yes' | 'no' | null>(null);
  const [weekData, setWeekData] = useState<Record<string, 'yes' | 'no'>>({});
  const [gratitudeText, setGratitudeText] = useState('');
  const [saving, setSaving] = useState(false);
  const [habit, setHabit] = useState('Did you show up today?');
  const [streak, setStreak] = useState(0);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayKey = toDateKey(today);

  const weekDays = useMemo(() => {
    const sun = startOfWeek(today);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(sun, i);
      return { d, key: toDateKey(d), wd: WEEKDAYS[i] };
    });
  }, [today]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const profile = await getUserProfile(user.uid);
      if (profile?.habit) setHabit(profile.habit);
      if (profile?.streak) setStreak(profile.streak);

      const dates = weekDays.map((w) => w.key);
      const checkins = await getWeekCheckins(user.uid, dates);
      setWeekData(checkins);
      if (checkins[todayKey]) setTodayAnswer(checkins[todayKey]);
    };
    load();
  }, [user, weekDays, todayKey]);

  const handleAnswer = async (answer: 'yes' | 'no') => {
    if (!user) return;
    const newAnswer = todayAnswer === answer ? null : answer;

    setTodayAnswer(newAnswer);
    setWeekData((prev) => {
      const next = { ...prev };
      if (newAnswer) next[todayKey] = newAnswer;
      else delete next[todayKey];
      return next;
    });

    if (newAnswer) {
      await saveCheckin(user.uid, todayKey, newAnswer);
      // Calculate streak
      let s = 0;
      if (newAnswer === 'yes') {
        s = 1;
        let cursor = addDays(today, -1);
        while (weekData[toDateKey(cursor)] === 'yes') {
          s++;
          cursor = addDays(cursor, -1);
        }
      }
      setStreak(s);
      const profile = await getUserProfile(user.uid);
      const best = Math.max(s, profile?.bestStreak || 0);
      await updateStreak(user.uid, s, best);
    }
  };

  const handleSaveGratitude = async () => {
    if (!user || !gratitudeText.trim()) return;
    setSaving(true);
    await saveGratitude(user.uid, gratitudeText.trim());
    setGratitudeText('');
    setSaving(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-outline font-body">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <TopNav leftIcon="menu" leftHref="/" />
      <main className="flex-1 pt-24 pb-32 px-6">
        <header className="mb-12 relative">
          <div className="absolute -top-12 -right-8 w-48 h-48 bg-secondary-container/20 organic-blob-1 -z-10 blur-2xl" />
          <h1 className="text-5xl font-bold leading-tight mb-4 text-on-surface">
            {habit}
          </h1>
          <p className="text-on-surface-variant font-body text-lg">
            {streak > 0 ? `${streak}-day streak. Keep going.` : 'Every small step is a seed planted for tomorrow\u2019s growth.'}
          </p>
        </header>

        {/* Yes / No */}
        <section className="grid grid-cols-2 gap-6 mb-8 items-end">
          <button
            onClick={() => handleAnswer('yes')}
            className="group flex flex-col items-center justify-center gap-4 transition-all duration-300 transform active:scale-95"
          >
            <div className={`w-full aspect-[4/5] organic-blob-2 flex items-center justify-center shadow-lg transition-colors ${
              todayAnswer === 'yes' ? 'bg-secondary ring-4 ring-secondary/30' : 'bg-secondary'
            } group-hover:bg-secondary-dim`}>
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {todayAnswer === 'yes' ? 'check' : 'spa'}
              </span>
            </div>
            <span className="font-label font-semibold text-lg tracking-wider text-secondary">
              {todayAnswer === 'yes' ? 'DONE' : 'YES'}
            </span>
          </button>

          <button
            onClick={() => handleAnswer('no')}
            className="group flex flex-col items-center justify-center gap-4 transition-all duration-300 transform active:scale-95"
          >
            <div className={`w-full aspect-square organic-blob-1 flex items-center justify-center transition-colors ${
              todayAnswer === 'no' ? 'bg-primary-container ring-4 ring-primary/30' : 'bg-surface-container'
            } group-hover:bg-surface-container-highest`}>
              <span className={`material-symbols-outlined text-5xl ${
                todayAnswer === 'no' ? 'text-on-primary-container' : 'text-outline'
              }`}>
                {todayAnswer === 'no' ? 'close' : 'motion_photos_off'}
              </span>
            </div>
            <span className={`font-label font-semibold text-lg tracking-wider ${
              todayAnswer === 'no' ? 'text-primary' : 'text-outline'
            }`}>
              {todayAnswer === 'no' ? 'MISSED' : 'NO'}
            </span>
          </button>
        </section>

        {/* Week Grid */}
        <section className="mb-12">
          <div className="flex justify-between px-1">
            {weekDays.map(({ d, key, wd }) => {
              const ans = weekData[key];
              const isToday = key === todayKey;
              return (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {wd}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    ans === 'yes' ? 'bg-secondary text-white' :
                    ans === 'no' ? 'bg-primary-container text-on-primary-container' :
                    isToday ? 'border-2 border-secondary text-secondary' :
                    'bg-surface-container text-on-surface-variant'
                  }`}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gratitude */}
        <section className="relative">
          <div className="bg-surface-container-low rounded-xl p-8 pt-10">
            <div className="absolute -top-4 left-8 bg-tertiary-fixed text-on-tertiary-fixed px-6 py-2 organic-blob-2 font-headline italic text-lg shadow-sm">
              Gratitude Journal
            </div>
            <h3 className="text-2xl font-bold mb-6 text-on-surface pt-4">
              What are you grateful for?
            </h3>
            <div className="relative">
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-xl font-body text-on-surface placeholder:text-outline-variant min-h-[120px] resize-none"
                placeholder="Today, I am thankful for..."
              />
              <div className="h-1 w-full bg-surface-variant rounded-full mt-2">
                <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${Math.min(100, gratitudeText.length)}%` }} />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveGratitude}
                disabled={saving || !gratitudeText.trim()}
                className="bg-on-surface text-surface px-8 py-3 rounded-full font-label font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {saving ? 'SAVING...' : 'SAVE ENTRY'}
              </button>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
