'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';
import {
  getUserProfile,
  updateUserProfile,
  getRecentGratitude,
  getRecentCheckins,
  todayKey,
  browserTimezone,
  type UserProfile,
  type CheckinSummary,
} from '@/lib/firestore';

const GRID_WEEKS = 22;
const GRID_DAYS = 7; // Sun..Sat

type Cell = {
  dateKey: string;
  date: Date;
  inFuture: boolean;
  summary?: CheckinSummary;
};

function buildGrid(
  tz: string | null,
  checkins: Map<string, CheckinSummary>
): Cell[][] {
  // Anchor on today's date key in the user's tz, then walk back via UTC string math
  // so DST transitions don't shift cells.
  const todayK = todayKey(tz);
  const [ty, tm, td] = todayK.split('-').map(Number);
  const todayUTC = new Date(Date.UTC(ty, tm - 1, td));
  const todayWeekday = todayUTC.getUTCDay(); // 0=Sun..6=Sat

  const rows: Cell[][] = [];
  for (let row = 0; row < GRID_DAYS; row++) {
    const cols: Cell[] = [];
    for (let col = 0; col < GRID_WEEKS; col++) {
      const daysAgo = (GRID_WEEKS - 1 - col) * 7 + (todayWeekday - row);
      const d = new Date(todayUTC);
      d.setUTCDate(d.getUTCDate() - daysAgo);
      const inFuture = daysAgo < 0;
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      cols.push({
        dateKey: key,
        date: d,
        inFuture,
        summary: inFuture ? undefined : checkins.get(key),
      });
    }
    rows.push(cols);
  }
  return rows;
}

function cellClass(cell: Cell): string {
  if (cell.inFuture) return 'bg-surface-variant/20';
  if (!cell.summary) return 'bg-surface-variant';
  if (cell.summary.answer !== 'yes') return 'bg-surface-variant';
  const s = cell.summary.streak;
  if (s >= 11) return 'bg-on-secondary-container';
  if (s >= 4) return 'bg-secondary';
  return 'bg-secondary-container';
}

