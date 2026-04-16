import Link from 'next/link';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STATUSES = ['done', 'done', 'done', 'done', 'done', 'missed', 'empty'] as const;

const FRIENDS = [
  { name: 'Alex P.', streak: 12, color: '#2D6A4F' },
  { name: 'Jordan', streak: 7, color: '#E07A5F' },
  { name: 'Sam K.', streak: 3, color: '#5A7FBF' },
  { name: 'Riley', streak: 0, color: '#B07BAC' },
];

const CheckSVG = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossSVG = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export default function Home() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="landing-logo">Count on Me</span>
        <div className="landing-nav-links">
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/tracker">Tracker</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">Free accountability tracker</div>
        <h1 className="hero-title">One question.<br />Every day.</h1>
        <p className="hero-sub">
          Track one habit with a daily yes or no. Share your streak with friends. Send a nudge when they slip.
        </p>
        <div className="hero-actions">
          <Link href="/tracker" className="btn-primary">
            Start tracking
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/demo" className="btn-secondary">Watch the demo</Link>
        </div>
      </section>

      <section className="how-section">
        <div className="section-label">How it works</div>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div>
              <h3>Pick one habit</h3>
              <p>Workout, read, meditate, ship code. Choose one thing you want to do every day.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div>
              <h3>Answer once a day</h3>
              <p>Did you do it? Yes or no. Takes two seconds. Build your streak.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div>
              <h3>Add your people</h3>
              <p>Invite up to 5 friends. See each other's weekly check-ins and streaks.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div>
              <h3>Nudge and celebrate</h3>
              <p>Send a nudge when someone slips. Celebrate when they hit a milestone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="section-label">What it looks like</div>
        <div className="preview-card">
          <div className="preview-header">
            <h3 className="serif">Did you work out?</h3>
            <div className="preview-streak">
              <span className="num">5</span>
              <span className="label">day streak</span>
            </div>
          </div>
          <div className="preview-week">
            {DAYS.map((day, i) => (
              <div className="preview-day" key={day}>
                <div className="wd">{day}</div>
                <div className={`indicator ${STATUSES[i]}`}>
                  {STATUSES[i] === 'done' && <CheckSVG />}
                  {STATUSES[i] === 'missed' && <CrossSVG />}
                </div>
              </div>
            ))}
          </div>
          <div className="preview-friends">
            {FRIENDS.map((f) => (
              <div className="preview-friend" key={f.name}>
                <div className="preview-avatar" style={{ background: f.color }}>
                  {f.name[0]}
                </div>
                <div className="preview-friend-info">
                  <div className="name">{f.name}</div>
                  <div className="streak-text">{f.streak > 0 ? `${f.streak}-day streak` : 'No streak'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tagline-section">
        <blockquote>
          &ldquo;The thing that keeps me going isn&rsquo;t discipline. It&rsquo;s knowing someone will notice if I stop.&rdquo;
        </blockquote>
        <cite>The idea behind Count on Me</cite>
      </section>

      <section className="bottom-cta">
        <h2 className="serif">Start today. It takes 10 seconds.</h2>
        <p>No account required. Your data stays in your browser.</p>
        <Link href="/tracker" className="btn-primary">
          Open the tracker
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      <footer className="site-footer">
        <span className="footer-logo">Count on Me</span>
        <div className="footer-links">
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
