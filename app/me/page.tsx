import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Profile — Organic Habits' };

const ACTIVITY_COLORS = [
  'bg-secondary', 'bg-secondary-fixed', 'bg-surface-container', 'bg-secondary-fixed-dim',
  'bg-secondary', 'bg-secondary', 'bg-secondary-fixed', 'bg-surface-container',
  'bg-tertiary-fixed', 'bg-tertiary-fixed-dim', 'bg-surface-container', 'bg-secondary',
  'bg-secondary', 'bg-secondary-fixed',
  'bg-surface-container', 'bg-secondary-fixed', 'bg-secondary', 'bg-secondary',
  'bg-secondary-fixed-dim', 'bg-secondary', 'bg-surface-container', 'bg-secondary',
  'bg-secondary', 'bg-surface-container', 'bg-tertiary-fixed', 'bg-secondary',
  'bg-secondary-fixed', 'bg-secondary',
  'bg-secondary-fixed', 'bg-secondary', 'bg-surface-container', 'bg-secondary-fixed-dim',
  'bg-secondary', 'bg-secondary', 'bg-secondary-fixed', 'bg-surface-container',
  'bg-tertiary-fixed', 'bg-tertiary-fixed-dim', 'bg-surface-container', 'bg-secondary',
  'bg-secondary', 'bg-secondary-fixed',
  'bg-surface-container', 'bg-secondary-fixed', 'bg-secondary', 'bg-secondary',
  'bg-secondary-fixed-dim', 'bg-secondary', 'bg-surface-container', 'bg-secondary',
  'bg-secondary', 'bg-surface-container', 'bg-tertiary-fixed', 'bg-secondary',
  'bg-secondary-fixed', 'bg-secondary',
];

const CIRCLES = [
  { initial: 'M', bg: 'bg-primary' },
  { initial: 'W', bg: 'bg-secondary' },
  { initial: 'R', bg: 'bg-tertiary' },
];

export default function Me() {
  return (
    <>
      <TopNav leftIcon="search" leftHref="/" />
      <main className="pt-24 px-6">
        {/* Hero Section */}
        <section className="mb-12 relative">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl font-headline font-bold text-on-surface leading-tight mb-2">
            Becca&rsquo;s Growth
          </h1>
          <p className="text-on-surface-variant font-body">Cultivating mindfulness since April 2023</p>

          {/* Primary Goal */}
          <div className="mt-8 relative overflow-hidden bg-secondary text-white p-8 rounded-xl rounded-tr-[5rem] rounded-bl-[4rem]">
            <div className="relative z-10">
              <span className="text-xs font-label uppercase tracking-widest opacity-80">Active Focus</span>
              <h2 className="text-2xl font-headline font-bold mt-1 mb-4">Mindful Morning Tea</h2>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4" />
                </div>
                <span className="text-sm font-label font-bold">18/24 Days</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-surface-container-low p-6 rounded-lg border-b-4 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-primary">local_fire_department</span>
              <span className="text-[10px] font-label font-bold uppercase text-primary/60">Current</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">
              12 <span className="text-sm font-body font-normal text-on-surface-variant">days</span>
            </div>
            <p className="text-[11px] font-body mt-1">Longest: 42 days</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg border-b-4 border-tertiary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-tertiary">eco</span>
              <span className="text-[10px] font-label font-bold uppercase text-tertiary/60">Points</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">2,480</div>
            <p className="text-[11px] font-body mt-1">Next badge at 3k</p>
          </div>
        </section>

        {/* Activity Grid */}
        <section className="mb-12 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="font-headline text-xl font-bold">Activity Pulse</h3>
              <p className="text-xs text-on-surface-variant">Your energy across the last 14 weeks</p>
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-surface-container" />
              <div className="w-3 h-3 rounded-full bg-secondary-fixed" />
              <div className="w-3 h-3 rounded-full bg-secondary" />
            </div>
          </div>
          <div className="activity-grid">
            {ACTIVITY_COLORS.map((color, i) => (
              <div key={i} className={`activity-cell ${color}`} />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            <span>Nov 2023</span>
            <span>Jan 2024</span>
          </div>
        </section>

        {/* Growth Circles */}
        <section className="mb-12">
          <h3 className="font-headline text-xl font-bold mb-6 px-2">Growth Circles</h3>
          <div className="flex -space-x-4">
            {CIRCLES.map((c) => (
              <div
                key={c.initial}
                className={`w-16 h-16 rounded-full border-4 border-surface ${c.bg} flex items-center justify-center text-white font-bold text-lg`}
              >
                {c.initial}
              </div>
            ))}
            <div className="w-16 h-16 rounded-full border-4 border-surface bg-surface-container-highest flex items-center justify-center">
              <span className="text-sm font-bold text-on-surface">+12</span>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
