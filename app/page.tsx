import Link from 'next/link';
import { CTA } from '@/components/landing/CTA';
import { EncourageButtons } from '@/components/landing/EncourageButtons';

export default function Home() {
  return (
    <div className="page-shell">
      <main className="card">
        <header className="brand">
          <span className="brand-mark">SIMPLY ACCOUNTABLE.</span>
        </header>

        <section className="hero">
          <h1 className="hero-title">One Question. Every Day.</h1>
          <p className="hero-sub">Did you do it? Let your friends know.</p>
          <CTA />
        </section>

        <section className="features">
          <div className="feature">
            <div className="feature-art" aria-hidden>
              <svg viewBox="0 0 220 220" width="100%" height="100%">
                <circle cx="110" cy="110" r="96" fill="#CFE0E7" />
                <path
                  d="M60 220 C 60 170, 85 150, 110 150 L 150 150 L 150 220 Z"
                  fill="#E4C29B"
                  stroke="#2b2b2b"
                  strokeWidth={2}
                />
                <rect x="78" y="38" width="84" height="140" rx="12" fill="#fff" stroke="#2b2b2b" strokeWidth={2} />
                <rect x="86" y="48" width="68" height="22" rx="4" fill="#F2D46B" stroke="#2b2b2b" strokeWidth={1.5} />
                <text x="120" y="57" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fill="#2b2b2b" fontWeight={700}>
                  DEC
                </text>
                <text x="120" y="68" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill="#2b2b2b" fontWeight={700}>
                  26
                </text>
                <text x="120" y="86" textAnchor="middle" fontSize="7" fill="#2b2b2b" fontWeight={700}>
                  YES / NO
                </text>
                <rect x="88" y="94" width="28" height="22" rx="4" fill="#B6DDA8" stroke="#2b2b2b" strokeWidth={1.5} />
                <path
                  d="M94 106 l4 4 l8 -8"
                  fill="none"
                  stroke="#2b2b2b"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="120" y="94" width="28" height="22" rx="4" fill="#fff" stroke="#2b2b2b" strokeWidth={1.5} />
                <text x="134" y="109" textAnchor="middle" fontSize="8" fill="#2b2b2b" fontWeight={700}>
                  NO
                </text>
                <path
                  d="M150 150 C 168 140, 172 128, 160 120 C 170 118, 174 132, 168 148 Z"
                  fill="#E4C29B"
                  stroke="#2b2b2b"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="feature-body">
              <h3>
                1. YOUR DAILY
                <br />
                CHECK-IN.
              </h3>
              <p>A single question. Log your activity in seconds. Build your daily streak.</p>
            </div>
          </div>

          <div className="feature-divider" aria-hidden />

          <div className="feature">
            <div className="feature-art" aria-hidden>
              <svg viewBox="0 0 220 220" width="100%" height="100%">
                <circle cx="110" cy="110" r="96" fill="#E7D7B8" />
                <path
                  d="M60 60 L 160 60 M 60 60 L 60 160 M 160 60 L 160 160 M 60 160 L 160 160 M 60 60 L 160 160 M 160 60 L 60 160"
                  stroke="#2b2b2b"
                  strokeWidth={1.5}
                  fill="none"
                  opacity={0.6}
                />
                <path
                  d="M130 28 h52 a6 6 0 0 1 6 6 v18 a6 6 0 0 1 -6 6 h-30 l-8 8 v-8 h-14 a6 6 0 0 1 -6 -6 v-18 a6 6 0 0 1 6 -6 z"
                  fill="#fff"
                  stroke="#2b2b2b"
                  strokeWidth={1.5}
                />
                <circle cx="148" cy="43" r="2" fill="#2b2b2b" />
                <circle cx="156" cy="43" r="2" fill="#2b2b2b" />
                <circle cx="164" cy="43" r="2" fill="#2b2b2b" />
                {[
                  { cx: 60, cy: 60, color: '#F4B6A0', label: '6/10' },
                  { cx: 160, cy: 60, color: '#F0D28A', label: '7/10' },
                  { cx: 60, cy: 160, color: '#B7C8F2', label: '0/10' },
                  { cx: 160, cy: 160, color: '#B4DDB0', label: '5/10' },
                ].map((a) => (
                  <g key={`${a.cx}-${a.cy}`}>
                    <circle cx={a.cx} cy={a.cy} r={20} fill={a.color} stroke="#2b2b2b" strokeWidth={1.5} />
                    <circle cx={a.cx} cy={a.cy - 5} r={7} fill="#2b2b2b" />
                    <path d={`M${a.cx - 14} ${a.cy + 12} c 4 -10 24 -10 28 0`} fill="#2b2b2b" />
                    <rect x={a.cx - 22} y={a.cy + 22} width={44} height={14} rx={7} fill="#fff" stroke="#2b2b2b" strokeWidth={1.2} />
                    <text x={a.cx} y={a.cy + 32} textAnchor="middle" fontSize="8" fontWeight={700} fill="#2b2b2b">
                      {a.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="feature-body">
              <h3>
                2. TRACK WITH
                <br />
                FRIENDS.
              </h3>
              <p>Build a group. See each other&rsquo;s activity. Share streaks. Stay accountable together.</p>
            </div>
          </div>
        </section>

        <hr className="rule" />

        <section className="encourage">
          <div className="encourage-copy">
            <h2>SEND ENCOURAGEMENT.</h2>
            <EncourageButtons />
          </div>

          <div className="tracker-card" aria-label="Tracker preview">
            <div className="window-bar" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div className="tracker-body">
              <div className="tracker-left">
                <div className="tracker-title">MY TRACKER</div>
                <div className="tracker-row">
                  <div className="tracker-name">ALEX P.</div>
                  <div className="tracker-week">WEEK 4</div>
                </div>
                <div className="dots" aria-label="This week's check-ins">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} className={`dot${i < 5 ? ' done' : ''}`}>
                      {i < 5 && (
                        <svg viewBox="0 0 20 20" aria-hidden>
                          <path
                            d="M5 10.5l3 3 7-7"
                            fill="none"
                            stroke="#1c3b2e"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  ))}
                </div>
                <div className="streak">
                  <strong>5</strong>
                  <span>DAYS</span>
                </div>
              </div>
              <div className="tracker-right">
                <div className="msg">
                  <div className="msg-avatar" aria-hidden>
                    <svg viewBox="0 0 28 28">
                      <circle cx="14" cy="14" r="13" fill="#F4B6A0" stroke="#2b2b2b" strokeWidth={1.2} />
                      <circle cx="14" cy="12" r="4" fill="#2b2b2b" />
                      <path d="M6 22 c 3 -6 13 -6 16 0" fill="#2b2b2b" />
                    </svg>
                  </div>
                  <div className="msg-name">ALEX P.</div>
                </div>
                <p className="msg-text">
                  Sent you encouragement: &ldquo;Keep going, you got this! <span aria-hidden>💪</span>&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule" />

        <footer className="site-footer">
          <nav className="foot-nav" aria-label="Footer">
            <Link href="/how-it-works">HOW IT WORKS</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/support">SUPPORT</Link>
            <Link href="/privacy">PRIVACY</Link>
          </nav>
          <Link className="foot-logo" href="/" aria-label="Simply Accountable home">
            <svg viewBox="0 0 120 120" width={72} height={72} aria-hidden>
              <circle cx={60} cy={60} r={54} fill="none" stroke="#2b2b2b" strokeWidth={2} />
              <path
                d="M42 62 l10 -6 l10 6 l10 -6 l10 6 M42 62 c 0 10 36 10 36 0"
                fill="none"
                stroke="#2b2b2b"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x={60} y={22} textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fontWeight={700} fill="#2b2b2b">
                SIMPLY
              </text>
              <text x={60} y={108} textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fontWeight={700} fill="#2b2b2b">
                ACCOUNTABLE
              </text>
            </svg>
          </Link>
          <div className="stores" id="stores">
            <a className="store" href="#" aria-label="Download on the App Store">
              <svg viewBox="0 0 120 36" aria-hidden>
                <rect width="120" height="36" rx="6" fill="#000" />
                <path
                  d="M18 12.4c0-1.7 1.4-2.6 1.5-2.6-.8-1.2-2.1-1.3-2.5-1.4-1.1-.1-2.1.6-2.6.6-.6 0-1.4-.6-2.3-.6-1.2 0-2.3.7-2.9 1.8-1.2 2.1-.3 5.2.9 6.9.6.8 1.3 1.8 2.2 1.7.9 0 1.2-.6 2.3-.6 1 0 1.4.6 2.3.6 1 0 1.6-.8 2.2-1.7.7-1 1-2 1-2 0 0-1.9-.7-1.9-2.7zM16.4 7.3c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1.1-.4.5-.8 1.3-.7 2.1.8.1 1.5-.4 2-1z"
                  fill="#fff"
                />
                <text x="30" y="15" fontSize="6" fill="#fff">
                  Download on the
                </text>
                <text x="30" y="26" fontSize="11" fontWeight={700} fill="#fff">
                  App Store
                </text>
              </svg>
            </a>
            <a className="store" href="#" aria-label="Get it on Google Play">
              <svg viewBox="0 0 120 36" aria-hidden>
                <rect width="120" height="36" rx="6" fill="#000" />
                <g transform="translate(10 8)">
                  <path d="M0 0v20l10-10z" fill="#00E5FF" />
                  <path d="M0 0l14 8-4 4z" fill="#FFD600" />
                  <path d="M0 20l14-8-4-4z" fill="#FF1744" />
                  <path d="M14 8l6 4-6 4-4-4z" fill="#00C853" />
                </g>
                <text x="36" y="15" fontSize="6" fill="#fff">
                  GET IT ON
                </text>
                <text x="36" y="26" fontSize="11" fontWeight={700} fill="#fff">
                  Google Play
                </text>
              </svg>
            </a>
          </div>
        </footer>
      </main>

      <span className="spark" aria-hidden>
        <svg viewBox="0 0 24 24">
          <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill="#dfe6ea" />
        </svg>
      </span>
    </div>
  );
}
