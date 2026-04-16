import React from 'react';
import { theme } from '../theme';

export const PhoneFrame: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => {
  return (
    <div
      style={{
        width: 320,
        height: 620,
        background: theme.paper,
        border: `3px solid ${theme.ink}`,
        borderRadius: 42,
        padding: 18,
        boxShadow: '0 30px 60px rgba(0,0,0,.15)',
        position: 'relative',
        ...style,
      }}
    >
      {/* notch */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 110,
          height: 20,
          background: theme.ink,
          borderRadius: 12,
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 26,
          background: '#fff',
          padding: '44px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};
