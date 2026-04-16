'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';
import {
  saveCheckin,
  saveGratitude,
  getCheckin,
  getTodayGratitude,
  getUserProfile,
  updateStreak,
  getTodayFeed,
  toDateKey,
  type FeedItem,
} from '@/lib/firestore';

// Card colors cycle through these
const CARD_STYLES = [
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container', blob: 'organic-blob-1' },
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', blob: 'organic-blob-3' },
  { bg: 'bg-primary-container', text: 'text-on-primary-container', blob: 'organic-blob-2' },
  { bg: 'bg-secondary', text: 'text-white', blob: 'organic-blob-2' },
];

function FeedCard({ item, style, isOwn }: { item: FeedItem; style: typeof CARD_STYLES[0]; isOwn: boolean }) {
  const [flipped, setFlipped] = useState(false);

  const hasGratitude = !!item.gratitude;

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => hasGratitude && setFlipped((f) => !f)}
    >
      <div
        className="relative transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className={`${style.bg} ${style.text} ${style.blob} p-6 shadow-sm min-h-[180px] flex flex-col justify-between`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-xs font-bold text-on-surface">
                {item.displayName[0]}
              </div>
              <div>
                <span className="text-xs font-bold font-body tracking-wider uppercase">
                  {isOwn ? 'You' : item.displayName}
                </span>
              </div>
            </div>
            {item.streak > 0 && (
              <div className="bg-surface-container-lowest/40 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">local_fire_department</span>
                <span className="text-xs font-bold">{item.streak}d</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-headline font-bold leading-tight">{item.habit}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                {item.answer === 'yes' ? 'check_circle' : 'cancel'}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                {item.answer === 'yes' ? 'Done today' : 'Missed today'}
              </span>
            </div>
          </div>
          {hasGratitude && (
            <div className="mt-3 flex items-center gap-1 opacity-60">
              <span className="material-symbols-outlined text-sm">touch_app</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Tap to read gratitude</span>
            </div>
          )}
        </div>

        {/* Back (gratitude) */}
        <div
          className={`${style.bg} ${style.text} ${style.blob} p-6 shadow-sm min-h-[180px] flex flex-col justify-between absolute inset-0`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">favorite</span>
            <span className="text-xs font-bold uppercase tracking-widest">
              {isOwn ? 'Your' : `${item.displayName}'s`} gratitude
            </span>
          </div>
          <p className="text-lg font-headline italic leading-relaxed mt-4 flex-1">
            &ldquo;{item.gratitude}&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-1 opacity-60">
            <span className="material-symbols-outlined text-sm">touch_app</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Check-in state
  const [todayAnswer, setTodayAnswer] = useState<'yes' | 'no' | null>(null);
  const [checkedInJustNow, setCheckedInJustNow] = useState(false);

  // Gratitude state
  const [showGratitude, setShowGratitude] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [gratitudeSaved, setGratitudeSaved] = useState(false);
  const [savingGratitude, setSavingGratitude] = useState(false);

  // Feed state
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  const [habit, setHabit] = useState('Show up today');

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  // Load user's check-in status + profile
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [checkin, gratitude, profile] = await Promise.all([
        getCheckin(user.uid, todayKey),
        getTodayGratitude(user.uid),
        getUserProfile(user.uid),
      ]);
      if (checkin) setTodayAnswer(checkin.answer);
      if (gratitude) setGratitudeSaved(true);
      if (profile?.habit) setHabit(profile.habit);
    };
    load();
  }, [user, todayKey]);

  // Load feed
  const loadFeed = useCallback(async () => {
    setFeedLoading(true);
    const items = await getTodayFeed();
    setFeedItems(items);
    setFeedLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadFeed();
  }, [user, loadFeed]);

  const handleAnswer = async (answer: 'yes' | 'no') => {
    if (!user) return;
    setTodayAnswer(answer);
    setCheckedInJustNow(true);
    await saveCheckin(user.uid, todayKey, answer);

    // Update streak
    const profile = await getUserProfile(user.uid);
    const newStreak = answer === 'yes' ? (profile?.streak || 0) + 1 : 0;
    const best = Math.max(newStreak, profile?.bestStreak || 0);
    await updateStreak(user.uid, newStreak, best);

    // Show gratitude prompt after a brief pause
    setTimeout(() => setShowGratitude(true), 600);
  };

  const handleSaveGratitude = async () => {
    if (!user || !gratitudeText.trim()) return;
    setSavingGratitude(true);
    await saveGratitude(user.uid, gratitudeText.trim());
    setGratitudeSaved(true);
    setSavingGratitude(false);
    setShowGratitude(false);
    setGratitudeText('');
    // Refresh feed to include new gratitude
    loadFeed();
  };

  const skipGratitude = () => {
    setShowGratitude(false);
    loadFeed();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-outline font-body">Loading...</span>
      </div>
    );
  }

  const needsCheckin = todayAnswer === null;
  const needsGratitude = showGratitude && !gratitudeSaved;

  return (
    <>
      <TopNav />
      <main className="flex-1 pt-20 pb-32 px-6">

        {/* Check-in prompt */}
        {needsCheckin && (
          <section className="mb-8">
            <header className="mb-8 relative">
              <div className="absolute -top-12 -right-8 w-48 h-48 bg-secondary-container/20 organic-blob-1 -z-10 blur-2xl" />
              <h1 className="text-4xl font-bold leading-tight mb-3 text-on-surface font-headline">
                {habit}?
              </h1>
              <p className="text-on-surface-variant font-body">
                Check in for today.
              </p>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer('yes')}
                className="group flex flex-col items-center justify-center gap-3 transition-all duration-300 transform active:scale-95"
              >
                <div className="w-full aspect-[4/5] bg-secondary organic-blob-2 flex items-center justify-center shadow-lg group-hover:bg-secondary-dim transition-colors">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    spa
                  </span>
                </div>
                <span className="font-label font-semibold tracking-wider text-secondary">YES</span>
              </button>

              <button
                onClick={() => handleAnswer('no')}
                className="group flex flex-col items-center justify-center gap-3 transition-all duration-300 transform active:scale-95"
              >
                <div className="w-full aspect-square bg-surface-container organic-blob-1 flex items-center justify-center group-hover:bg-surface-container-highest transition-colors">
                  <span className="material-symbols-outlined text-outline text-4xl">
                    motion_photos_off
                  </span>
                </div>
                <span className="font-label font-semibold tracking-wider text-outline">NO</span>
              </button>
            </div>
          </section>
        )}

        {/* Just checked in confirmation */}
        {checkedInJustNow && todayAnswer && !needsGratitude && (
          <section className="mb-8 bg-secondary/10 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-secondary text-3xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
              {todayAnswer === 'yes' ? 'check_circle' : 'info'}
            </span>
            <p className="font-body font-semibold text-on-surface">
              {todayAnswer === 'yes' ? 'Logged. Keep growing.' : 'Logged. Tomorrow is a new day.'}
            </p>
          </section>
        )}

        {/* Gratitude prompt (appears after check-in) */}
        {needsGratitude && (
          <section className="mb-8 relative">
            <div className="bg-surface-container-low rounded-xl p-6 pt-10">
              <div className="absolute -top-4 left-6 bg-tertiary-fixed text-on-tertiary-fixed px-5 py-1.5 organic-blob-2 font-headline italic shadow-sm">
                Gratitude
              </div>
              <h3 className="text-xl font-bold mb-4 text-on-surface pt-2 font-headline">
                What are you grateful for today?
              </h3>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-body text-on-surface placeholder:text-outline-variant min-h-[100px] resize-none"
                placeholder="Today, I am thankful for..."
                autoFocus
              />
              <div className="h-1 w-full bg-surface-variant rounded-full mt-2">
                <div
                  className="h-full bg-secondary rounded-full transition-all"
                  style={{ width: `${Math.min(100, gratitudeText.length * 2)}%` }}
                />
              </div>
              <div className="mt-5 flex justify-between items-center">
                <button
                  onClick={skipGratitude}
                  className="text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleSaveGratitude}
                  disabled={savingGratitude || !gratitudeText.trim()}
                  className="bg-on-surface text-surface px-6 py-2.5 rounded-full font-label font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {savingGratitude ? '...' : 'Save'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Feed */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-headline font-bold text-on-surface">
              Today&rsquo;s Feed
            </h2>
            {!feedLoading && (
              <span className="text-xs font-body text-on-surface-variant">
                {feedItems.length} check-in{feedItems.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {feedLoading ? (
            <div className="text-center py-12">
              <span className="text-outline font-body">Loading feed...</span>
            </div>
          ) : feedItems.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">group</span>
              <p className="font-body text-on-surface-variant">
                No one has checked in yet today.
                {needsCheckin && ' Be the first.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedItems.map((item, i) => (
                <FeedCard
                  key={item.uid}
                  item={item}
                  style={CARD_STYLES[i % CARD_STYLES.length]}
                  isOwn={item.uid === user.uid}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
