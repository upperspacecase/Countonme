import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Support — Count on Me' };

export default function Support() {
  return (
    <div className="doc-page">
      <nav className="doc-nav">
        <Link href="/">Home</Link>
        <span className="doc-brand">Count on Me</span>
      </nav>
      <h1>Support</h1>
      <p className="doc-intro">Questions, bugs, or a feature request? We read everything.</p>

      <h2>Email</h2>
      <p>hello@countonme.app</p>

      <h2>Reset the web tracker</h2>
      <p>
        The web tracker stores your data locally in your browser. To clear it, open DevTools, go to Application, then Local Storage, and remove the <code>simply-accountable-v1</code> key.
      </p>

      <h2>Privacy</h2>
      <p>
        See our <Link href="/privacy">privacy page</Link> for what we store and why.
      </p>
    </div>
  );
}
