'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function CTA() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="cta-wrap" ref={wrapRef}>
      <button
        type="button"
        className="cta"
        aria-expanded={open}
        aria-controls="ctaMenu"
        onClick={() => setOpen((v) => !v)}
      >
        GET STARTED FOR FREE
        <svg className="cta-caret" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M2 5l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="cta-menu" id="ctaMenu" role="menu" hidden={!open}>
        <Link role="menuitem" href="/demo" onClick={() => setOpen(false)}>
          Watch the 30s demo
        </Link>
        <Link role="menuitem" href="/tracker" onClick={() => setOpen(false)}>
          Try the web tracker
        </Link>
        <a role="menuitem" href="#stores" onClick={() => setOpen(false)}>
          Get the app
        </a>
        <Link role="menuitem" href="/faq" onClick={() => setOpen(false)}>
          Read the FAQ
        </Link>
      </div>
    </div>
  );
}
