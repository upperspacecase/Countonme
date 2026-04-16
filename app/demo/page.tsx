import Link from 'next/link';
import type { Metadata } from 'next';
import { DemoPlayer } from '@/components/demo/DemoPlayer';

export const metadata: Metadata = { title: 'Demo — Count on Me' };

export default function DemoPage() {
  return (
    <div className="demo-page">
      <nav className="demo-nav">
        <Link href="/">Home</Link>
        <span className="demo-brand">Count on Me</span>
      </nav>
      <h1>See it in action</h1>
      <p className="demo-sub">A 30-second walkthrough of how Count on Me works.</p>
      <div className="demo-player">
        <DemoPlayer />
      </div>
      <div className="demo-footer">
        <Link href="/tracker">Try the tracker</Link>
      </div>
    </div>
  );
}
