import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PhoneFrame } from '../components/PhoneFrame';
import { Check } from '../components/Check';
import { theme } from '../theme';

export const CheckIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneSpring = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const phoneY = interpolate(phoneSpring, [0, 1], [60, 0]);
  const phoneOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });

  // Finger press on YES around frame 60-80
  const pressFrame = 70;
  const pressScale = interpolate(
    frame,
    [pressFrame - 6, pressFrame, pressFrame + 6],
    [1, 0.94, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const yesFill = frame >= pressFrame ? theme.yes : '#fff';

  // Check mark draws in
  const checkOpacity = interpolate(frame, [pressFrame, pressFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const checkScale = interpolate(
    spring({ frame: frame - pressFrame, fps, config: { damping: 10, stiffness: 140 } }),
    [0, 1],
    [0.4, 1]
  );

  // Toast "Logged for today"
  const toastOpacity = interpolate(frame, [pressFrame + 16, pressFrame + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const toastY = interpolate(frame, [pressFrame + 16, pressFrame + 30], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Finger cursor position: travel toward YES tile
  const fingerOpacity = interpolate(
    frame,
    [14, 30, pressFrame + 10, pressFrame + 24],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const fingerX = interpolate(frame, [14, pressFrame], [-40, -60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fingerY = interpolate(frame, [14, pressFrame], [120, 60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* side copy */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 180,
          maxWidth: 380,
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(frame, [10, 30], [10, 0], { extrapolateRight: 'clamp' })}px)`,
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
          1. YOUR DAILY CHECK-IN.
        </div>
        <div style={{ fontFamily: theme.serif, fontSize: 42, lineHeight: 1.1, fontWeight: 700 }}>
          One tap.
          <br />
          One answer.
        </div>
        <div
          style={{
            fontFamily: theme.sans,
            fontSize: 18,
            color: theme.inkSoft,
            marginTop: 14,
            lineHeight: 1.45,
          }}
        >
          A single question. Log your activity in seconds. Build your daily streak.
        </div>
      </div>

      <div
        style={{
          transform: `translate(220px, ${phoneY}px)`,
          opacity: phoneOpacity,
          position: 'relative',
        }}
      >
        <PhoneFrame>
          <div
            style={{
              fontFamily: theme.sans,
              fontWeight: 800,
              letterSpacing: '0.12em',
              fontSize: 10,
              color: theme.muted,
              textAlign: 'center',
            }}
          >
            WEDNESDAY &middot; APR 16
          </div>
          <div
            style={{
              fontFamily: theme.serif,
              fontSize: 32,
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.15,
              margin: '28px 0 10px',
            }}
          >
            Did you
            <br />
            work out today?
          </div>
          <div
            style={{
              fontFamily: theme.sans,
              fontSize: 12,
              color: theme.muted,
              textAlign: 'center',
              letterSpacing: '0.14em',
            }}
          >
            CURRENT STREAK &middot; 4 DAYS
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <div
              style={{
                flex: 1,
                borderRadius: 14,
                border: `2.5px solid ${theme.ink}`,
                background: yesFill,
                padding: '28px 0',
                textAlign: 'center',
                fontFamily: theme.sans,
                fontWeight: 800,
                letterSpacing: '0.14em',
                fontSize: 18,
                transform: `scale(${pressScale})`,
                transition: 'none',
                position: 'relative',
              }}
            >
              YES
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: checkOpacity,
                  transform: `scale(${checkScale})`,
                }}
              >
                <Check size={56} strokeWidth={3.2} />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                borderRadius: 14,
                border: `2.5px solid ${theme.ink}`,
                background: '#fff',
                padding: '28px 0',
                textAlign: 'center',
                fontFamily: theme.sans,
                fontWeight: 800,
                letterSpacing: '0.14em',
                fontSize: 18,
              }}
            >
              NO
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontFamily: theme.sans,
              fontSize: 12,
              color: theme.muted,
              marginTop: 8,
              opacity: toastOpacity,
              transform: `translateY(${toastY}px)`,
            }}
          >
            Nice &mdash; logged for today.
          </div>
        </PhoneFrame>

        {/* finger cursor */}
        <div
          style={{
            position: 'absolute',
            left: `calc(50% + ${fingerX}px)`,
            top: `calc(100% + ${fingerY - 240}px)`,
            opacity: fingerOpacity,
            transition: 'none',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 40 48" width={48} height={56}>
            <path
              d="M10 4 v20 l-4 -2 c-3 -1 -6 2 -4 5 l10 14 c 2 3 5 5 9 5 h 8 c 5 0 8 -3 8 -8 v -10 c 0 -3 -2 -5 -5 -5 h -7 v -19 c 0 -3 -2 -5 -5 -5 c -3 0 -5 2 -5 5 z"
              fill="#fff"
              stroke="#1b1b1b"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
