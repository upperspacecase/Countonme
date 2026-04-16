import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Avatar } from '../components/Avatar';
import { theme } from '../theme';

export const Encourage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 18], [12, 0], { extrapolateRight: 'clamp' });

  // Nudge button press around frame 50
  const pressAt = 50;
  const nudgePress = interpolate(
    frame,
    [pressAt - 6, pressAt, pressAt + 6],
    [1, 0.94, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Message bubble flies from sender (left avatar) to receiver (right avatar)
  const msgStart = pressAt + 6;
  const msgEnd = msgStart + 50;
  const msgProgress = interpolate(frame, [msgStart, msgEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const msgOpacity = interpolate(frame, [msgStart, msgStart + 10, msgEnd - 6, msgEnd], [0, 1, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const msgX = interpolate(msgProgress, [0, 1], [-200, 200]);
  const msgY = -50 * Math.sin(msgProgress * Math.PI); // arc

  // Celebrate — confetti burst after msg arrives
  const celebrateAt = msgEnd + 6;
  const confettiProgress = interpolate(frame, [celebrateAt, celebrateAt + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const celebrateSpring = spring({
    frame: frame - celebrateAt,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const receiverScale = 1 + 0.1 * celebrateSpring;

  // Receiver pop-in earlier so it's present when the bubble arrives
  const avatarOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });

  const confetti = Array.from({ length: 18 }).map((_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const dist = 140 * confettiProgress;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist - 20 * confettiProgress;
    const colors = ['#F4B6A0', '#F0D28A', '#B7C8F2', '#B4DDB0', '#A9C7CB'];
    const color = colors[i % colors.length];
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          width: 10,
          height: 14,
          background: color,
          border: `1.5px solid ${theme.ink}`,
          transform: `rotate(${i * 20}deg)`,
          opacity: interpolate(confettiProgress, [0, 0.6, 1], [0, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    );
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
          4. SEND ENCOURAGEMENT.
        </div>
        <div style={{ fontFamily: theme.serif, fontSize: 56, fontWeight: 700, lineHeight: 1.05 }}>
          A nudge goes a long way.
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 16, marginTop: 36 }}>
        <div
          style={{
            border: `2.5px solid ${theme.ink}`,
            borderRadius: 12,
            background: theme.nudge,
            padding: '14px 22px',
            fontFamily: theme.sans,
            fontWeight: 800,
            letterSpacing: '0.1em',
            fontSize: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            transform: `scale(${nudgePress})`,
          }}
        >
          <span style={{ fontSize: 22 }} aria-hidden>
            🔥
          </span>
          NUDGE FRIEND
        </div>
        <div
          style={{
            border: `2.5px solid ${theme.ink}`,
            borderRadius: 12,
            background: theme.celebrate,
            padding: '14px 22px',
            fontFamily: theme.sans,
            fontWeight: 800,
            letterSpacing: '0.1em',
            fontSize: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 22 }} aria-hidden>
            👏
          </span>
          CELEBRATE WINS
        </div>
      </div>

      {/* Stage with two avatars */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          marginTop: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 640,
            height: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Sender */}
          <div style={{ textAlign: 'center', opacity: avatarOpacity }}>
            <Avatar color="#F4B6A0" size={140} />
            <div
              style={{
                fontFamily: theme.sans,
                fontWeight: 800,
                letterSpacing: '0.08em',
                fontSize: 14,
                marginTop: 10,
              }}
            >
              YOU
            </div>
          </div>

          {/* Receiver */}
          <div
            style={{
              textAlign: 'center',
              opacity: avatarOpacity,
              transform: `scale(${receiverScale})`,
              position: 'relative',
            }}
          >
            <Avatar color="#B4DDB0" size={140} />
            <div
              style={{
                fontFamily: theme.sans,
                fontWeight: 800,
                letterSpacing: '0.08em',
                fontSize: 14,
                marginTop: 10,
              }}
            >
              RILEY
            </div>
            {/* confetti overlay */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 70,
                pointerEvents: 'none',
              }}
            >
              {confetti}
            </div>
          </div>

          {/* Flying message bubble */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${msgX}px), calc(-50% + ${msgY}px))`,
              opacity: msgOpacity,
              background: '#fff',
              border: `2.5px solid ${theme.ink}`,
              borderRadius: 16,
              padding: '10px 16px',
              fontFamily: theme.sans,
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 20px rgba(0,0,0,.08)',
            }}
          >
            Keep going, you got this! 💪
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
