// Simply Accountable — tracker demo.
// State persists in localStorage. Yes/No per day; stats are derived.

(function () {
  const STORAGE_KEY = 'simply-accountable-v1';
  const DEFAULT_HABIT = 'Did you do it today?';
  const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { habit: DEFAULT_HABIT, answers: {} };
      const parsed = JSON.parse(raw);
      return {
        habit: parsed.habit || DEFAULT_HABIT,
        answers: parsed.answers || {},
      };
    } catch (e) {
      return { habit: DEFAULT_HABIT, answers: {} };
    }
  };

  const save = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const state = load();

  // ----- Date helpers -----
  const pad = (n) => String(n).padStart(2, '0');
  const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const startOfWeek = (d) => {
    const out = new Date(d);
    out.setHours(0, 0, 0, 0);
    out.setDate(out.getDate() - out.getDay()); // Sunday
    return out;
  };
  const addDays = (d, n) => {
    const out = new Date(d);
    out.setDate(out.getDate() + n);
    return out;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toKey(today);

  // ----- Elements -----
  const $ = (id) => document.getElementById(id);
  const habitInput = $('habitInput');
  const questionEl = $('habitQuestion');
  const dateEl = $('todayDate');
  const weekGrid = $('weekGrid');
  const streakEl = $('streakValue');
  const bestEl = $('bestValue');
  const totalYesEl = $('totalYes');
  const friendsGrid = $('friendsGrid');
  const toastEl = $('toast');

  // ----- Header -----
  const fmtDate = today.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  dateEl.textContent = fmtDate.toUpperCase();

  const renderHabit = () => {
    const label = state.habit && state.habit.trim() ? state.habit : DEFAULT_HABIT;
    questionEl.textContent = label.endsWith('?') ? label : `${label} today?`;
    habitInput.value = state.habit === DEFAULT_HABIT ? '' : state.habit;
  };
  renderHabit();

  // ----- Answer buttons -----
  const syncAnswerButtons = () => {
    const answer = state.answers[todayKey];
    document.querySelectorAll('.answer').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.answer === answer);
    });
  };

  document.querySelectorAll('.answer').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prev = state.answers[todayKey];
      const next = btn.dataset.answer;
      if (prev === next) {
        delete state.answers[todayKey];
        toast('Cleared today\u2019s check-in.');
      } else {
        state.answers[todayKey] = next;
        toast(next === 'yes' ? 'Nice — logged for today.' : 'Logged as no. Tomorrow\u2019s a new day.');
      }
      save(state);
      syncAnswerButtons();
      renderWeek();
      renderStats();
    });
  });

  // ----- Habit save -----
  $('saveHabit').addEventListener('click', () => {
    const val = habitInput.value.trim();
    state.habit = val || DEFAULT_HABIT;
    save(state);
    renderHabit();
    toast('Habit saved.');
  });
  habitInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); $('saveHabit').click(); }
  });

  // ----- Week grid -----
  const checkSvg = () => '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3 3 7-7" fill="none" stroke="#1c3b2e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const xSvg = () => '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="#7a2f2a" stroke-width="2.4" stroke-linecap="round"/></svg>';

  const renderWeek = () => {
    const sun = startOfWeek(today);
    weekGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const d = addDays(sun, i);
      const key = toKey(d);
      const ans = state.answers[key];
      const cell = document.createElement('div');
      cell.className = 'week-cell' + (key === todayKey ? ' today' : '') + (ans === 'yes' ? ' yes' : ans === 'no' ? ' no' : '');
      cell.innerHTML = `
        <div class="wd">${WEEKDAYS[i]}</div>
        <div class="md">${d.getDate()}</div>
        <div class="mark">${ans === 'yes' ? checkSvg() : ans === 'no' ? xSvg() : ''}</div>
      `;
      weekGrid.appendChild(cell);
    }
  };

  // ----- Stats -----
  const computeStreak = () => {
    let streak = 0;
    let cursor = new Date(today);
    while (state.answers[toKey(cursor)] === 'yes') {
      streak++;
      cursor = addDays(cursor, -1);
    }
    return streak;
  };
  const computeBest = () => {
    const keys = Object.keys(state.answers).filter((k) => state.answers[k] === 'yes').sort();
    let best = 0, run = 0, prev = null;
    keys.forEach((k) => {
      const d = new Date(k);
      if (prev && (d - prev) === 86400000) run++; else run = 1;
      if (run > best) best = run;
      prev = d;
    });
    return best;
  };
  const renderStats = () => {
    streakEl.textContent = computeStreak();
    bestEl.textContent = computeBest();
    totalYesEl.textContent = Object.values(state.answers).filter((v) => v === 'yes').length;
  };

  // ----- Friends (demo data) -----
  const FRIENDS = [
    { name: 'Alex P.', streak: 5, color: '#F4B6A0' },
    { name: 'Jordan',  streak: 12, color: '#F0D28A' },
    { name: 'Sam',     streak: 3, color: '#B7C8F2' },
    { name: 'Riley',   streak: 0, color: '#B4DDB0' },
  ];
  const avatar = (color) =>
    `<svg class="avatar" viewBox="0 0 32 32" aria-hidden="true">
       <circle cx="16" cy="16" r="15" fill="${color}" stroke="#2b2b2b" stroke-width="1.2"/>
       <circle cx="16" cy="13" r="5" fill="#2b2b2b"/>
       <path d="M5 27 c 4 -8 18 -8 22 0" fill="#2b2b2b"/>
     </svg>`;

  const renderFriends = () => {
    friendsGrid.innerHTML = '';
    FRIENDS.forEach((f) => {
      const el = document.createElement('div');
      el.className = 'friend';
      el.innerHTML = `
        ${avatar(f.color)}
        <div style="flex:1;min-width:0">
          <div class="name">${f.name}</div>
          <div class="sub">${f.streak}-day streak</div>
          <div class="friend-actions">
            <button type="button" data-friend="${f.name}" data-kind="nudge">NUDGE</button>
            <button type="button" data-friend="${f.name}" data-kind="cheer">CHEER</button>
          </div>
        </div>
      `;
      friendsGrid.appendChild(el);
    });
    friendsGrid.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => {
        const kind = b.dataset.kind === 'nudge' ? 'Nudged' : 'Cheered';
        toast(`${kind} ${b.dataset.friend}.`);
      });
    });
  };

  // ----- Toast -----
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  // ----- Initial render -----
  syncAnswerButtons();
  renderWeek();
  renderStats();
  renderFriends();
})();
