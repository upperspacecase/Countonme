import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy — Simply Accountable' };

export default function Privacy() {
  return (
    <div className="doc-shell">
      <Link className="back" href="/">
        &larr; HOME
      </Link>
      <h1>Privacy</h1>
      <p>
        Short version: we collect as little as we can, we don&rsquo;t sell anything, and your check-ins are only visible
        to the friends in your group.
      </p>

      <h2>WHAT WE STORE</h2>
      <ul>
        <li>Your account email and display name</li>
        <li>Your habit name and daily yes/no answers</li>
        <li>The groups you belong to</li>
      </ul>

      <h2>WHAT WE DON&rsquo;T DO</h2>
      <ul>
        <li>No ads, ever</li>
        <li>No selling or sharing your data with third parties</li>
        <li>No tracking pixels on this site</li>
      </ul>

      <h2>THE WEB TRACKER</h2>
      <p>
        The web tracker stores your data in your browser&rsquo;s local storage &mdash; it never leaves your device.
      </p>

      <h2>CONTACT</h2>
      <p>privacy@simply-accountable.example</p>
    </div>
  );
}
