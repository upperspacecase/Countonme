'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';

const CIRCLES = [
  { name: 'Morning Risers', members: 8, color: 'bg-secondary-container', textColor: 'text-on-secondary-container' },
  { name: 'Mindful Readers', members: 5, color: 'bg-tertiary-container', textColor: 'text-on-tertiary-container' },
  { name: 'Daily Movers', members: 12, color: 'bg-primary-container', textColor: 'text-on-primary-container' },
];

export default function Circles() {
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
        <h1 className="text-4xl font-headline font-bold leading-tight text-on-surface mb-4">
          Growth Circles
        </h1>
        <p className="text-on-surface-variant font-body text-lg mb-12">
          Find your people. Grow together.
        </p>

        <div className="space-y-4">
          {CIRCLES.map((circle) => (
            <div
              key={circle.name}
              className={`${circle.color} ${circle.textColor} organic-blob-2 p-8 min-h-[140px] flex flex-col justify-between shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-headline font-bold">{circle.name}</h3>
                <span className="text-xs font-bold font-body uppercase tracking-wider opacity-70">
                  {circle.members} members
                </span>
              </div>
              <div className="flex -space-x-2 mt-4">
                {Array.from({ length: Math.min(circle.members, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-current/10 bg-surface-container-lowest flex items-center justify-center text-[10px] font-bold text-on-surface"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {circle.members > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-current/10 bg-surface-container-highest flex items-center justify-center text-[8px] font-bold text-on-surface">
                    +{circle.members - 4}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
