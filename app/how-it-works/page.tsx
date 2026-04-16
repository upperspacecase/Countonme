import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'How It Works — Simply Accountable' };

export default function HowItWorks() {
  return (
    <div className="doc-shell">
      <Link className="back" href="/">
        &larr; HOME
      </Link>
      <h1>How it works</h1>
      <p>
        Simply Accountable is a shared accountability tracker. One yes-or-no question a day, tracked with a small group of
        friends.
      </p>

      <h2>1. PICK ONE HABIT</h2>
      <p>
        Choose a single habit you want to do every day &mdash; workout, read, meditate, cold plunge, whatever. One habit,
        not five.
      </p>

      <h2>2. ANSWER ONCE A DAY</h2>
      <p>
        Every day, answer one question: <em>Did you do it?</em> Yes or no. That&rsquo;s it. No journals, no scores, no
        streaks you&rsquo;re afraid to check.
      </p>

      <h2>3. INVITE YOUR PEOPLE</h2>
      <p>
        Add a few friends to your group. Everyone sees each other&rsquo;s weekly check-ins and current streak. Gentle
        visibility. No pressure, just presence.
      </p>

      <h2>4. NUDGE &amp; CELEBRATE</h2>
      <p>When a friend is slipping, send a nudge. When they hit a milestone, celebrate it. The app makes this one tap.</p>

      <p style={{ marginTop: 28 }}>
        <Link className="back" href="/tracker">
          &rarr; Try the web tracker
        </Link>
      </p>
    </div>
  );
}
