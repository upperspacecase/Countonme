import Link from 'next/link';
import type { Metadata } from 'next';
import { DemoPlayer } from '@/components/demo/DemoPlayer';

export const metadata: Metadata = {
  title: 'Watch the Demo — Simply Accountable',
};

export default function DemoPage() {
  return (
    <div className="demo-shell">
      <div className="demo-card">
        <div className="app-top">
          <Link href="/">&larr; HOME</Link>
          <span className="brand-mark" style={{ fontSize: 12 }}>
            SIMPLY ACCOUNTABLE.
          </span>
        </div>

        <p className="app-date">BUILT WITH REMOTION</p>
        <h1 className="app-question">Watch the demo.</h1>
        <p style={{ color: 'var(--muted)', margin: '0 0 8px' }}>
          A 30-second animated walkthrough, composed in React and played live in your browser with
          @remotion/player.
        </p>

        <DemoPlayer />

        <div className="demo-meta">
          <span>30s &middot; 1280&times;720 &middot; 30fps</span>
          <span>
            <Link href="/tracker">or try the interactive web tracker &rarr;</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
