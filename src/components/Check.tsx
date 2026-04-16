import React from 'react';

export const Check: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({
  size = 24,
  color = '#1c3b2e',
  strokeWidth = 3,
}) => (
  <svg viewBox="0 0 20 20" width={size} height={size}>
    <path
      d="M4 10.5 l4 4 l8 -9"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cross: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({
  size = 24,
  color = '#7a2f2a',
  strokeWidth = 3,
}) => (
  <svg viewBox="0 0 20 20" width={size} height={size}>
    <path
      d="M6 6l8 8 M14 6l-8 8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);
