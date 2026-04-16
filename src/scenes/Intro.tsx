import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const brandTranslate = interpolate(frame, [0, 18], [12, 0], { extrapolateRight: 'clamp' });

  const titleSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.6 },
  });
  const titleScale = 0.92 + 0.08 * titleSpring;
  const titleOpacity = interpolate(frame, [12, 30], [0, 1], { extrapolateRight: 'clamp' });

  const subOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const subTranslate = interpolate(frame, [30, 50], [10, 0], { extrapolateRight: 'clamp' });

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
          fontFamily: theme.sans,
          fontWeight: 700,
          letterSpacing: '0.22em',
          fontSize: 22,
          marginBottom: 28,
          opacity: brandOpacity,
          transform: `translateY(${brandTranslate}px)`,
        }}
      >
        SIMPLY ACCOUNTABLE.
      </div>
      <div
        style={{
          fontFamily: theme.serif,
          fontWeight: 700,
          fontSize: 110,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        One Question.
        <br />
        Every Day.
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: theme.sans,
          fontSize: 24,
          color: theme.inkSoft,
          opacity: subOpacity,
          transform: `translateY(${subTranslate}px)`,
        }}
      >
        Did you do it? Let your friends know.
      </div>
    </AbsoluteFill>
  );
};
