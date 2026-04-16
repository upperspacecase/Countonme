'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';

// Feed will show real community data once circles are implemented.
// For now, show placeholder content with the design system.
const FEED_ITEMS = [
  {
    name: 'Julian M.',
    initial: 'J',
    habit: 'Meditate for 10 minutes',
    streak: 12,
    label: 'Atomic Goal',
    bg: 'bg-secondary-container',
    text: 'text-on-secondary-container',
    blob: 'organic-blob-1',
  },
  {
    name: 'Elena Joy',
    initial: 'E',
    habit: 'Read 20 pages',
    streak: 45,
    label: 'Deep Reading',
    bg: 'bg-primary-container',
    text: 'text-on-primary-container',
    blob: 'organic-blob-2',
  },
  {
    name: 'Marcus A.',
    initial: 'M',
    habit: 'Drink 500ml of water',
    streak: 9,
    label: 'Hydration',
    bg: 'bg-tertiary-container',
    text: 'text-on-tertiary-container',
    blob: 'organic-blob-3',
  },
  {
    name: 'Sofia Chen',
    initial: 'S',
    habit: 'Walk for 30 minutes',
    streak: 18,
    label: 'Movement',
    bg: 'bg-secondary',
    text: 'text-white',
    blob: 'organic-blob-2',
  },
];

export default function Feed() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

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
      <main className="pt-24 px-6">
        <div className="mb-8">
          <h2 className="text-4xl font-headline font-bold leading-tight text-on-surface">
            Community <span className="italic text-primary">Flow</span>
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-2">
            See how others are growing today.
          </p>
        </div>

        <div className="space-y-6">
          {FEED_ITEMS.map((item) => (
            <div key={item.name} className={`${item.bg} ${item.text} ${item.blob} p-8 shadow-sm min-h-[220px] flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-xs font-bold text-on-surface">
                    {item.initial}
                  </div>
                  <span className="text-xs font-bold font-body tracking-wider uppercase">{item.name}</span>
                </div>
                <div className="bg-surface-container-lowest/40 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">local_fire_department</span>
                  <span className="text-xs font-bold">{item.streak} days</span>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">{item.label}</p>
                <h3 className="text-2xl font-headline font-bold leading-tight">{item.habit}</h3>
              </div>
              <div className="mt-6">
                <button className="bg-surface-container-lowest/30 backdrop-blur-md rounded-full px-5 py-2 text-xs font-bold font-body hover:scale-105 transition-transform">
                  High Five
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
