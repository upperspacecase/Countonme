import React from 'react';
import { Composition } from 'remotion';
import { Demo, DEMO_DURATION, FPS, HEIGHT, WIDTH } from './Demo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SimplyAccountableDemo"
      component={Demo}
      durationInFrames={DEMO_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