export default function Me() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [gratitude, setGratitude] = useState<{ id: string; text: string }[]>([]);
  const [checkins, setCheckins] = useState<Map<string, CheckinSummary>>(new Map());
  const [editingHabit, setEditingHabit] = useState(false);
  const [habitDraft, setHabitDraft] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [p, g, c] = await Promise.all([
        getUserProfile(user.uid),
        getRecentGratitude(user.uid, 5),
        getRecentCheckins(user.uid, GRID_WEEKS * GRID_DAYS + 30),
      ]);
      setProfile(p);
      if (p?.habit) setHabitDraft(p.habit);
      setGratitude(g as { id: string; text: string }[]);
      setCheckins(c);
    };
    load();
  }, [user]);

  const tz = profile?.timezone ?? browserTimezone();
  const grid = useMemo(() => buildGrid(tz, checkins), [tz, checkins]);

  const saveHabit = async () => {
    if (!user || !habitDraft.trim()) return;
    await updateUserProfile(user.uid, { habit: habitDraft.trim() });
    setProfile((p) => (p ? { ...p, habit: habitDraft.trim() } : p));
    setEditingHabit(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-outline font-body">Loading...</span>
      </div>
    );
  }

  const displayName = profile?.displayName || user.displayName || 'You';
  const initial = displayName[0].toUpperCase();

  return (
    <>
      <TopNav />
      <main className="pt-24 pb-32 px-6 space-y-10">
        {/* Profile Hero */}
        <section className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-[2.5rem] bg-secondary-container overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-3xl font-bold text-on-secondary-container">{initial}</span>
              )}
            </div>
          </div>
          <h1 className="headline-serif italic text-3xl text-on-surface tracking-tight">{displayName}</h1>
          <p className="text-on-surface-variant font-medium tracking-wide text-sm uppercase mt-1">
            {profile?.habit || 'Set your daily habit'}
          </p>
        </section>

        {/* Atomic Identity */}
        <section>
          {editingHabit ? (
            <div className="bg-surface-container-low px-6 py-4 rounded-xl border-l-4 border-primary space-y-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Your daily habit</span>
              <input
                type="text"
                value={habitDraft}
                onChange={(e) => setHabitDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveHabit()}
                className="w-full bg-transparent border-none p-0 focus:ring-0 headline-serif italic text-xl text-on-surface placeholder:text-outline-variant"
                placeholder="e.g. Read 20 pages, Meditate 10 min"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={saveHabit} className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-xs font-bold">Save</button>
                <button onClick={() => setEditingHabit(false)} className="text-xs text-on-surface-variant">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditingHabit(true)}
              className="w-full text-left bg-surface-container-low px-6 py-4 rounded-xl border-l-4 border-primary hover:bg-surface-container transition-colors"
            >
              <p className="headline-serif italic text-xl text-on-surface leading-relaxed">
                &ldquo;I am the kind of person who <span className="text-primary font-semibold">{profile?.habit || 'shows up every day'}</span>.&rdquo;
              </p>
              <span className="text-xs font-bold text-on-surface-variant uppercase mt-2 block opacity-60">
                Tap to edit your habit
              </span>
            </button>
          )}
        </section>

        {/* Stats Bento */}
        <section className="grid grid-cols-3 gap-3">
          <div className="col-span-1 bg-primary text-on-primary p-5 rounded-xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary-container/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <span className="material-symbols-outlined text-2xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Streak</p>
              <p className="text-4xl headline-serif italic font-bold">{profile?.streak || 0}</p>
            </div>
          </div>

          <div className="col-span-2 grid grid-rows-2 gap-3">
            <div className="bg-surface-container p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-on-surface-variant opacity-60">Best Streak</p>
                <p className="headline-serif italic text-2xl">{profile?.bestStreak || 0}</p>
              </div>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
            </div>
            <div className="bg-surface-container p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-on-surface-variant opacity-60">Points</p>
                <p className="headline-serif italic text-2xl">{(profile?.points || 0).toLocaleString()}</p>
              </div>
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
            </div>
          </div>
        </section>

        {/* Habit Vitality Grid */}
        <section className="bg-surface-container p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="headline-serif text-xl italic">Habit Vitality</h3>
              <p className="text-on-surface-variant text-xs">Last 22 weeks</p>
            </div>
            <div className="flex gap-1 items-center text-[10px] font-bold uppercase text-on-surface-variant">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-surface-variant" />
              <div className="w-3 h-3 rounded-sm bg-secondary-container" />
              <div className="w-3 h-3 rounded-sm bg-secondary" />
              <div className="w-3 h-3 rounded-sm bg-on-secondary-container" />
              <span>More</span>
            </div>
          </div>
          <div className="space-y-1">
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="habit-grid">
                {row.map((cell) => (
                  <div
                    key={cell.dateKey}
                    className={`habit-cell ${cellClass(cell)}`}
                    title={`${cell.dateKey}${cell.summary ? ` — ${cell.summary.answer}` : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Recent Gratitude */}
        {gratitude.length > 0 && (
          <section className="bg-surface-container-low p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant/30" />
              <h2 className="headline-serif text-xl italic px-2">Gratitude Archive</h2>
              <div className="h-px flex-1 bg-outline-variant/30" />
            </div>
            <div className="space-y-3">
              {gratitude.map((g) => (
                <div key={g.id} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-white rounded-full flex-shrink-0 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-body text-on-surface leading-relaxed italic">&ldquo;{g.text}&rdquo;</p>
                    <p className="text-[10px] font-body text-on-surface-variant mt-1 uppercase tracking-wider">{g.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Settings */}
        <section className="bg-surface-container-low px-6 py-4 rounded-xl">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Daily reminder</p>
              <p className="text-sm font-body text-on-surface">
                Email nudge at 9am {profile?.timezone ? `(${profile.timezone})` : ''}
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile?.reminderEnabled !== false}
              onChange={async (e) => {
                if (!user) return;
                const next = e.target.checked;
                setProfile((p) => (p ? { ...p, reminderEnabled: next } : p));
                await updateUserProfile(user.uid, { reminderEnabled: next });
              }}
              className="w-5 h-5 accent-primary"
            />
          </label>
        </section>

        <button
          onClick={handleSignOut}
          className="w-full py-3 text-center text-sm font-body font-semibold text-primary/60 hover:text-primary transition-colors"
        >
          Sign Out
        </button>
      </main>
      <BottomNav />
    </>
  );
}
