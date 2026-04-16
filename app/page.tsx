import { TopNav } from '@/components/shared/TopNav';
import { BottomNav } from '@/components/shared/BottomNav';

export default function Home() {
  return (
    <>
      <TopNav leftIcon="close" leftHref="/" />
      <main className="flex-1 pt-24 pb-32 px-6">
        {/* Header */}
        <header className="mb-12 relative">
          <div className="absolute -top-12 -right-8 w-48 h-48 bg-secondary-container/20 organic-blob-1 -z-10 blur-2xl" />
          <h1 className="text-5xl font-bold leading-tight mb-4 text-on-surface">
            Did you show up today?
          </h1>
          <p className="text-on-surface-variant font-body text-lg">
            Every small step is a seed planted for tomorrow&rsquo;s growth.
          </p>
        </header>

        {/* Response Shapes */}
        <section className="grid grid-cols-2 gap-6 mb-16 items-end">
          <button className="group flex flex-col items-center justify-center gap-4 transition-all duration-300 transform active:scale-95">
            <div className="w-full aspect-[4/5] bg-secondary organic-blob-2 flex items-center justify-center shadow-lg group-hover:bg-secondary-dim transition-colors">
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                spa
              </span>
            </div>
            <span className="font-label font-semibold text-lg tracking-wider text-secondary">YES</span>
          </button>

          <button className="group flex flex-col items-center justify-center gap-4 transition-all duration-300 transform active:scale-95">
            <div className="w-full aspect-square bg-surface-container organic-blob-1 flex items-center justify-center group-hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-outline text-5xl">
                motion_photos_off
              </span>
            </div>
            <span className="font-label font-semibold text-lg tracking-wider text-outline">NO</span>
          </button>
        </section>

        {/* Gratitude Section */}
        <section className="relative">
          <div className="bg-surface-container-low rounded-xl p-8 pt-10">
            <div className="absolute -top-4 left-8 bg-tertiary-fixed text-on-tertiary-fixed px-6 py-2 organic-blob-2 font-headline italic text-lg shadow-sm">
              Gratitude Journal
            </div>
            <h3 className="text-2xl font-bold mb-6 text-on-surface pt-4">
              What are you grateful for?
            </h3>
            <div className="relative">
              <textarea
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-xl font-body text-on-surface placeholder:text-outline-variant min-h-[160px] resize-none"
                placeholder="Today, I am thankful for..."
              />
              <div className="h-1 w-full bg-surface-variant rounded-full mt-2">
                <div className="h-full w-1/3 bg-secondary rounded-full" />
              </div>
            </div>
            <div className="mt-8 flex justify-between items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-container organic-blob-1 border-2 border-surface" />
                <div className="w-8 h-8 rounded-full bg-secondary-container organic-blob-2 border-2 border-surface" />
                <div className="w-8 h-8 rounded-full bg-tertiary-container organic-blob-1 border-2 border-surface" />
              </div>
              <button className="bg-on-surface text-surface px-8 py-3 rounded-full font-label font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                SAVE ENTRY
              </button>
            </div>
          </div>

          {/* Decorative Quote */}
          <div className="mt-12 flex items-center gap-6 overflow-hidden">
            <div className="flex-shrink-0 w-32 h-40 bg-surface-container-highest rounded-lg overflow-hidden rotate-[-4deg] shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-tertiary-fixed/30" />
            </div>
            <div className="flex-1 italic text-on-surface-variant font-headline text-lg">
              &ldquo;Small deeds done are better than great deeds planned.&rdquo;
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
