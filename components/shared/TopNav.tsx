'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname();
  const isProfile = pathname === '/me';

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-surface/80 backdrop-blur-xl">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-700">self_care</span>
          <h1 className="text-2xl headline-serif italic text-rose-800">Living Canvas</h1>
        </div>
        {isProfile ? (
          <button className="p-2 rounded-full hover:bg-stone-100/50 transition-colors active:scale-95 duration-300">
            <span className="material-symbols-outlined text-stone-500">settings</span>
          </button>
        ) : (
          <button className="p-2 rounded-full hover:bg-stone-100/50 transition-colors active:scale-95 duration-300">
            <span className="material-symbols-outlined text-stone-500">notifications</span>
          </button>
        )}
      </div>
    </header>
  );
}
