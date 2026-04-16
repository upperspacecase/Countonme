import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy — Count on Me' };

export default function Privacy() {
  return (
    <div className="doc-page">
      <nav className="doc-nav">
        <Link href="/">Home</Link>
        <span className="doc-brand">Count on Me</span>
      </nav>
      <h1>Privacy</h1>
      <p className="doc-intro">
        Short version: we collect as little as we can, we don&rsquo;t sell anything, and your check-ins are only visible to the friends in your group.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>Your account email and display name</li>
        <li>Your habit name and daily yes/no answers</li>
        <li>The groups you belong to</li>
      </ul>

      <h2>What we don&rsquo;t do</h2>
      <ul>
        <li>No ads, ever</li>
        <li>No selling or sharing your data with third parties</li>
        <li>No tracking pixels on this site</li>
      </ul>

      <h2>The web tracker</h2>
      <p>
        The web tracker stores your data in your browser&rsquo;s local storage &mdash; it never leaves your device.
      </p>

      <h2>Contact</h2>
      <p>privacy@countonme.app</p>
    </div>
  );
}
