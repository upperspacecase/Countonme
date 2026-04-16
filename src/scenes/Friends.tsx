import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Avatar } from '../components/Avatar';
import { theme } from '../theme';

type Friend = { name: string; color: string; streak: number };

const FRIENDS: Friend[] = [
  { name: 'ALEX P.', color: '#F4B6A0', streak: 5 },
  { name: 'JORDAN', color: '#F0D28A', streak: 12 },
  { name: 'SAM', color: '#B7C8F2', streak: 3 },
  { name: 'RILEY', color: '#B4DDB0', streak: 8 },
];

export const Friends: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 18], [12, 0], { extrapolateRight: 'clamp' });

  // Draw connecting lines as a stroke-dasharray animation
  const lineProgress = interpolate(frame, [18, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
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
          3. TRACK WITH FRIENDS.
        </div>
        <div style={{ fontFamily: theme.serif, fontSize: 56, fontWeight: 700, lineHeight: 1.05 }}>
          Better, together.
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginTop: 10,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 720,
            height: 420,
          }}
        >
          {/* Connection lines */}
          <svg
            viewBox="0 0 720 420"
            width={720}
            height={420}
            style={{ position: 'absolute', inset: 0 }}
          >
            {[
              'M120 80 L600 80',
              'M120 80 L120 340',
              'M600 80 L600 340',
              'M120 340 L600 340',
              'M120 80 L600 340',
              'M600 80 L120 340',
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={theme.ink}
                strokeWidth={1.6}
                fill="none"
                opacity={0.5}
                strokeDasharray={900}
                strokeDashoffset={900 - 900 * lineProgress}
              />
            ))}
          </svg>

          {FRIENDS.map((f, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const left = col === 0 ? 40 : 520;
            const top = row === 0 ? 0 : 260;

            const delay = 14 + i * 10;
            const sp = spring({
              frame: frame - delay,
              fps,
              config: { damping: 13, stiffness: 140 },
            });
            const scale = interpolate(sp, [0, 1], [0.2, 1]);
            const opacity = interpolate(frame, [delay, delay + 16], [0, 1], {
              extrapolateRight: 'clamp',
            });

            // Streak badge ticks
            const badgeOpacity = interpolate(frame, [delay + 12, delay + 30], [0, 1], {
              extrapolateRight: 'clamp',
            });
            const badgeY = interpolate(frame, [delay + 12, delay + 30], [8, 0], {
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={f.name}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                  width: 160,
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar color={f.color} size={110} />
                </div>
                <div
                  style={{
                    fontFamily: theme.sans,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    fontSize: 16,
                    marginTop: 10,
                  }}
                >
                  {f.name}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#fff',
                    border: `2px solid ${theme.ink}`,
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontFamily: theme.sans,
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    opacity: badgeOpacity,
                    transform: `translateY(${badgeY}px)`,
                  }}
                >
                  <span aria-hidden>🔥</span>
                  {f.streak} DAYS
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
