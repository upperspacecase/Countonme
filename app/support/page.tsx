import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Support — Simply Accountable' };

export default function Support() {
  return (
    <div className="doc-shell">
      <Link className="back" href="/">
        &larr; HOME
      </Link>
      <h1>Support</h1>
      <p>Questions, bugs, or a feature you want? We&rsquo;re a small team and we read everything.</p>

      <h2>EMAIL</h2>
      <p>hello@simply-accountable.example</p>

      <h2>RESET THE WEB TRACKER</h2>
      <p>
        The web tracker stores your data locally in your browser. To clear it, open DevTools &rarr; Application &rarr;
        Local Storage, and remove the <code>simply-accountable-v1</code> key.
      </p>

      <h2>PRIVACY</h2>
      <p>
        See our <Link href="/privacy">privacy page</Link> for what we store and why.
      </p>
    </div>
  );
}
