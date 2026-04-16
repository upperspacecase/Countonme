import Link from 'next/link';

export function TopNav({ leftIcon, leftHref }: { leftIcon?: string; leftHref?: string }) {
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-surface/80 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-4">
          {leftIcon && leftHref && (
            <Link href={leftHref}>
              <span className="material-symbols-outlined text-secondary hover:opacity-80 transition-opacity duration-300 cursor-pointer">
                {leftIcon}
              </span>
            </Link>
          )}
          <span className="text-2xl font-headline font-bold text-secondary tracking-tight">
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
