import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'How It Works — Count on Me' };

export default function HowItWorks() {
  return (
    <div className="doc-page">
      <nav className="doc-nav">
        <Link href="/">Home</Link>
        <span className="doc-brand">Count on Me</span>
      </nav>
      <h1>How it works</h1>
      <p className="doc-intro">
        Count on Me is a shared accountability tracker. One yes-or-no question a day, tracked with a small group of friends.
      </p>

      <h2>1. Pick one habit</h2>
      <p>
        Choose a single habit you want to do every day &mdash; workout, read, meditate, cold plunge. One habit, not five.
      </p>

      <h2>2. Answer once a day</h2>
      <p>
        Every day, answer one question: <em>Did you do it?</em> Yes or no. No journals, no scores. Build your streak one day at a time.
      </p>

      <h2>3. Invite your people</h2>
      <p>
        Add a few friends to your group. Everyone sees each other&rsquo;s weekly check-ins and current streak. Gentle visibility, not pressure.
      </p>

      <h2>4. Nudge and celebrate</h2>
      <p>When a friend is slipping, send a nudge. When they hit a milestone, celebrate it. One tap.</p>

      <p style={{ marginTop: 32 }}>
        <Link href="/tracker">Try the tracker</Link>
      </p>
    </div>
  );
}
