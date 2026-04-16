import Link from 'next/link';

export function TopNav({ leftIcon, leftHref }: { leftIcon?: string; leftHref?: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffcf7]/80 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4">
          {leftIcon && leftHref && (
            <Link href={leftHref}>
              <span className="material-symbols-outlined text-[#2593A1] hover:opacity-80 transition-opacity duration-300 cursor-pointer">
                {leftIcon}
              </span>
            </Link>
          )}
          <span className="text-2xl font-headline font-bold text-[#2593A1] tracking-tight">
            Organic Habits
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/me">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-surface-container-highest">
              <span className="text-sm font-bold text-on-secondary-container">B</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
