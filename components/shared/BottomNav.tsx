'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', icon: 'eco', label: 'Habits' },
  { href: '/feed', icon: 'auto_awesome_motion', label: 'Feed' },
  { href: '/circles', icon: 'group', label: 'Circles' },
  { href: '/me', icon: 'person', label: 'Me' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-surface/90 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-8px_30px_rgb(56,56,53,0.04)]">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? 'flex flex-col items-center justify-center bg-secondary text-white rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] px-5 py-2 scale-110 transition-all duration-500 ease-out shadow-lg shadow-[#2593A1]/20'
                : 'flex flex-col items-center justify-center text-on-surface/50 px-4 py-2 hover:text-secondary transition-colors'
            }
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="font-sans text-[11px] font-semibold tracking-wide uppercase mt-1">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
