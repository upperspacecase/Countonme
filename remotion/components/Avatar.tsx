import React from 'react';

export const Avatar: React.FC<{ color: string; size?: number }> = ({ color, size = 64 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size}>
    <circle cx="16" cy="16" r="15" fill={color} stroke="#2b2b2b" strokeWidth={1.2} />
    <circle cx="16" cy="13" r="5" fill="#2b2b2b" />
    <path d="M5 27 c 4 -8 18 -8 22 0" fill="#2b2b2b" />
  </svg>
);
