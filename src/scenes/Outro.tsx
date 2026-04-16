import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.85, 1]);
  const logoOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });

  const ctaOpacity = interpolate(frame, [24, 42], [0, 1], { extrapolateRight: 'clamp' });
  const ctaY = interpolate(frame, [24, 42], [10, 0], { extrapolateRight: 'clamp' });

  const subOpacity = interpolate(frame, [44, 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <svg viewBox="0 0 120 120" width={140} height={140}>
          <circle cx={60} cy={60} r={54} fill="none" stroke={theme.ink} strokeWidth={2.5} />
          <path
            d="M42 62 l10 -6 l10 6 l10 -6 l10 6 M42 62 c 0 10 36 10 36 0"
            fill="none"
            stroke={theme.ink}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={60}
            y={22}
            textAnchor="middle"
            fontFamily={theme.serif}
            fontSize={10}
            fontWeight={700}
            fill={theme.ink}
          >
            SIMPLY
          </text>
          <text
            x={60}
            y={108}
            textAnchor="middle"
            fontFamily={theme.serif}
            fontSize={10}
            fontWeight={700}
            fill={theme.ink}
          >
            ACCOUNTABLE
          </text>
        </svg>
      </div>

      <div
        style={{
          fontFamily: theme.serif,
          fontWeight: 700,
          fontSize: 72,
          marginTop: 10,
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          letterSpacing: '-0.01em',
        }}
      >
        Get started for free.
      </div>
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 22,
          color: theme.inkSoft,
          marginTop: 12,
          opacity: subOpacity,
        }}
      >
        simply-accountable.example &middot; iOS &amp; Android
      </div>
    </AbsoluteFill>
  );
};
