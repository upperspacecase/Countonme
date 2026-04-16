'use client';

import { useRef, useState } from 'react';

const NUDGE = [
  'Nudge sent to Alex P. — "You got this!"',
  'Nudge sent to Jordan — "One check-in at a time."',
  'Nudge sent to Sam — "Don\u2019t break the streak!"',
];
const CELEBRATE = [
  'Cheers sent to Alex P. — 5 days strong! \u{1F44F}',
  'Cheers sent to Jordan — Week complete! \u{1F38A}',
  'Cheers sent to Sam — Personal best! \u{1F31F}',
];

export function EncourageButtons() {
  const [status, setStatus] = useState('');
  const nudgeIdx = useRef(0);
  const celebrateIdx = useRef(0);

  const fire = (kind: 'nudge' | 'celebrate') => {
    const pool = kind === 'nudge' ? NUDGE : CELEBRATE;
    const counter = kind === 'nudge' ? nudgeIdx : celebrateIdx;
    const msg = pool[counter.current % pool.length];
    counter.current += 1;
    setStatus(msg);
  };

  return (
    <>
      <div className="encourage-buttons">
        <button className="pill pill-nudge" type="button" onClick={() => fire('nudge')}>
          <span className="pill-emoji" aria-hidden>🔥</span> NUDGE FRIEND
        </button>
        <button
          className="pill pill-celebrate"
          type="button"
          onClick={() => fire('celebrate')}
        >
          <span className="pill-emoji" aria-hidden>👏</span> CELEBRATE WINS
        </button>
      </div>
      <p className="encourage-status" role="status" aria-live="polite">
        {status}
      </p>
    </>
  );
}
