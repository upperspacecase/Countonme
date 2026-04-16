import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'FAQ — Simply Accountable' };

export default function FAQ() {
  return (
    <div className="doc-shell">
      <Link className="back" href="/">
        &larr; HOME
      </Link>
      <h1>FAQ</h1>

      <h2>IS IT FREE?</h2>
      <p>Yes. The core tracker and groups up to 5 friends are free, forever.</p>

      <h2>CAN I TRACK MORE THAN ONE HABIT?</h2>
      <p>
        Not yet &mdash; and on purpose. The app is built around one question a day. One habit is easier to keep than
        five.
      </p>

      <h2>WHAT IF I FORGET A DAY?</h2>
      <p>You can still answer for yesterday, but not earlier. Streaks stay honest.</p>

      <h2>DO MY FRIENDS SEE MY ANSWERS?</h2>
      <p>
        Only the friends in your group. They see your yes/no for each day and your current streak &mdash; nothing else.
      </p>

      <h2>CAN I LEAVE A GROUP?</h2>
      <p>Anytime. Your data stays yours.</p>

      <h2>IS THERE A WEB VERSION?</h2>
      <p>
        Yes &mdash; <Link href="/tracker">try the web tracker</Link>. Your data is stored in your browser only.
      </p>
    </div>
  );
}
