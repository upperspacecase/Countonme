'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', icon: 'auto_awesome', label: 'Feed' },
  { href: '/me', icon: 'person', label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex justify-around items-center px-8 pb-8 pt-4 bg-surface/80 backdrop-blur-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[3rem]">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? 'flex flex-col items-center justify-center bg-teal-100/50 text-teal-800 rounded-full px-6 py-2 transition-all duration-500 ease-out active:scale-90 hover:scale-110'
                : 'flex flex-col items-center justify-center text-stone-400 px-6 py-2 transition-all duration-200 hover:scale-110 active:scale-90'
            }
          >
            <span
              className="material-symbols-outlined mb-0.5"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="font-body font-semibold tracking-tight text-[11px]">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
