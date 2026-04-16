'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';
import { getUserProfile, updateUserProfile, getRecentGratitude, type UserProfile } from '@/lib/firestore';

export default function Me() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [gratitude, setGratitude] = useState<any[]>([]);
  const [editingHabit, setEditingHabit] = useState(false);
  const [habitDraft, setHabitDraft] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const p = await getUserProfile(user.uid);
      setProfile(p);
      if (p?.habit) setHabitDraft(p.habit);
      const g = await getRecentGratitude(user.uid, 7);
      setGratitude(g);
    };
    load();
  }, [user]);

  const saveHabit = async () => {
    if (!user || !habitDraft.trim()) return;
    await updateUserProfile(user.uid, { habit: habitDraft.trim() });
    setProfile((p) => p ? { ...p, habit: habitDraft.trim() } : p);
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
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <>
      <TopNav leftIcon="arrow_back" leftHref="/" />
      <main className="pt-24 px-6 pb-8">
        {/* Profile Header */}
        <section className="mb-10 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {initial}
          </div>
          <h1 className="text-3xl font-headline font-bold text-on-surface">{displayName}</h1>
          <p className="text-on-surface-variant font-body text-sm mt-1">Member since {memberSince}</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-surface-container-low p-4 rounded-lg text-center">
            <div className="text-2xl font-headline font-bold text-on-surface">{profile?.streak || 0}</div>
            <p className="text-[10px] font-label font-bold uppercase text-on-surface-variant tracking-wider mt-1">Streak</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg text-center">
            <div className="text-2xl font-headline font-bold text-on-surface">{profile?.bestStreak || 0}</div>
            <p className="text-[10px] font-label font-bold uppercase text-on-surface-variant tracking-wider mt-1">Best</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg text-center">
            <div className="text-2xl font-headline font-bold text-on-surface">{(profile?.points || 0).toLocaleString()}</div>
            <p className="text-[10px] font-label font-bold uppercase text-on-surface-variant tracking-wider mt-1">Points</p>
          </div>
        </section>

        {/* Habit Setting */}
        <section className="mb-10">
          <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">Your daily habit</h3>
          {editingHabit ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={habitDraft}
                onChange={(e) => setHabitDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveHabit()}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                placeholder="e.g. Work out, Read, Meditate"
                autoFocus
              />
              <button onClick={saveHabit} className="bg-secondary text-white px-4 rounded-lg font-label font-bold text-sm">
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingHabit(true)}
              className="w-full text-left bg-surface-container-low p-4 rounded-lg flex justify-between items-center group hover:bg-surface-container transition-colors"
            >
              <span className="font-body text-on-surface">{profile?.habit || 'Tap to set your habit'}</span>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">edit</span>
            </button>
          )}
        </section>

        {/* Recent Gratitude */}
        {gratitude.length > 0 && (
          <section className="mb-10">
            <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">Recent gratitude</h3>
            <div className="space-y-2">
              {gratitude.map((g) => (
                <div key={g.id} className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-sm font-body text-on-surface italic">&ldquo;{g.text}&rdquo;</p>
                  <p className="text-[10px] font-body text-on-surface-variant mt-2 uppercase tracking-wider">{g.id}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 text-center text-sm font-body font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
        >
          Sign Out
        </button>
      </main>
      <BottomNav />
    </>
  );
}
