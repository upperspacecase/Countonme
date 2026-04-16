import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Check } from '../components/Check';
import { theme } from '../theme';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DATES = [12, 13, 14, 15, 16, 17, 18];
// Filled = 5 checks (Sun–Thu), today = Wed (index 3). We'll fill Sun, Mon, Tue, Wed, Thu.
const FILLED = [true, true, true, true, true, false, false];

export const Week: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const headerY = interpolate(frame, [0, 18], [12, 0], { extrapolateRight: 'clamp' });

  // Each filled dot appears one-by-one starting at frame 20, every 12 frames.
  const dotStart = 20;
  const dotStep = 14;

  // Streak number ticks 1 -> 5 as the 5 dots fill.
  const streakValue = Math.min(
    5,
    Math.max(0, Math.floor((frame - dotStart) / dotStep) + 1)
  );
  const streakSpring = spring({ frame: frame - (dotStart + dotStep * 4), fps, config: { damping: 12, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ padding: 80, justifyContent: 'center' }}>
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.sans,
            fontWeight: 800,
            letterSpacing: '0.08em',
            fontSize: 16,
            marginBottom: 10,
          }}
        >
          2. BUILD YOUR STREAK.
        </div>
        <div style={{ fontFamily: theme.serif, fontSize: 56, fontWeight: 700, lineHeight: 1.05 }}>
          Days add up.
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 14,
          maxWidth: 980,
        }}
      >
        {DAYS.map((wd, i) => {
          const appearAt = dotStart + i * dotStep;
          const filled = FILLED[i];
          const filledAt = filled ? appearAt : Infinity;
          const isToday = i === 3;

          const cardSpring = spring({
            frame: frame - i * 5,
            fps,
            config: { damping: 14, stiffness: 110 },
          });
          const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);
          const cardOpacity = interpolate(frame, [i * 5, i * 5 + 12], [0, 1], {
            extrapolateRight: 'clamp',
          });

          const markScale = interpolate(
            spring({
              frame: frame - filledAt,
              fps,
              config: { damping: 10, stiffness: 160 },
            }),
            [0, 1],
            [0.2, 1]
          );
          const markOpacity = frame >= filledAt ? 1 : 0;

          return (
            <div
              key={wd}
              style={{
                background: '#fff',
                border: `2.5px solid ${theme.ink}`,
                borderRadius: 14,
                padding: '16px 8px 14px',
                textAlign: 'center',
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                outline: isToday ? `3px solid ${theme.accent}` : 'none',
                outlineOffset: 3,
              }}
            >
              <div
                style={{
                  fontFamily: theme.sans,
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  color: theme.muted,
                  fontWeight: 800,
                }}
              >
                {wd}
              </div>
              <div
                style={{
                  fontFamily: theme.sans,
                  fontWeight: 800,
                  fontSize: 18,
                  marginTop: 2,
                }}
              >
                {DATES[i]}
              </div>
              <div
                style={{
                  margin: '10px auto 0',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: frame >= filledAt ? theme.yes : '#f0e9d1',
                  border: `2px solid ${frame >= filledAt ? '#6ea664' : '#cdc4a6'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    opacity: markOpacity,
                    transform: `scale(${markScale})`,
                  }}
                >
                  {filled ? <Check size={26} strokeWidth={3.2} /> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Streak counter */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 40 }}>
        <div
          style={{
            fontFamily: theme.serif,
            fontSize: 140,
            fontWeight: 700,
            lineHeight: 1,
            transform: `scale(${0.95 + 0.05 * streakSpring})`,
          }}
        >
          {streakValue}
        </div>
        <div
          style={{
            fontFamily: theme.sans,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: theme.muted,
          }}
        >
          DAY STREAK
        </div>
      </div>
    </AbsoluteFill>
  );
};
