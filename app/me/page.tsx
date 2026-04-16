'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';
import { getUserProfile, getRecentGratitude, type UserProfile } from '@/lib/firestore';

export default function Me() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [gratitude, setGratitude] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const p = await getUserProfile(user.uid);
      setProfile(p);
      const g = await getRecentGratitude(user.uid, 5);
      setGratitude(g);
    };
    load();
  }, [user]);

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
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <>
      <TopNav leftIcon="search" leftHref="/" />
      <main className="pt-24 px-6 pb-8">
        {/* Hero */}
        <section className="mb-12 relative">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl font-headline font-bold text-on-surface leading-tight mb-2">
            {displayName}&rsquo;s Growth
          </h1>
          <p className="text-on-surface-variant font-body">Member since {memberSince}</p>

          {/* Active Focus */}
          <div className="mt-8 relative overflow-hidden bg-secondary text-white p-8 rounded-xl rounded-tr-[5rem] rounded-bl-[4rem]">
            <div className="relative z-10">
              <span className="text-xs font-label uppercase tracking-widest opacity-80">Active Focus</span>
              <h2 className="text-2xl font-headline font-bold mt-1 mb-4">
                {profile?.habit || 'Set your daily habit'}
              </h2>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, (profile?.streak || 0) * 4)}%` }} />
                </div>
                <span className="text-sm font-label font-bold">{profile?.streak || 0} days</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-surface-container-low p-6 rounded-lg border-b-4 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-primary">local_fire_department</span>
              <span className="text-[10px] font-label font-bold uppercase text-primary/60">Current</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">
              {profile?.streak || 0} <span className="text-sm font-body font-normal text-on-surface-variant">days</span>
            </div>
            <p className="text-[11px] font-body mt-1">Best: {profile?.bestStreak || 0} days</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg border-b-4 border-tertiary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-tertiary">eco</span>
              <span className="text-[10px] font-label font-bold uppercase text-tertiary/60">Points</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">
              {(profile?.points || 0).toLocaleString()}
            </div>
            <p className="text-[11px] font-body mt-1">+10 per check-in</p>
          </div>
        </section>

        {/* Recent Gratitude */}
        {gratitude.length > 0 && (
          <section className="mb-12">
            <h3 className="font-headline text-xl font-bold mb-4">Recent Gratitude</h3>
            <div className="space-y-3">
              {gratitude.map((g) => (
                <div key={g.id} className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-sm font-body text-on-surface">{g.text}</p>
                  <p className="text-[10px] font-body text-on-surface-variant mt-2 uppercase tracking-wider">{g.id}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sign Out */}
        <section className="mb-8">
          <button
            onClick={handleSignOut}
            className="w-full py-3 text-center text-sm font-body font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
          >
            Sign Out
          </button>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
