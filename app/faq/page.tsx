import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'FAQ — Count on Me' };

export default function FAQ() {
  return (
    <div className="doc-page">
      <nav className="doc-nav">
        <Link href="/">Home</Link>
        <span className="doc-brand">Count on Me</span>
      </nav>
      <h1>FAQ</h1>
      <p className="doc-intro">Common questions about Count on Me.</p>

      <h2>Is it free?</h2>
      <p>Yes. The core tracker and groups up to 5 friends are free, forever.</p>

      <h2>Can I track more than one habit?</h2>
      <p>
        Not yet &mdash; and on purpose. The app is built around one question a day. One habit is easier to keep than five.
      </p>

      <h2>What if I forget a day?</h2>
      <p>You can still answer for yesterday, but not earlier. Streaks stay honest.</p>

      <h2>Do my friends see my answers?</h2>
      <p>
        Only the friends in your group. They see your yes/no for each day and your current streak &mdash; nothing else.
      </p>

      <h2>Can I leave a group?</h2>
      <p>Anytime. Your data stays yours.</p>

      <h2>Is there a web version?</h2>
      <p>
        Yes &mdash; <Link href="/tracker">try the web tracker</Link>. Your data is stored in your browser only.
      </p>
    </div>
  );
}
