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

const CARD_STYLES = [
  { bg: 'bg-primary-container', text: 'text-on-primary-container', blob: 'organic-blob-2', hover: 'hover:-rotate-1' },
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container', blob: 'organic-blob-3', hover: 'hover:rotate-1' },
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', blob: 'organic-blob-1', hover: 'hover:-rotate-2' },
  { bg: 'bg-secondary', text: 'text-white', blob: 'organic-blob-2', hover: 'hover:rotate-1' },
];

const CARD_OFFSETS = ['', 'mt-[-2rem] ml-4', 'mt-[-1.5rem] mr-6', 'mt-[-1rem]'];

function FeedCard({ item, index, isOwn }: { item: FeedItem; index: number; isOwn: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const style = CARD_STYLES[index % CARD_STYLES.length];
  const offset = CARD_OFFSETS[index % CARD_OFFSETS.length];
  const hasGratitude = !!item.gratitude;

  return (
    <article className={`relative group ${offset}`}>
      <div
        className="cursor-pointer"
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
            className={`${style.bg} ${style.blob} p-6 transition-transform ${style.hover} shadow-sm`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-background flex items-center justify-center text-base font-bold text-on-surface">
                {item.displayName[0]}
              </div>
              <div>
                <h4 className={`font-bold ${style.text}`}>{isOwn ? 'You' : item.displayName}</h4>
                <p className="text-sm opacity-80">Today</p>
              </div>
            </div>
            <div className="bg-background/40 backdrop-blur-sm rounded-lg p-5 mb-4">
              <p className={`headline-serif italic text-2xl ${style.text}`}>
                &ldquo;{item.habit}&rdquo;
              </p>
            </div>
            <div className="flex justify-between items-center px-2">
              <div className={`flex items-center gap-1 ${style.text} opacity-80`}>
                {item.streak > 0 && (
                  <>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      local_fire_department
                    </span>
                    <span className="font-bold">{item.streak} Day Streak</span>
                  </>
                )}
                {item.answer === 'yes' && (
                  <span className="material-symbols-outlined text-sm ml-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                )}
              </div>
              {hasGratitude && (
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-surface-container-lowest/40 flex items-center justify-center text-xs border-2 border-current/10">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Back (gratitude) */}
          <div
            className={`${style.bg} ${style.blob} p-6 shadow-sm absolute inset-0 flex flex-col justify-between`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center gap-2 opacity-70">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="text-xs font-bold uppercase tracking-widest">
                {isOwn ? 'Your' : `${item.displayName}'s`} gratitude
              </span>
            </div>
            <div className="bg-background/40 backdrop-blur-sm rounded-lg p-5">
              <p className={`headline-serif italic text-xl ${style.text} leading-relaxed`}>
                &ldquo;{item.gratitude}&rdquo;
              </p>
            </div>
            <div className={`flex items-center gap-1 opacity-50 ${style.text}`}>
              <span className="material-symbols-outlined text-sm">touch_app</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [todayAnswer, setTodayAnswer] = useState<'yes' | 'no' | null>(null);
  const [showGratitude, setShowGratitude] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [gratitudeSaved, setGratitudeSaved] = useState(false);
  const [savingGratitude, setSavingGratitude] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [habit, setHabit] = useState('Show up today');

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

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
    await saveCheckin(user.uid, todayKey, answer);

    const profile = await getUserProfile(user.uid);
    const newStreak = answer === 'yes' ? (profile?.streak || 0) + 1 : 0;
    const best = Math.max(newStreak, profile?.bestStreak || 0);
    await updateStreak(user.uid, newStreak, best);

    setTimeout(() => setShowGratitude(true), 500);
  };

  const handleSaveGratitude = async () => {
    if (!user || !gratitudeText.trim()) return;
    setSavingGratitude(true);
    await saveGratitude(user.uid, gratitudeText.trim());
    setGratitudeSaved(true);
    setSavingGratitude(false);
    setShowGratitude(false);
    setGratitudeText('');
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
      <main className="pt-24 px-6 pb-32">
        {/* Check-in Section */}
        {needsCheckin && (
          <section className="mb-12">
            <div className="bg-surface-container-low organic-blob-1 p-8 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl" />
              <h2 className="headline-serif italic text-3xl mb-6 text-on-surface">Did you do it today?</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleAnswer('yes')}
                  className="group flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>Yes</span>
                </button>
                <button
                  onClick={() => handleAnswer('no')}
                  className="group flex items-center gap-2 bg-surface-container-highest text-on-surface-variant px-8 py-4 rounded-full font-semibold transition-all hover:bg-surface-dim active:scale-95"
                >
                  <span className="material-symbols-outlined">close</span>
                  <span>Not yet</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Gratitude Prompt */}
        {needsGratitude && (
          <section className="mb-12">
            <div className="bg-surface-container-low organic-blob-2 p-8 relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-tertiary-container/20 rounded-full blur-3xl" />
              <h2 className="headline-serif italic text-2xl mb-4 text-on-surface">What are you grateful for?</h2>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                className="w-full bg-background/60 backdrop-blur-sm rounded-lg p-4 border-none focus:ring-0 text-lg font-body text-on-surface placeholder:text-outline-variant min-h-[100px] resize-none"
                placeholder="Today, I am thankful for..."
                autoFocus
              />
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => { setShowGratitude(false); loadFeed(); }}
                  className="text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Skip
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
        <section className="space-y-12">
          <header className="flex justify-between items-end px-2">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Community</span>
              <h3 className="headline-serif italic text-4xl">The Flow</h3>
            </div>
          </header>

          {feedLoading ? (
            <div className="text-center py-12">
              <span className="text-outline font-body">Loading...</span>
            </div>
          ) : feedItems.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low organic-blob-1">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">group</span>
              <p className="font-body text-on-surface-variant px-8">
                No one has checked in yet today.{needsCheckin && ' Be the first.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {feedItems.map((item, i) => (
                <FeedCard key={item.uid} item={item} index={i} isOwn={item.uid === user.uid} />
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
