'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Answer = 'yes' | 'no';
type State = { habit: string; answers: Record<string, Answer> };

const STORAGE_KEY = 'simply-accountable-v1';
const DEFAULT_HABIT = 'Did you do it today?';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  { name: 'Alex P.', streak: 5, color: '#2D6A4F', initial: 'A' },
  { name: 'Jordan', streak: 12, color: '#E07A5F', initial: 'J' },
  { name: 'Sam', streak: 3, color: '#5A7FBF', initial: 'S' },
  { name: 'Riley', streak: 0, color: '#B07BAC', initial: 'R' },
];

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden>
    <path d="M5 10.5l3 3 7-7" fill="none" stroke="#2D6A4F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 20 20" aria-hidden>
    <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="#E07A5F" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export function Tracker() {
  const [state, setState] = useState<State>({ habit: DEFAULT_HABIT, answers: {} });
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [habitDraft, setHabitDraft] = useState('');

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayKey = toKey(today);

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
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { /* ignore */ }
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
        flashToast('Cleared.');
      } else {
        next.answers[todayKey] = answer;
        flashToast(answer === 'yes' ? 'Logged. Keep it going.' : 'Logged. Tomorrow is a new day.');
      }
      return next;
    });
  };

  const saveHabit = () => {
    const val = habitDraft.trim();
    setState((prev) => ({ ...prev, habit: val || DEFAULT_HABIT }));
    flashToast('Habit saved.');
  };

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
    const keys = Object.keys(state.answers).filter((k) => state.answers[k] === 'yes').sort();
    let b = 0, run = 0;
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

  const fmtDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="tracker-page">
      <nav className="tracker-nav">
        <Link href="/">Home</Link>
        <span className="tracker-brand">Count on Me</span>
      </nav>

      <p className="tracker-date">{fmtDate}</p>
      <h1 className="tracker-question">{question}</h1>

      <div className="answer-row" role="group" aria-label="Today's answer">
        <button
          className={`answer-btn yes${todayAnswer === 'yes' ? ' active' : ''}`}
          type="button"
          onClick={() => onAnswer('yes')}
        >
          Yes
        </button>
        <button
          className={`answer-btn no${todayAnswer === 'no' ? ' active' : ''}`}
          type="button"
          onClick={() => onAnswer('no')}
        >
          No
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
            if (e.key === 'Enter') { e.preventDefault(); saveHabit(); }
          }}
        />
        <button type="button" onClick={saveHabit}>Save</button>
      </div>

      <h2 className="tracker-section-title">This week</h2>
      <div className="week-grid" aria-label="This week's check-ins">
        {weekDays.map(({ d, key, wd }) => {
          const ans = state.answers[key];
          const cls = 'week-cell' +
            (key === todayKey ? ' today' : '') +
            (ans === 'yes' ? ' yes' : ans === 'no' ? ' no' : '');
          return (
            <div key={key} className={cls}>
              <div className="wd">{wd}</div>
              <div className="md">{d.getDate()}</div>
              <div className="mark">
                {ans === 'yes' ? <Check /> : ans === 'no' ? <Cross /> : null}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="tracker-section-title">Stats</h2>
      <div className="stats">
        <div className="stat">
          <div className="label">Current streak</div>
          <div className="value">{streak}</div>
        </div>
        <div className="stat">
          <div className="label">Best streak</div>
          <div className="value">{best}</div>
        </div>
        <div className="stat">
          <div className="label">Total yes</div>
          <div className="value">{totalYes}</div>
        </div>
      </div>

      <h2 className="tracker-section-title">Friends</h2>
      <div className="friends">
        {FRIENDS.map((f) => (
          <div className="friend" key={f.name}>
            <div className="avatar" style={{ background: f.color }}>{f.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="name">{f.name}</div>
              <div className="sub">{f.streak > 0 ? `${f.streak}-day streak` : 'No streak yet'}</div>
              <div className="friend-actions">
                <button type="button" onClick={() => flashToast(`Nudged ${f.name}.`)}>Nudge</button>
                <button type="button" onClick={() => flashToast(`Cheered ${f.name}!`)}>Cheer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
