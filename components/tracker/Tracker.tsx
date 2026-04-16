'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Answer = 'yes' | 'no';
type State = { habit: string; answers: Record<string, Answer> };

const STORAGE_KEY = 'simply-accountable-v1';
const DEFAULT_HABIT = 'Did you do it today?';
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfWeek = (d: Date) => {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay());
  return out;
};
const addDays = (d: Date, n: number) => {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
};

const FRIENDS = [
  { name: 'Alex P.', streak: 5, color: '#F4B6A0' },
  { name: 'Jordan', streak: 12, color: '#F0D28A' },
  { name: 'Sam', streak: 3, color: '#B7C8F2' },
  { name: 'Riley', streak: 0, color: '#B4DDB0' },
];

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden>
    <path d="M5 10.5l3 3 7-7" fill="none" stroke="#1c3b2e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 20 20" aria-hidden>
    <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="#7a2f2a" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
const Avatar = ({ color }: { color: string }) => (
  <svg className="avatar" viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="16" r="15" fill={color} stroke="#2b2b2b" strokeWidth={1.2} />
    <circle cx="16" cy="13" r="5" fill="#2b2b2b" />
    <path d="M5 27 c 4 -8 18 -8 22 0" fill="#2b2b2b" />
  </svg>
);

export function Tracker() {
  const [state, setState] = useState<State>({ habit: DEFAULT_HABIT, answers: {} });
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [habitDraft, setHabitDraft] = useState('');

  // Today is stable for the lifetime of the page view.
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayKey = toKey(today);

  // Hydrate from localStorage after mount (avoids SSR/CSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        const next: State = {
          habit: parsed.habit || DEFAULT_HABIT,
          answers: parsed.answers || {},
        };
        setState(next);
        setHabitDraft(next.habit === DEFAULT_HABIT ? '' : next.habit);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on change, but only after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  }, []);

  const onAnswer = (answer: Answer) => {
    setState((prev) => {
      const next = { ...prev, answers: { ...prev.answers } };
      if (next.answers[todayKey] === answer) {
        delete next.answers[todayKey];
        flashToast('Cleared today\u2019s check-in.');
      } else {
        next.answers[todayKey] = answer;
        flashToast(
          answer === 'yes' ? 'Nice — logged for today.' : 'Logged as no. Tomorrow\u2019s a new day.'
        );
      }
      return next;
    });
  };

  const saveHabit = () => {
    const val = habitDraft.trim();
    setState((prev) => ({ ...prev, habit: val || DEFAULT_HABIT }));
    flashToast('Habit saved.');
  };

  // Derived values.
  const question = useMemo(() => {
    const label = state.habit?.trim() || DEFAULT_HABIT;
    return label.endsWith('?') ? label : `${label} today?`;
  }, [state.habit]);

  const weekDays = useMemo(() => {
    const sun = startOfWeek(today);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(sun, i);
      return { d, key: toKey(d), wd: WEEKDAYS[i] };
    });
  }, [today]);

  const streak = useMemo(() => {
    let n = 0;
    let cursor = new Date(today);
    while (state.answers[toKey(cursor)] === 'yes') {
      n += 1;
      cursor = addDays(cursor, -1);
    }
    return n;
  }, [state.answers, today]);

  const best = useMemo(() => {
    const keys = Object.keys(state.answers)
      .filter((k) => state.answers[k] === 'yes')
      .sort();
    let b = 0;
    let run = 0;
    let prev: Date | null = null;
    for (const k of keys) {
      const d = new Date(k);
      if (prev && d.getTime() - prev.getTime() === 86400000) run += 1;
      else run = 1;
      if (run > b) b = run;
      prev = d;
    }
    return b;
  }, [state.answers]);

  const totalYes = useMemo(
    () => Object.values(state.answers).filter((v) => v === 'yes').length,
    [state.answers]
  );

  const todayAnswer: Answer | undefined = state.answers[todayKey];

  const fmtDate = today
    .toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();

  return (
    <div className="app-shell">
      <div className="app-card">
        <div className="app-top">
          <Link href="/">&larr; HOME</Link>
          <span className="brand-mark" style={{ fontSize: 12 }}>
            SIMPLY ACCOUNTABLE.
          </span>
        </div>

        <p className="app-date">{fmtDate}</p>
        <h1 className="app-question">{question}</h1>

        <div className="answer-row" role="group" aria-label="Today's answer">
          <button
            className={`answer yes${todayAnswer === 'yes' ? ' active' : ''}`}
            type="button"
            onClick={() => onAnswer('yes')}
          >
            YES
          </button>
          <button
            className={`answer no${todayAnswer === 'no' ? ' active' : ''}`}
            type="button"
            onClick={() => onAnswer('no')}
          >
            NO
          </button>
        </div>

        <div className="habit-edit">
          <input
            type="text"
            maxLength={64}
            placeholder="Your habit (e.g. Workout, Read 10 pages)"
            aria-label="Habit"
            value={habitDraft}
            onChange={(e) => setHabitDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                saveHabit();
              }
            }}
          />
          <button className="btn-ghost" type="button" onClick={saveHabit}>
            SAVE HABIT
          </button>
        </div>

        <h2 className="app-section-title">THIS WEEK</h2>
        <div className="week-grid" aria-label="This week's check-ins">
          {weekDays.map(({ d, key, wd }) => {
            const ans = state.answers[key];
            const cls =
              'week-cell' +
              (key === todayKey ? ' today' : '') +
              (ans === 'yes' ? ' yes' : ans === 'no' ? ' no' : '');
            return (
              <div key={key} className={cls}>
                <div className="wd">{wd}</div>
                <div className="md">{d.getDate()}</div>
                <div className="mark">{ans === 'yes' ? <Check /> : ans === 'no' ? <Cross /> : null}</div>
              </div>
            );
          })}
        </div>

        <h2 className="app-section-title">STATS</h2>
        <div className="stats">
          <div className="stat">
            <div className="label">CURRENT STREAK</div>
            <div className="value">{streak}</div>
          </div>
          <div className="stat">
            <div className="label">BEST STREAK</div>
            <div className="value">{best}</div>
          </div>
          <div className="stat">
            <div className="label">TOTAL YES</div>
            <div className="value">{totalYes}</div>
          </div>
        </div>

        <h2 className="app-section-title">FRIENDS</h2>
        <div className="friends">
          {FRIENDS.map((f) => (
            <div className="friend" key={f.name}>
              <Avatar color={f.color} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="name">{f.name}</div>
                <div className="sub">{f.streak}-day streak</div>
                <div className="friend-actions">
                  <button type="button" onClick={() => flashToast(`Nudged ${f.name}.`)}>
                    NUDGE
                  </button>
                  <button type="button" onClick={() => flashToast(`Cheered ${f.name}.`)}>
                    CHEER
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
