import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Feed — Organic Habits' };

export default function Feed() {
  return (
    <>
      <TopNav leftIcon="menu" leftHref="/" />
      <main className="pt-24 px-6">
        {/* Feed Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-headline font-bold leading-tight text-on-surface">
            Community <span className="italic text-primary">Flow</span>
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-2">
            See how others are growing today.
          </p>
        </div>

        {/* Community Feed */}
        <div className="relative space-y-12">
          {/* Card 1: Morning Meditation */}
          <div className="relative group">
            <div className="absolute -top-4 -left-2 w-12 h-12 bg-tertiary-container organic-blob-3 opacity-20 group-hover:scale-125 transition-transform duration-700" />
            <div className="bg-secondary-container organic-blob-1 p-8 text-on-secondary-container shadow-sm relative z-10 overflow-hidden min-h-[320px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-xs font-bold">
                    J
                  </div>
                  <span className="text-xs font-bold font-body tracking-wider uppercase">Julian M.</span>
                </div>
                <div className="bg-surface-container-lowest/40 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">local_fire_department</span>
                  <span className="text-xs font-bold">12 Day Streak</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Atomic Goal</p>
                <h3 className="text-3xl font-headline font-bold leading-tight">Meditate for 10 minutes</h3>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <button className="bg-on-secondary-container text-secondary-container rounded-full px-5 py-2 text-xs font-bold font-body hover:scale-105 transition-transform">
                  High Five
                </button>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-secondary-container bg-primary-container flex items-center justify-center text-[8px] font-bold text-on-primary-container">A</div>
                  <div className="w-6 h-6 rounded-full border-2 border-secondary-container bg-tertiary-container flex items-center justify-center text-[8px] font-bold text-on-tertiary-container">K</div>
                  <div className="w-6 h-6 rounded-full border-2 border-secondary-container bg-surface-container-highest flex items-center justify-center text-[8px] font-bold">+8</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Deep Reading */}
          <div className="relative group mt-[-2rem] ml-4">
            <div className="bg-primary-container organic-blob-2 p-10 text-on-primary-container shadow-sm relative z-10 overflow-hidden min-h-[300px] flex flex-col justify-center text-center">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface-container-lowest/30 backdrop-blur-md px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold font-body uppercase tracking-widest">Elena Joy</span>
              </div>
              <div className="mb-4">
                <span className="material-symbols-outlined text-4xl mb-2">auto_stories</span>
                <h3 className="text-3xl font-headline font-bold leading-tight">Read 20 pages</h3>
                <p className="text-sm font-bold font-body mt-2 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  45 Day Streak
                </p>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-on-primary-container/20 flex items-center justify-center hover:bg-on-primary-container/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">favorite</span>
                  </div>
                  <span className="text-[10px] font-bold">24</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-on-primary-container/20 flex items-center justify-center hover:bg-on-primary-container/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </div>
                  <span className="text-[10px] font-bold">Show Gratitude</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Morning Hydration */}
          <div className="relative group mt-[-3rem]">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-secondary-fixed organic-blob-1 opacity-30 group-hover:rotate-12 transition-transform duration-1000" />
            <div className="bg-tertiary-container organic-blob-3 p-8 text-on-tertiary-container shadow-sm relative z-10 min-h-[280px] flex flex-col items-start">
              <div className="w-full flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full border-2 border-on-tertiary-container/30 bg-surface-container-lowest flex items-center justify-center text-sm font-bold">
                  M
                </div>
                <div className="bg-on-tertiary-container text-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                  9 Day Streak
                </div>
              </div>
              <h3 className="text-4xl font-headline font-bold leading-tight mb-2">Drink 500ml of water</h3>
              <p className="text-xs font-bold font-body opacity-80 uppercase tracking-widest">&mdash; Marcus Aurelius V.</p>
              <div className="mt-auto w-full flex justify-end pt-6">
                <div className="w-14 h-14 bg-surface-container-lowest organic-blob-1 flex items-center justify-center text-on-tertiary-container shadow-xl cursor-pointer hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Evening Walk */}
          <div className="relative group mt-[-1rem] mr-8">
            <div className="bg-secondary p-8 organic-blob-2 text-white shadow-lg relative z-10 min-h-[320px] overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-secondary-container/20 organic-blob-1" />
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">directions_walk</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Sofia Chen</p>
                  <p className="text-[10px] font-medium opacity-60">2 hours ago</p>
                </div>
              </div>
              <h3 className="text-3xl font-headline font-bold leading-tight mb-4">Walk for 30 minutes in nature</h3>
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest">Progress</span>
                  <span className="text-[11px] font-bold">18 Day Streak</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-container h-full w-[60%] rounded-full" />
                </div>
              </div>
              <div className="mt-8 flex gap-2">
                <button className="flex-1 bg-white text-secondary rounded-full py-3 text-xs font-bold font-body transition-all hover:bg-secondary-container hover:text-on-secondary-container">
                  Cheer On
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-32 z-50 w-16 h-16 bg-primary text-white organic-blob-1 shadow-[0_12px_40px_rgba(182,53,58,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300" style={{ right: 'max(24px, calc(50% - 215px + 24px))' }}>
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <BottomNav />
    </>
  );
}
